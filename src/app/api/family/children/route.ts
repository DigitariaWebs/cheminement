import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * GET /api/family/children
 * Get all child accounts linked to parent
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const parent = await User.findById(session.user.id);

    if (!parent) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all child accounts
    const children = await User.find({
      _id: { $in: parent.childAccounts || [] },
    }).select("-password");

    return NextResponse.json({
      children,
      parentAccount: {
        id: parent._id,
        name: `${parent.firstName} ${parent.lastName}`,
        accountType: parent.accountType,
      },
    });
  } catch (error: unknown) {
    console.error(
      "Get child accounts error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to fetch child accounts",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/family/children
 * Create a new child account linked to parent
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phone,
      relationshipToChild,
    } = data;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !relationshipToChild) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const parent = await User.findById(session.user.id);

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    // Update parent account type if not already set
    if (parent.accountType !== "parent") {
      parent.accountType = "parent";
    }

    // Generate a temporary email if not provided (for minors)
    const childEmail =
      email || `child.${firstName.toLowerCase()}.${Date.now()}@jechemine.app`;

    // Generate a random password for the child account
    const randomPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create child account
    const child = new User({
      email: childEmail,
      password: hashedPassword,
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      phone,
      role: "child",
      accountType: "child",
      parentId: parent._id,
      relationshipToChild,
      status: "active",
      language: parent.language || "fr",
      location: parent.location,
    });

    await child.save();

    // Add child to parent's child accounts
    if (!parent.childAccounts) {
      parent.childAccounts = [];
    }
    parent.childAccounts.push(child._id);
    await parent.save();

    return NextResponse.json(
      {
        success: true,
        message: "Child account created successfully",
        child: {
          id: child._id,
          firstName: child.firstName,
          lastName: child.lastName,
          dateOfBirth: child.dateOfBirth,
          accountType: child.accountType,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(
      "Create child account error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to create child account",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/family/children/[childId]
 * Get specific child account details
 */
export async function GET_CHILD(req: NextRequest, childId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const child = await User.findById(childId).select("-password");

    if (!child) {
      return NextResponse.json(
        { error: "Child account not found" },
        { status: 404 },
      );
    }

    // Verify the requester is the parent
    if (child.parentId?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ child });
  } catch (error: unknown) {
    console.error(
      "Get child account error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to fetch child account",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/family/children
 * Update child account information
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();
    const { childId, ...updates } = data;

    if (!childId) {
      return NextResponse.json(
        { error: "Child ID is required" },
        { status: 400 },
      );
    }

    const child = await User.findById(childId);

    if (!child) {
      return NextResponse.json(
        { error: "Child account not found" },
        { status: 404 },
      );
    }

    // Verify the requester is the parent
    if (child.parentId?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update allowed fields
    const allowedUpdates = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "phone",
      "email",
      "location",
    ];

    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (child as any)[key] = updates[key];
      }
    });

    await child.save();

    return NextResponse.json({
      success: true,
      message: "Child account updated successfully",
      child: {
        id: child._id,
        firstName: child.firstName,
        lastName: child.lastName,
        dateOfBirth: child.dateOfBirth,
      },
    });
  } catch (error: unknown) {
    console.error(
      "Update child account error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to update child account",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/family/children
 * Remove child account (soft delete - deactivate)
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const childId = searchParams.get("childId");

    if (!childId) {
      return NextResponse.json(
        { error: "Child ID is required" },
        { status: 400 },
      );
    }

    const child = await User.findById(childId);

    if (!child) {
      return NextResponse.json(
        { error: "Child account not found" },
        { status: 404 },
      );
    }

    // Verify the requester is the parent
    if (child.parentId?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete - set status to inactive
    child.status = "inactive";
    await child.save();

    // Remove from parent's child accounts list
    const parent = await User.findById(session.user.id);
    if (parent && parent.childAccounts) {
      parent.childAccounts = parent.childAccounts.filter(
        (id) => id.toString() !== childId,
      );
      await parent.save();
    }

    return NextResponse.json({
      success: true,
      message: "Child account deactivated successfully",
    });
  } catch (error: unknown) {
    console.error(
      "Delete child account error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to delete child account",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
