import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import { sendAdminInteracTrustRequestAlert } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { appointmentId, token } = body as {
      appointmentId?: string;
      token?: string;
    };

    if (!appointmentId) {
      return NextResponse.json(
        { error: "appointmentId is required" },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);

    const appointment = await Appointment.findById(appointmentId)
      .populate("clientId", "firstName lastName email")
      .populate("professionalId", "firstName lastName");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    let clientUserId: string;

    if (token) {
      const t = appointment.payment?.paymentToken;
      const exp = appointment.payment?.paymentTokenExpiry;
      const valid =
        t === token && exp && new Date(exp) > new Date();
      if (!valid) {
        return NextResponse.json(
          { error: "Invalid or expired payment link" },
          { status: 403 },
        );
      }
      const cid = appointment.clientId as unknown as {
        _id: { toString: () => string };
      };
      clientUserId = cid._id.toString();
    } else {
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      clientUserId = appointment.clientId.toString();
      if (clientUserId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    if (appointment.status !== "scheduled") {
      return NextResponse.json(
        {
          error:
            "Cette option est disponible uniquement pour un rendez-vous confirmé.",
        },
        { status: 400 },
      );
    }

    const user = await User.findById(clientUserId);
    if (!user) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (
      user.paymentGuaranteeStatus === "green" &&
      user.paymentGuaranteeSource === "stripe"
    ) {
      return NextResponse.json(
        {
          error:
            "Une carte ou un PAD est déjà enregistré. Utilisez la facturation pour gérer vos moyens de paiement.",
        },
        { status: 400 },
      );
    }

    if (
      user.paymentGuaranteeStatus === "green" &&
      user.paymentGuaranteeSource === "interac_trust"
    ) {
      return NextResponse.json(
        { error: "Une entente de confiance est déjà en place." },
        { status: 400 },
      );
    }

    const prevStatus = user.paymentGuaranteeStatus;

    await Appointment.findByIdAndUpdate(appointmentId, {
      "payment.method": "transfer",
      awaitingPaymentGuarantee: false,
    });

    await User.findByIdAndUpdate(clientUserId, {
      $set: { paymentGuaranteeStatus: "pending_admin" },
      $unset: { paymentGuaranteeSource: "" },
    });

    const client = appointment.clientId as unknown as {
      firstName: string;
      lastName: string;
      email: string;
    };

    if (prevStatus !== "pending_admin") {
      sendAdminInteracTrustRequestAlert({
        clientName: `${client.firstName} ${client.lastName}`,
        clientEmail: client.email,
        appointmentId: String(appointment._id),
      }).catch((err) =>
        console.error("sendAdminInteracTrustRequestAlert:", err),
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("request-transfer-guarantee:", error);
    return NextResponse.json(
      {
        error: "Failed to submit request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
