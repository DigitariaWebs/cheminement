import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Stripe from "stripe";

// Disable body parsing, need raw body for webhook signature verification
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  await connectToDatabase();

  // Handle different event types
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;

      case "payment_intent.canceled":
        await handlePaymentIntentCanceled(event.data.object);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed", details: message },
      { status: 500 },
    );
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
) {
  console.log("Payment succeeded:", paymentIntent.id);

  const appointmentId = paymentIntent.metadata.appointmentId;

  if (!appointmentId) {
    console.error("No appointmentId in payment intent metadata");
    return;
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    console.error(`Appointment ${appointmentId} not found`);
    return;
  }

  // Update appointment payment status
  appointment.paymentStatus = "paid";
  appointment.stripePaymentIntentId = paymentIntent.id;
  appointment.paidAt = new Date();

  // Store payment method if available
  if (paymentIntent.payment_method) {
    appointment.stripePaymentMethodId =
      typeof paymentIntent.payment_method === "string"
        ? paymentIntent.payment_method
        : paymentIntent.payment_method.id;
  }

  await appointment.save();

  console.log(`Appointment ${appointmentId} payment completed`);

  // TODO: Send confirmation email to client
  // TODO: Send notification to professional
  // TODO: Schedule payout to professional
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment failed:", paymentIntent.id);

  const appointmentId = paymentIntent.metadata.appointmentId;

  if (!appointmentId) {
    console.error("No appointmentId in payment intent metadata");
    return;
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    console.error(`Appointment ${appointmentId} not found`);
    return;
  }

  appointment.paymentStatus = "failed";
  await appointment.save();

  console.log(`Appointment ${appointmentId} payment failed`);

  // TODO: Send payment failed notification to client
  // TODO: Optionally cancel appointment if payment required upfront
}

async function handlePaymentIntentCanceled(
  paymentIntent: Stripe.PaymentIntent,
) {
  console.log("Payment canceled:", paymentIntent.id);

  const appointmentId = paymentIntent.metadata.appointmentId;

  if (!appointmentId) {
    return;
  }

  const appointment = await Appointment.findById(appointmentId);

  if (appointment) {
    appointment.paymentStatus = "cancelled";
    await appointment.save();
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log("Charge refunded:", charge.id);

  // Find appointment by payment intent
  if (!charge.payment_intent) {
    return;
  }

  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent.id;

  const appointment = await Appointment.findOne({
    stripePaymentIntentId: paymentIntentId,
  });

  if (!appointment) {
    console.error(
      `Appointment not found for payment intent ${paymentIntentId}`,
    );
    return;
  }

  appointment.paymentStatus = "refunded";
  appointment.refundedAt = new Date();
  await appointment.save();

  console.log(`Appointment ${appointment._id} refunded`);

  // TODO: Send refund confirmation to client
  // TODO: Notify professional about refund
}
