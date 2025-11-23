import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { authOptions } from "@/lib/auth";
import {
  withValidation,
  updateProfileRequestSchema,
  profileResponseSchema,
  type UpdateProfileRequest,
} from "@/lib/schemas";

export const GET = withValidation(async () => {
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

    // Validate response
    const validatedProfile = profileResponseSchema.parse(profile.toObject());

    return NextResponse.json(validatedProfile);
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch profile",
        details:
          error instanceof Error
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : "Unknown error",
      },
      { status: 500 },
    );
  }
});

export const PUT = withValidation<UpdateProfileRequest>(
  async ({ body }) => {
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 },
      );
    }

    try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectToDatabase();

      const profile = await Profile.findOneAndUpdate(
        { userId: session.user.id },
        { ...body, profileCompleted: true },
        { new: true, upsert: true },
      );

      // Validate response
      const validatedProfile = profileResponseSchema.parse(profile.toObject());

      return NextResponse.json(validatedProfile);
    } catch (error) {
      console.error("Update profile error:", error);
      return NextResponse.json(
        {
          error: "Failed to update profile",
          details:
            error instanceof Error
              ? error instanceof Error
                ? error.message
                : "Unknown error"
              : "Unknown error",
        },
        { status: 500 },
      );
    }
  },
  {
    bodySchema: updateProfileRequestSchema,
  },
);
