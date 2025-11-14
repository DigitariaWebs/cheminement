import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const profile = await Profile.findOne({ userId: session.user.id });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();

    const profile = await Profile.findOneAndUpdate(
      { userId: session.user.id },
      { ...data, profileCompleted: true },
      { new: true, upsert: true }
    );

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  }
}
