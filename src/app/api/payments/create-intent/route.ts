import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, toCents, calculatePlatformFee } from "@/lib/stripe";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { appointmentId } = await req.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Get appointment details
    const appointment = await Appointment.findById(appointmentId)
      .populate("clientId", "email firstName lastName")
      .populate("professionalId", "firstName lastName");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Verify the user is the client for this appointment
    if ((appointment.clientId as any)._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You can only pay for your own appointments" },
        { status: 403 },
      );
    }

    // Check if appointment is confirmed by professional
    if (appointment.status === "pending") {
      return NextResponse.json(
        {
          error:
            "Cannot process payment until professional confirms the appointment",
        },
        { status: 400 },
      );
    }

    // Check if already paid
    if (appointment.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "This appointment has already been paid" },
        { status: 400 },
      );
    }

    const client = appointment.clientId as any;
    const professional = appointment.professionalId as any;
    const amount = appointment.price;
    const platformFee = calculatePlatformFee(amount);

    // Create or retrieve Stripe Customer for the client
    let customerId = null;

    // Search for existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: client.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: client.email,
        name: `${client.firstName} ${client.lastName}`,
        metadata: {
          userId: session.user.id,
          role: "client",
        },
      });
      customerId = customer.id;
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toCents(amount),
      currency: "cad",
      customer: customerId,
      metadata: {
        appointmentId: (appointment._id as any).toString(),
        clientId: session.user.id,
        professionalId: (appointment.professionalId as any)._id.toString(),
        sessionDate: appointment.date.toISOString(),
        sessionTime: appointment.time,
        platformFee: platformFee.toString(),
        professionalPayout: appointment.professionalPayout.toString(),
      },
      description: `Therapy session with ${professional.firstName} ${professional.lastName} on ${appointment.date.toLocaleDateString()}`,
      // Enable automatic payment methods
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update appointment with payment intent ID
    appointment.stripePaymentIntentId = paymentIntent.id;
    appointment.paymentStatus = "processing";
    await appointment.save();

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: "CAD",
    });
  } catch (error: any) {
    console.error("Create payment intent error:", error);
    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
