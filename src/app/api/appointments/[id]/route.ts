import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { authOptions } from "@/lib/auth";

import { stripe } from "@/lib/stripe";

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
      .populate("professionalId", "firstName lastName email phone");

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
  } catch (error: any) {
    console.error("Get appointment error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment", details: error.message },
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

    const appointment = await Appointment.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate("clientId", "firstName lastName email phone")
      .populate("professionalId", "firstName lastName email phone");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Send cancellation notification if status changed to cancelled
    if (
      oldAppointment &&
      data.status === "cancelled" &&
      oldAppointment.status !== "cancelled"
    ) {
      const cancelledBy =
        session.user.role === "client" ? "client" : "professional";

      // Send notification without blocking the response
      // Temporarily disabled for development/testing
      /*
      sendCancellationNotification(emailData).catch((err) =>
        console.error("Error sending cancellation notification:", err),
      );
      */

      // Process automatic refund if appointment was paid
      if (
        appointment.stripePaymentIntentId &&
        appointment.paymentStatus === "paid"
      ) {
        try {
          console.log(
            `Processing automatic refund for appointment ${id} (Payment Intent: ${appointment.stripePaymentIntentId})`,
          );

          const refund = await stripe.refunds.create({
            payment_intent: appointment.stripePaymentIntentId,
            reason: "requested_by_customer",
            metadata: {
              appointmentId: id,
              cancelledBy: cancelledBy,
              refundReason: data.cancelReason || "Appointment cancelled",
            },
          });

          // Update payment status to refunded
          appointment.paymentStatus = "refunded";
          appointment.refundedAt = new Date();
          await appointment.save();

          console.log(
            `Refund processed successfully: ${refund.id} - Amount: $${refund.amount / 100}`,
          );
        } catch (refundError: any) {
          console.error("Error processing automatic refund:", refundError);
          // Don't fail the cancellation if refund fails - log it for manual processing
          console.error(
            `Manual refund required for appointment ${id}. Payment Intent: ${appointment.stripePaymentIntentId}`,
          );
        }
      } else if (appointment.paymentStatus === "pending") {
        // If payment is still pending, mark as cancelled
        appointment.paymentStatus = "cancelled";
        await appointment.save();
      }
    }

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment", details: error.message },
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
  } catch (error: any) {
    console.error("Delete appointment error:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment", details: error.message },
      { status: 500 },
    );
  }
}
