import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { appointmentId, reason } = await req.json();

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

    // Check if user is authorized (admin, professional, or the client)
    const isAuthorized =
      session.user.role === "admin" ||
      (appointment.professionalId as any)._id.toString() === session.user.id ||
      (appointment.clientId as any)._id.toString() === session.user.id;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "You are not authorized to refund this appointment" },
        { status: 403 },
      );
    }

    // Check if payment exists and was paid
    if (!appointment.stripePaymentIntentId) {
      return NextResponse.json(
        { error: "No payment found for this appointment" },
        { status: 400 },
      );
    }

    // Check if already refunded
    if (appointment.paymentStatus === "refunded") {
      return NextResponse.json(
        { error: "This appointment has already been refunded" },
        { status: 400 },
      );
    }

    if (appointment.paymentStatus !== "paid") {
      return NextResponse.json(
        {
          error: `Cannot refund appointment with payment status: ${appointment.paymentStatus}`,
        },
        { status: 400 },
      );
    }

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: appointment.stripePaymentIntentId,
      reason: "requested_by_customer",
      metadata: {
        appointmentId: appointmentId,
        refundedBy: session.user.id,
        refundReason: reason || "Appointment cancelled",
      },
    });

    // Update appointment payment status
    appointment.paymentStatus = "refunded";
    appointment.refundedAt = new Date();
    await appointment.save();

    return NextResponse.json({
      message: "Refund processed successfully",
      refund: {
        id: refund.id,
        amount: refund.amount / 100, // Convert from cents to dollars
        status: refund.status,
        refundedAt: appointment.refundedAt,
      },
      appointment: {
        id: appointment._id,
        paymentStatus: appointment.paymentStatus,
      },
    });
  } catch (error: any) {
    console.error(
      "Refund error:",
      error instanceof Error ? error.message : error,
    );

    // Handle specific Stripe errors
    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        {
          error: "Invalid refund request",
          details: error instanceof Error ? error.message : error,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to process refund",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
