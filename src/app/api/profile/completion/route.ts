import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/profile/completion
 * Get profile completion status
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completionStatus = user.profileCompletionStatus || {
      personalInfo: false,
      paymentMethod: false,
      preferences: false,
      completed: false,
    };

    // Calculate actual completion
    const hasPersonalInfo = !!(
      user.firstName &&
      user.lastName &&
      user.email &&
      user.phone &&
      user.dateOfBirth
    );

    const hasPaymentMethod =
      user.paymentMethods && user.paymentMethods.length > 0;

    const hasPreferences = !!(user.language && user.location);

    const isCompleted = hasPersonalInfo && hasPaymentMethod && hasPreferences;

    // Update if needed
    if (
      hasPersonalInfo !== completionStatus.personalInfo ||
      hasPaymentMethod !== completionStatus.paymentMethod ||
      hasPreferences !== completionStatus.preferences ||
      isCompleted !== completionStatus.completed
    ) {
      user.profileCompletionStatus = {
        personalInfo: hasPersonalInfo,
        paymentMethod: hasPaymentMethod ?? false,
        preferences: hasPreferences,
        completed: isCompleted ?? false,
      };
      await user.save();
    }

    const currentStatus = user.profileCompletionStatus || {
      personalInfo: false,
      paymentMethod: false,
      preferences: false,
      completed: false,
    };

    return NextResponse.json({
      completion: currentStatus,
      details: {
        hasPersonalInfo,
        hasPaymentMethod: hasPaymentMethod ?? false,
        hasPreferences,
        isCompleted: isCompleted ?? false,
      },
      nextSteps: getNextSteps(currentStatus),
    });
  } catch (error: unknown) {
    console.error(
      "Get profile completion error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to get profile completion status",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/profile/completion
 * Update profile completion step
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();
    const { step, completed } = data;

    if (
      !step ||
      !["personalInfo", "paymentMethod", "preferences"].includes(step)
    ) {
      return NextResponse.json({ error: "Invalid step" }, { status: 400 });
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.profileCompletionStatus) {
      user.profileCompletionStatus = {
        personalInfo: false,
        paymentMethod: false,
        preferences: false,
        completed: false,
      };
    }

    user.profileCompletionStatus[
      step as keyof typeof user.profileCompletionStatus
    ] = completed;

    // Check if profile is fully completed
    user.profileCompletionStatus.completed =
      user.profileCompletionStatus.personalInfo &&
      user.profileCompletionStatus.paymentMethod &&
      user.profileCompletionStatus.preferences;

    await user.save();

    return NextResponse.json({
      success: true,
      completion: user.profileCompletionStatus,
      nextSteps: getNextSteps(user.profileCompletionStatus),
    });
  } catch (error: unknown) {
    console.error(
      "Update profile completion error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to update profile completion",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

function getNextSteps(completion: {
  personalInfo: boolean;
  paymentMethod: boolean;
  preferences: boolean;
  completed: boolean;
}) {
  const steps = [];

  if (!completion.personalInfo) {
    steps.push({
      step: "personalInfo",
      title: "Complete Personal Information",
      description: "Add your name, phone, date of birth",
      priority: 1,
    });
  }

  if (!completion.paymentMethod) {
    steps.push({
      step: "paymentMethod",
      title: "Add Payment Method",
      description: "Add a credit card, bank transfer, or direct debit",
      priority: 2,
    });
  }

  if (!completion.preferences) {
    steps.push({
      step: "preferences",
      title: "Set Preferences",
      description: "Choose your language and location",
      priority: 3,
    });
  }

  if (completion.completed) {
    steps.push({
      step: "completed",
      title: "Profile Complete",
      description: "You can now book appointments",
      priority: 4,
    });
  }

  return steps;
}
