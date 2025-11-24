import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import PlatformSettings from "@/models/PlatformSettings";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    let settings = await PlatformSettings.findOne();

    // If no settings exist, create default settings
    if (!settings) {
      settings = new PlatformSettings({
        defaultPricing: {
          solo: 120,
          couple: 150,
          group: 80,
        },
        platformFeePercentage: 10,
        currency: "CAD",
        cancellationPolicy: {
          clientCancellationHours: 24,
          clientRefundPercentage: 100,
          professionalCancellationHours: 12,
        },
      });
      await settings.save();
    }

    return NextResponse.json(settings);
  } catch (error: unknown) {
    console.error("Get platform settings error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch platform settings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();

    // Validate pricing values
    if (data.defaultPricing) {
      if (
        data.defaultPricing.solo < 0 ||
        data.defaultPricing.couple < 0 ||
        data.defaultPricing.group < 0
      ) {
        return NextResponse.json(
          { error: "Pricing values must be positive" },
          { status: 400 },
        );
      }
    }

    // Validate platform fee percentage
    if (
      data.platformFeePercentage !== undefined &&
      (data.platformFeePercentage < 0 || data.platformFeePercentage > 100)
    ) {
      return NextResponse.json(
        { error: "Platform fee percentage must be between 0 and 100" },
        { status: 400 },
      );
    }

    let settings = await PlatformSettings.findOne();

    if (!settings) {
      // Create new settings
      settings = new PlatformSettings(data);
      await settings.save();
    } else {
      // Update existing settings
      Object.assign(settings, data);
      await settings.save();
    }

    return NextResponse.json(settings);
  } catch (error: unknown) {
    console.error("Update platform settings error:", error);
    return NextResponse.json(
      {
        error: "Failed to update platform settings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
