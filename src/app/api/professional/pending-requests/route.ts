import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Profile from "@/models/Profile";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/professional/pending-requests
 * Get pending appointment requests matched to the professional
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "professional") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");

    // Get professional's profile to check expertise
    const professionalProfile = await Profile.findOne({
      userId: session.user.id,
    });

    // Find appointments that either:
    // 1. Have been specifically proposed to this professional
    // 2. Are general pending requests that match professional's expertise
    const query: {
      status?: string;
      routingStatus?: string | { $in: string[] };
      $or?: {
        proposedTo?: mongoose.Types.ObjectId;
        professionalId?: null | mongoose.Types.ObjectId;
      }[];
    } = {
      status,
      routingStatus: { $in: ["pending", "proposed"] },
      $or: [
        // Specifically proposed to this professional
        { proposedTo: session.user.id as unknown as mongoose.Types.ObjectId },
        // General pending with no professional assigned
        {
          professionalId: null,
        },
      ],
    };

    // Exclude appointments this professional has already refused
    const appointments = await Appointment.find(query)
      .populate("clientId", "firstName lastName email phone location language")
      .populate("lovedOneInfo")
      .populate("referralInfo")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Filter out appointments this professional has refused
    const filtered = appointments.filter(
      (apt) =>
        !apt.refusedBy?.includes(
          session.user.id as unknown as mongoose.Types.ObjectId,
        ),
    );

    // Calculate matching score for each appointment
    const appointmentsWithScore = filtered.map((apt) => {
      const matchScore = calculateMatchScore(apt, professionalProfile);
      return {
        ...apt.toObject(),
        matchScore,
        matchReasons: getMatchReasons(apt, professionalProfile),
      };
    });

    // Sort by match score
    appointmentsWithScore.sort((a, b) => b.matchScore - a.matchScore);

    const total = await Appointment.countDocuments(query);

    return NextResponse.json({
      requests: appointmentsWithScore,
      total,
      limit,
      skip,
    });
  } catch (error: unknown) {
    console.error(
      "Get pending requests error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to fetch pending requests",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/professional/pending-requests
 * Accept or refuse a pending appointment request
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "professional") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();
    const { appointmentId, action } = data;

    if (!appointmentId || !action || !["accept", "refuse"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid appointment ID or action" },
        { status: 400 },
      );
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    if (action === "accept") {
      // Assign professional to appointment
      appointment.professionalId = session.user
        .id as unknown as mongoose.Types.ObjectId;
      appointment.routingStatus = "accepted";
      appointment.status = "pending"; // Pending client confirmation

      // Add to proposedTo if not already there
      if (!appointment.proposedTo) {
        appointment.proposedTo = [];
      }
      if (
        !appointment.proposedTo.includes(
          session.user.id as unknown as mongoose.Types.ObjectId,
        )
      ) {
        appointment.proposedTo.push(
          session.user.id as unknown as mongoose.Types.ObjectId,
        );
      }

      await appointment.save();

      // TODO: Send notification to client that a professional has accepted
      // TODO: Trigger automated email to client

      return NextResponse.json({
        success: true,
        message: "Appointment request accepted",
        appointment,
      });
    } else {
      // Refuse the appointment
      if (!appointment.refusedBy) {
        appointment.refusedBy = [];
      }
      if (
        !appointment.refusedBy.includes(
          session.user.id as unknown as mongoose.Types.ObjectId,
        )
      ) {
        appointment.refusedBy.push(
          session.user.id as unknown as mongoose.Types.ObjectId,
        );
      }

      await appointment.save();

      return NextResponse.json({
        success: true,
        message: "Appointment request declined",
      });
    }
  } catch (error: unknown) {
    console.error(
      "Handle appointment request error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to handle appointment request",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

// Helper function to calculate match score
function calculateMatchScore(
  appointment: any,
  professionalProfile: any,
): number {
  if (!professionalProfile) return 0;

  let score = 0;

  // Match on issue type/motifs
  if (
    appointment.issueType &&
    professionalProfile.problematics?.includes(appointment.issueType)
  ) {
    score += 40;
  }

  // Match on therapy type
  if (
    appointment.therapyType &&
    professionalProfile.sessionTypes?.includes(appointment.therapyType)
  ) {
    score += 20;
  }

  // Match on modality (video/in-person)
  if (
    appointment.type &&
    professionalProfile.modalities?.includes(appointment.type)
  ) {
    score += 15;
  }

  // Match on language
  const clientLang = appointment.clientId?.language || "fr";
  if (professionalProfile.languages?.includes(clientLang)) {
    score += 15;
  }

  // Proximity match (simplified - would need actual geolocation)
  if (appointment.clientId?.location && professionalProfile.location) {
    score += 10;
  }

  return score;
}

// Helper function to get match reasons
function getMatchReasons(appointment: any, professionalProfile: any): string[] {
  const reasons = [];

  if (
    appointment.issueType &&
    professionalProfile?.problematics?.includes(appointment.issueType)
  ) {
    reasons.push(`Specialty match: ${appointment.issueType}`);
  }

  if (
    appointment.therapyType &&
    professionalProfile?.sessionTypes?.includes(appointment.therapyType)
  ) {
    reasons.push(`Session type: ${appointment.therapyType}`);
  }

  if (
    appointment.type &&
    professionalProfile?.modalities?.includes(appointment.type)
  ) {
    reasons.push(`Modality: ${appointment.type}`);
  }

  const clientLang = appointment.clientId?.language || "fr";
  if (professionalProfile?.languages?.includes(clientLang)) {
    reasons.push(`Language: ${clientLang}`);
  }

  return reasons;
}
