import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { authOptions } from "@/lib/auth";

import { stripe } from "@/lib/stripe";

// Cancellation fee configuration
const CANCELLATION_FEE_PERCENTAGE = 0.15; // 15% cancellation fee
const HOURS_BEFORE_APPOINTMENT_FOR_FREE_CANCELLATION = 24; // Free cancellation if more than 24 hours before

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { id } = await params;

    const appointment = await Appointment.findById(id)
      .populate("clientId", "firstName lastName email phone")
      .populate("professionalId", "firstName lastName email phone")
      .populate("paymentId", "status");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Check if user has access to this appointment
    if (
      appointment.clientId._id.toString() !== session.user.id &&
      appointment.professionalId._id.toString() !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(appointment);
  } catch (error: unknown) {
    console.error("Get appointment error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch appointment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { id } = await params;
    const data = await req.json();

    // Get the appointment before update to check for status changes
    const oldAppointment = await Appointment.findById(id);

    // If status is being set to ongoing and scheduledStartAt is not provided,
    // derive scheduledStartAt from the existing date/time fields so that
    // timers can consistently count from the scheduled start time.
    if (data.status === "ongoing" && !data.scheduledStartAt && oldAppointment) {
      try {
        const baseDate =
          oldAppointment.date instanceof Date
            ? new Date(oldAppointment.date)
            : new Date(oldAppointment.date);
        if (!isNaN(baseDate.getTime())) {
          const [hoursStr, minutesStr] = (oldAppointment.time || "00:00").split(
            ":",
          );
          const hours = parseInt(hoursStr || "0", 10);
          const minutes = parseInt(minutesStr || "0", 10);
          baseDate.setHours(hours);
          baseDate.setMinutes(minutes);
          baseDate.setSeconds(0);
          baseDate.setMilliseconds(0);
          data.scheduledStartAt = baseDate;
        }
      } catch {
        // If anything goes wrong deriving scheduledStartAt, skip setting it
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate("clientId", "firstName lastName email phone")
      .populate("professionalId", "firstName lastName email phone")
      .populate("paymentId", "status stripePaymentIntentId");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Send cancellation notification if status changed to cancelled
    if (
      oldAppointment &&
      appointment.status === "cancelled" &&
      oldAppointment.status !== "cancelled"
    ) {
      const cancelledBy =
        session.user.role === "client" ? "client" : "professional";

      // Update cancellation metadata
      appointment.cancelledBy = cancelledBy;
      appointment.cancelledAt = new Date();

      // Send notification without blocking the response
      // Temporarily disabled for development/testing
      /*
      sendCancellationNotification(emailData).catch((err) =>
        console.error("Error sending cancellation notification:", err),
      );
      */

      // Process automatic refund with fee calculation if appointment was paid
      if (
        appointment.payment.stripePaymentIntentId &&
        appointment.payment.status === "paid"
      ) {
        try {
          console.log(
            `Processing refund for appointment ${id} (Payment Intent: ${appointment.payment.stripePaymentIntentId})`,
          );

          // Calculate hours until appointment
          const appointmentDateTime = new Date(appointment.date);
          const now = new Date();
          const hoursUntilAppointment =
            (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

          // Determine if cancellation fee applies (only for client cancellations)
          const isFreeCancel =
            hoursUntilAppointment >=
            HOURS_BEFORE_APPOINTMENT_FOR_FREE_CANCELLATION;
          const isClientCancellation = cancelledBy === "client";

          let refundAmount = appointment.payment.price || 0;
          let cancellationFee = 0;

          // Apply cancellation fee only for client cancellations within 24 hours
          if (isClientCancellation && !isFreeCancel) {
            cancellationFee = refundAmount * CANCELLATION_FEE_PERCENTAGE;
            refundAmount = refundAmount - cancellationFee;
          }

          // Process refund through Stripe (in cents)
          const refundAmountCents = Math.round(refundAmount * 100);

          if (refundAmountCents > 0) {
            const refund = await stripe.refunds.create({
              payment_intent: appointment.payment.stripePaymentIntentId,
              amount: refundAmountCents,
              reason: "requested_by_customer",
              metadata: {
                appointmentId: id,
                cancelledBy: cancelledBy,
                cancellationFee: cancellationFee.toFixed(2),
                refundReason: data.cancelReason || "Appointment cancelled",
                hoursBeforeAppointment: hoursUntilAppointment.toFixed(2),
              },
            });

            console.log(
              `Refund processed successfully: ${refund.id} - Amount: $${refund.amount / 100} (Fee: $${cancellationFee.toFixed(2)})`,
            );
          } else {
            console.log(
              `No refund issued (100% cancellation fee applied): $${cancellationFee.toFixed(2)}`,
            );
          }

          // Update payment status to refunded
          appointment.payment.status = "refunded";
          appointment.payment.refundedAt = new Date();
          await appointment.save();
        } catch (refundError: unknown) {
          console.error("Error processing automatic refund:", refundError);
          // Don't fail the cancellation if refund fails - log it for manual processing
          console.error(
            `Manual refund required for appointment ${id}. Payment Intent: ${appointment.payment.stripePaymentIntentId}`,
          );
        }
      } else if (appointment.payment.status === "pending") {
        // If payment is still pending, mark as cancelled
        appointment.payment.status = "cancelled";
        await appointment.save();
      }
    }

    return NextResponse.json(appointment);
  } catch (error: unknown) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      {
        error: "Failed to update appointment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { id } = await params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error: unknown) {
    console.error("Delete appointment error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete appointment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
