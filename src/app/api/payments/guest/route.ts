import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import { stripe, toCents } from "@/lib/stripe";

// GET - Get appointment details by payment token
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Payment token is required" },
        { status: 400 },
      );
    }

    const appointment = await Appointment.findOne({
      "payment.paymentToken": token,
      "payment.paymentTokenExpiry": { $gt: new Date() },
    })
      .populate("clientId", "firstName lastName email")
      .populate("professionalId", "firstName lastName");

    if (!appointment) {
      return NextResponse.json(
        { error: "Invalid or expired payment link" },
        { status: 404 },
      );
    }

    // Check if appointment is still valid
    if (appointment.status === "cancelled") {
      return NextResponse.json(
        { error: "This appointment has been cancelled" },
        { status: 400 },
      );
    }

    const client = appointment.clientId as unknown as {
      firstName: string;
      lastName: string;
      email: string;
    };

    const professional = appointment.professionalId as unknown as {
      firstName: string;
      lastName: string;
    };

    return NextResponse.json({
      appointmentId: appointment._id,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      therapyType: appointment.therapyType,
      price: appointment.payment.price,
      guestName: `${client.firstName} ${client.lastName}`,
      guestEmail: client.email,
      professionalName: `${professional.firstName} ${professional.lastName}`,
      alreadyPaid: appointment.payment.status === "paid",
      paidAt: appointment.payment.paidAt,
    });
  } catch (error) {
    console.error("Error fetching guest appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment details" },
      { status: 500 },
    );
  }
}

// POST - Create payment intent for guest payment
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Payment token is required" },
        { status: 400 },
      );
    }

    const appointment = await Appointment.findOne({
      "payment.paymentToken": token,
      "payment.paymentTokenExpiry": { $gt: new Date() },
    })
      .populate("clientId", "firstName lastName email stripeCustomerId")
      .populate("professionalId", "firstName lastName");

    if (!appointment) {
      return NextResponse.json(
        { error: "Invalid or expired payment link" },
        { status: 404 },
      );
    }

    // Check if already paid
    if (appointment.payment.status === "paid") {
      return NextResponse.json(
        { error: "This appointment has already been paid" },
        { status: 400 },
      );
    }

    // Check if appointment is confirmed (scheduled)
    if (appointment.status !== "scheduled") {
      return NextResponse.json(
        { error: "This appointment is not available for payment" },
        { status: 400 },
      );
    }

    const client = appointment.clientId as unknown as {
      _id: { toString: () => string };
      email: string;
      firstName: string;
      lastName: string;
      stripeCustomerId?: string;
    };

    const professional = appointment.professionalId as unknown as {
      _id: { toString: () => string };
      firstName: string;
      lastName: string;
    };

    const amount = appointment.payment.price;
    const platformFee = appointment.payment.platformFee;
    const professionalPayout = appointment.payment.professionalPayout;

    // Get or create Stripe customer for guest
    let customerId = client.stripeCustomerId;

    if (!customerId) {
      const existingCustomers = await stripe.customers.list({
        email: client.email.toLowerCase(),
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: client.email.toLowerCase(),
          name: `${client.firstName} ${client.lastName}`,
          metadata: {
            visitorId: client._id.toString(),
            type: "guest",
          },
        });
        customerId = customer.id;
      }

      // Update guest user with Stripe customer ID
      await User.findByIdAndUpdate(client._id, {
        stripeCustomerId: customerId,
      });
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toCents(amount),
      currency: "cad",
      customer: customerId,
      metadata: {
        appointmentId: String(appointment._id),
        visitorId: client._id.toString(),
        visitorEmail: client.email,
        professionalId: professional._id.toString(),
        sessionDate: appointment.date.toISOString(),
        sessionTime: appointment.time,
        platformFee: platformFee.toString(),
        professionalPayout: professionalPayout.toString(),
        type: "guest_payment",
      },
      description: `Therapy session with ${professional.firstName} ${professional.lastName} on ${appointment.date.toLocaleDateString()}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update appointment payment information
    appointment.payment.stripePaymentIntentId = paymentIntent.id;
    appointment.payment.status = "processing";
    await appointment.save();

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: "CAD",
    });
  } catch (error) {
    console.error("Error creating guest payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
