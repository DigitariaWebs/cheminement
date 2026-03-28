import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const pending = await User.find({
      role: { $in: ["client", "guest"] },
      paymentGuaranteeStatus: "pending_admin",
    })
      .select("firstName lastName email phone createdAt")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      requests: pending.map((u) => ({
        id: u._id.toString(),
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        requestedAt: u.updatedAt?.toISOString() ?? u.createdAt?.toISOString(),
      })),
    });
  } catch (error: unknown) {
    console.error("payment-guarantee-requests GET:", error);
    return NextResponse.json(
      { error: "Failed to load requests" },
      { status: 500 },
    );
  }
}
