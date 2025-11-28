import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, toCents } from "@/lib/stripe";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { appointmentId, paymentMethod = "card" } = await req.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 },
      );
    }

    // Validate payment method
    const validPaymentMethods = ["card", "transfer", "direct_debit"];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
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
    const clientDoc = appointment.clientId;
    const clientId =
      typeof clientDoc === "object" && clientDoc !== null && "_id" in clientDoc
        ? (clientDoc as { _id: { toString: () => string } })._id.toString()
        : String(clientDoc);

    if (clientId !== session.user.id) {
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
    if (appointment.payment.status === "paid") {
      return NextResponse.json(
        { error: "This appointment has already been paid" },
        { status: 400 },
      );
    }

    const client = appointment.clientId as unknown as {
      _id: { toString: () => string };
      email: string;
      firstName: string;
      lastName: string;
    };
    const professional = appointment.professionalId as unknown as {
      _id: { toString: () => string };
      firstName: string;
      lastName: string;
    };
    const amount = appointment.payment.price;
    const platformFee = appointment.payment.platformFee;
    const professionalPayout = appointment.payment.professionalPayout;

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

    // Configure payment method types based on selected method
    let paymentMethodTypes: string[] = ["card"];

    if (paymentMethod === "transfer") {
      // Bank transfer (EFT/ACH style) - using customer_balance for bank transfers
      paymentMethodTypes = ["customer_balance"];
    } else if (paymentMethod === "direct_debit") {
      // Pre-authorized debit for Canada
      paymentMethodTypes = ["acss_debit"];
    } else {
      // Default to card
      paymentMethodTypes = ["card"];
    }

    // Create Payment Intent with specific payment method types
    const paymentIntentConfig: Parameters<
      typeof stripe.paymentIntents.create
    >[0] = {
      amount: toCents(amount),
      currency: "cad",
      customer: customerId,
      metadata: {
        appointmentId: String(appointment._id),
        clientId: session.user.id,
        professionalId: professional._id.toString(),
        sessionDate: appointment.date.toISOString(),
        sessionTime: appointment.time,
        platformFee: platformFee.toString(),
        professionalPayout: professionalPayout.toString(),
        paymentMethod: paymentMethod,
      },
      description: `Therapy session with ${professional.firstName} ${professional.lastName} on ${appointment.date.toLocaleDateString()}`,
      payment_method_types: paymentMethodTypes,
    };

    // Add payment method options for direct debit (ACSS)
    if (paymentMethod === "direct_debit") {
      paymentIntentConfig.payment_method_options = {
        acss_debit: {
          mandate_options: {
            payment_schedule: "sporadic",
            transaction_type: "personal",
          },
          verification_method: "automatic",
        },
      };
    }

    // Add funding instructions for bank transfer
    if (paymentMethod === "transfer") {
      paymentIntentConfig.payment_method_data = {
        type: "customer_balance",
      };
      paymentIntentConfig.payment_method_options = {
        customer_balance: {
          funding_type: "bank_transfer",
          bank_transfer: {
            type: "us_bank_transfer",
          },
        },
      };
    }

    const paymentIntent =
      await stripe.paymentIntents.create(paymentIntentConfig);

    // Update appointment payment information
    appointment.payment.stripePaymentIntentId = paymentIntent.id;
    appointment.payment.status = "processing";
    appointment.payment.method = paymentMethod;
    await appointment.save();

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: "CAD",
    });
  } catch (error: unknown) {
    console.error(
      "Create payment intent error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
