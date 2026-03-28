import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import ProfessionalLedgerEntry from "@/models/ProfessionalLedgerEntry";
import Appointment from "@/models/Appointment";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "professional") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const proOid = new mongoose.Types.ObjectId(session.user.id);

    const entries = await ProfessionalLedgerEntry.find({
      professionalId: proOid,
    })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const pending = await Appointment.aggregate<{
      _id: null;
      total: number;
    }>([
      {
        $match: {
          professionalId: proOid,
          status: { $in: ["completed", "no-show"] },
          "payment.status": "pending",
          "payment.professionalPayout": { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$payment.professionalPayout" },
        },
      },
    ]);

    const pendingPayoutCad = pending[0]?.total ?? 0;

    return NextResponse.json({
      entries,
      pendingPayoutCad,
    });
  } catch (e: unknown) {
    console.error("GET /api/professional/ledger-entries:", e);
    return NextResponse.json(
      { error: "Failed to load ledger" },
      { status: 500 },
    );
  }
}
