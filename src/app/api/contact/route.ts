import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import ContactSubmission from "@/models/ContactSubmission";
import { authOptions } from "@/lib/auth";
import {
  sendContactSubmissionNotification,
  sendContactConfirmationEmail,
} from "@/lib/notifications";

/**
 * GET /api/contact
 * Retrieve contact submissions (admins only)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can view contact submissions
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    const query: { status?: string } = {};
    if (status) {
      query.status = status;
    }

    const [submissions, total] = await Promise.all([
      ContactSubmission.find(query)
        .populate("assignedTo", "firstName lastName email")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      ContactSubmission.countDocuments(query),
    ]);

    return NextResponse.json({
      submissions,
      total,
      limit,
      skip,
    });
  } catch (error: unknown) {
    console.error(
      "Get contact submissions error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to fetch contact submissions",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/contact
 * Submit a new contact form (public endpoint)
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "message",
    ];
    for (const field of requiredFields) {
      if (!data[field] || !data[field].trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Create contact submission
    const submission = new ContactSubmission({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      message: data.message.trim(),
      status: "new",
    });

    await submission.save();

    // Send notifications asynchronously (don't block the response)
    Promise.all([
      sendContactSubmissionNotification({
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email,
        phone: submission.phone,
        message: submission.message,
      }),
      sendContactConfirmationEmail({
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email,
        phone: submission.phone,
        message: submission.message,
      }),
    ]).catch((err) => {
      console.error("Error sending contact form emails:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        submissionId: submission._id,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(
      "Contact form submission error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to submit contact form",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/contact
 * Update a contact submission (admins only)
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();
    const { submissionId, status, assignedTo, notes } = data;

    if (!submissionId) {
      return NextResponse.json(
        { error: "Missing submissionId" },
        { status: 400 },
      );
    }

    const updateData: {
      status?: string;
      assignedTo?: string;
      notes?: string;
    } = {};

    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (notes !== undefined) updateData.notes = notes;

    const submission = await ContactSubmission.findByIdAndUpdate(
      submissionId,
      updateData,
      { new: true },
    ).populate("assignedTo", "firstName lastName email");

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(submission);
  } catch (error: unknown) {
    console.error(
      "Update contact submission error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to update contact submission",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
