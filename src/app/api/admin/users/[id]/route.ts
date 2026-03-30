import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Profile from "@/models/Profile";
import Appointment from "@/models/Appointment";
import MedicalProfile from "@/models/MedicalProfile";
import Admin from "@/models/Admin";
import { authOptions } from "@/lib/auth";

async function assertSuperAdmin(sessionUserId: string) {
  const admin = await Admin.findOne({ userId: sessionUserId, isActive: true })
    .select("role permissions")
    .lean();
  if (!admin) return null;
  return admin;
}

// GET /api/admin/users/[id] — Full user detail
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    const admin = await assertSuperAdmin(session.user.id);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get profile (professional)
    const profile = await Profile.findOne({ userId: id }).lean();

    // Get medical profile (client)
    const medicalProfile = await MedicalProfile.findOne({ userId: id }).lean();

    // Get appointment stats
    const totalAppointments = await Appointment.countDocuments({
      $or: [{ clientId: id }, { professionalId: id }],
    });
    const completedSessions = await Appointment.countDocuments({
      $or: [{ clientId: id }, { professionalId: id }],
      status: "completed",
    });
    const noShowCount = await Appointment.countDocuments({
      $or: [{ clientId: id }, { professionalId: id }],
      status: "no-show",
    });

    return NextResponse.json({
      user: {
        id: (user._id as any).toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        status: user.status,
        location: user.location || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || null,
        language: user.language || "fr",
        paymentGuaranteeStatus: user.paymentGuaranteeStatus || "none",
        paymentGuaranteeSource: user.paymentGuaranteeSource || null,
        stripeCustomerId: user.stripeCustomerId || null,
        stripeConnectAccountId: user.stripeConnectAccountId || null,
        professionalLicenseStatus: user.professionalLicenseStatus || "not_applicable",
        emailVerified: user.emailVerified || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      profile: profile
        ? {
            specialty: profile.specialty || "",
            license: profile.license || "",
            bio: profile.bio || "",
            approaches: profile.approaches || [],
            problematics: profile.problematics || [],
            languages: profile.languages || [],
            yearsOfExperience: profile.yearsOfExperience || 0,
            certifications: profile.certifications || [],
            profileCompleted: profile.profileCompleted,
          }
        : null,
      medicalProfile: medicalProfile
        ? {
            primaryIssue: medicalProfile.primaryIssue || "",
            severity: medicalProfile.severity || "",
            profileCompleted: medicalProfile.profileCompleted,
          }
        : null,
      stats: {
        totalAppointments,
        completedSessions,
        noShowCount,
      },
    });
  } catch (error) {
    console.error("Admin user detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user", details: error instanceof Error ? error.message : error },
      { status: 500 },
    );
  }
}

// PUT /api/admin/users/[id] — Update user fields
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    const admin = await assertSuperAdmin(session.user.id);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    // Allowed user fields to update
    const allowedUserFields = [
      "firstName", "lastName", "email", "phone", "location",
      "gender", "dateOfBirth", "language", "status",
    ];
    // Allowed profile fields
    const allowedProfileFields = [
      "specialty", "license", "bio", "approaches", "problematics",
      "languages", "yearsOfExperience", "certifications",
    ];

    const userUpdates: Record<string, unknown> = {};
    const profileUpdates: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(body)) {
      if (allowedUserFields.includes(key)) {
        userUpdates[key] = value;
      } else if (allowedProfileFields.includes(key)) {
        profileUpdates[key] = value;
      }
    }

    // Update user
    if (Object.keys(userUpdates).length > 0) {
      const user = await User.findByIdAndUpdate(id, { $set: userUpdates }, { new: true, runValidators: true });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    // Update profile if there are profile fields
    if (Object.keys(profileUpdates).length > 0) {
      await Profile.findOneAndUpdate(
        { userId: id },
        { $set: profileUpdates },
        { new: true, upsert: true },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error instanceof Error ? error.message : error },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/users/[id] — Soft-delete (set status to inactive)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    const admin = await assertSuperAdmin(session.user.id);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { status: "inactive" } },
      { new: true },
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deactivated" });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: error instanceof Error ? error.message : error },
      { status: 500 },
    );
  }
}
