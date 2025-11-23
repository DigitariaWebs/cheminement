import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import MedicalProfile from "@/models/MedicalProfile";
import { authOptions } from "@/lib/auth";
import {
  withValidation,
  updateMedicalProfileRequestSchema,
  medicalProfileResponseSchema,
  type UpdateMedicalProfileRequest,
} from "@/lib/schemas";

export const GET = withValidation(async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const medicalProfile = await MedicalProfile.findOne({
      userId: session.user.id,
    });

    if (!medicalProfile) {
      return NextResponse.json(
        { error: "Medical profile not found" },
        { status: 404 },
      );
    }

    // Validate response
    const validatedProfile = medicalProfileResponseSchema.parse(
      medicalProfile.toObject(),
    );

    return NextResponse.json(validatedProfile);
  } catch (error) {
    console.error("Get medical profile error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch medical profile",
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

export const PUT = withValidation<UpdateMedicalProfileRequest>(
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

      const medicalProfile = await MedicalProfile.findOneAndUpdate(
        { userId: session.user.id },
        { ...body, profileCompleted: true },
        { new: true, upsert: true },
      );

      // Validate response
      const validatedProfile = medicalProfileResponseSchema.parse(
        medicalProfile.toObject(),
      );

      return NextResponse.json(validatedProfile);
    } catch (error) {
      console.error("Update medical profile error:", error);
      return NextResponse.json(
        {
          error: "Failed to update medical profile",
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
    bodySchema: updateMedicalProfileRequestSchema,
  },
);
