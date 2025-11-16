import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import MedicalProfile from "@/models/MedicalProfile";
import { authOptions } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/medical-profile/[id]">,
) {
  try {
    const session = await getServerSession(authOptions);
    const params = await ctx.params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const userId = params.id;

    // Only allow admins to fetch other users' medical profiles, or users to fetch their own
    if (session.user.role !== "admin" && session.user.id !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only access your own medical profile" },
        { status: 403 },
      );
    }

    const medicalProfile = await MedicalProfile.findOne({ userId });

    if (!medicalProfile) {
      return NextResponse.json(
        { error: "Medical profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(medicalProfile);
  } catch (error: unknown) {
    console.error("Get medical profile by ID error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch medical profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
