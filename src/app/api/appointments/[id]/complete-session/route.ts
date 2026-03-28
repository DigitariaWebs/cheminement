import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { authOptions } from "@/lib/auth";
import {
  SESSION_ACT_NATURE_VALUES,
  SESSION_OUTCOME_VALUES,
  getAppointmentStatusForOutcome,
  getBillingFraction,
  roundMoney,
  type SessionActNature,
  type SessionOutcome,
} from "@/lib/session-closure";
import {
  calculatePlatformFee,
  calculateProfessionalPayout,
} from "@/lib/stripe";

function parseNextAppointmentAt(
  dateStr: string | undefined,
  timeStr: string | undefined,
): Date | undefined {
  if (!dateStr?.trim() || !timeStr?.trim()) return undefined;
  const [h, m] = timeStr.split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return undefined;
  const d = new Date(`${dateStr}T00:00:00`);
  if (isNaN(d.getTime())) return undefined;
  d.setHours(h, m, 0, 0);
  return d;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "professional") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const body = await req.json();
    const sessionActNature = body.sessionActNature as string | undefined;
    const sessionOutcome = body.sessionOutcome as string | undefined;
    const nextAppointmentDate = body.nextAppointmentDate as string | undefined;
    const nextAppointmentTime = body.nextAppointmentTime as string | undefined;

    if (
      !sessionActNature ||
      !SESSION_ACT_NATURE_VALUES.includes(
        sessionActNature as SessionActNature,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid or missing sessionActNature" },
        { status: 400 },
      );
    }

    if (
      !sessionOutcome ||
      !SESSION_OUTCOME_VALUES.includes(sessionOutcome as SessionOutcome)
    ) {
      return NextResponse.json(
        { error: "Invalid or missing sessionOutcome" },
        { status: 400 },
      );
    }

    const outcome = sessionOutcome as SessionOutcome;
    const nextAt = parseNextAppointmentAt(
      nextAppointmentDate,
      nextAppointmentTime,
    );

    if (outcome === "rescheduled_agreed" && !nextAt) {
      return NextResponse.json(
        {
          error:
            "nextAppointmentDate and nextAppointmentTime are required when rescheduling with agreement",
        },
        { status: 400 },
      );
    }

    const apt = await Appointment.findById(id);
    if (!apt) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    if (!apt.professionalId) {
      return NextResponse.json(
        { error: "Appointment has no assigned professional" },
        { status: 400 },
      );
    }

    if (apt.professionalId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!["ongoing", "scheduled"].includes(apt.status)) {
      return NextResponse.json(
        {
          error:
            "Session can only be closed when status is ongoing or scheduled",
        },
        { status: 400 },
      );
    }

    if (apt.sessionCompletedAt) {
      return NextResponse.json(
        { error: "Session has already been closed" },
        { status: 400 },
      );
    }

    const newStatus = getAppointmentStatusForOutcome(outcome);
    const fraction = getBillingFraction(outcome);

    const listPrice = roundMoney(
      apt.payment.listPrice ?? apt.payment.price ?? 0,
    );

    const paymentLocked =
      apt.payment.status === "paid" || apt.payment.status === "refunded";

    let price = apt.payment.price;
    let platformFee = apt.payment.platformFee;
    let professionalPayout = apt.payment.professionalPayout;
    let paymentStatus = apt.payment.status;

    if (!paymentLocked) {
      price = roundMoney(listPrice * fraction);
      platformFee = calculatePlatformFee(price);
      professionalPayout = calculateProfessionalPayout(price);
      if (price <= 0) {
        paymentStatus = "cancelled";
      }
    }

    const now = new Date();
    const due = new Date();
    due.setHours(due.getHours() + 24);

    const $set: Record<string, unknown> = {
      status: newStatus,
      sessionActNature,
      sessionOutcome: outcome,
      sessionCompletedAt: now,
      "payment.listPrice": apt.payment.listPrice ?? listPrice,
    };

    if (!paymentLocked) {
      $set["payment.price"] = price;
      $set["payment.platformFee"] = platformFee;
      $set["payment.professionalPayout"] = professionalPayout;
      $set["payment.status"] = paymentStatus;
    }

    if (nextAt) {
      $set.nextAppointmentAt = nextAt;
    }

    if (newStatus === "cancelled" && outcome === "rescheduled_agreed") {
      $set.cancelReason = "rescheduled_by_professional_agreement";
      $set.cancelledBy = "professional";
      $set.cancelledAt = now;
      if (!paymentLocked && price <= 0) {
        $set["payment.transferDueAt"] = null;
      }
    }

    const shouldSetTransferDue =
      !paymentLocked &&
      price > 0 &&
      apt.payment.method === "transfer" &&
      (newStatus === "completed" || newStatus === "no-show");

    if (shouldSetTransferDue) {
      $set["payment.transferDueAt"] = due;
    }

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { $set },
      { new: true },
    )
      .populate("clientId", "firstName lastName email phone location")
      .populate("professionalId", "firstName lastName email phone");

    if (!updated) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("complete-session error:", error);
    return NextResponse.json(
      {
        error: "Failed to complete session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
