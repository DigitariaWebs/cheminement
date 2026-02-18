import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import BusinessManagerContact from "@/models/BusinessManagerContact";
import { authOptions } from "@/lib/auth";
import {
  sendBusinessManagerContactNotification,
  sendBusinessManagerConfirmationEmail,
} from "@/lib/notifications";

/**
 * GET /api/contact/business-manager
 * Retrieve business manager contacts (admins only)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can view business contacts
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

    const [contacts, total] = await Promise.all([
      BusinessManagerContact.find(query)
        .populate("assignedTo", "firstName lastName email")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      BusinessManagerContact.countDocuments(query),
    ]);

    return NextResponse.json({
      contacts,
      total,
      limit,
      skip,
    });
  } catch (error: unknown) {
    console.error(
      "Get business manager contacts error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to fetch business manager contacts",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/contact/business-manager
 * Submit a new business manager contact form (public endpoint)
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
      "company",
      "position",
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

    // Create business manager contact
    const contact = new BusinessManagerContact({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      company: data.company.trim(),
      position: data.position.trim(),
      coordinates: data.coordinates?.trim(),
      message: data.message?.trim(),
      status: "new",
    });

    await contact.save();

    // Send notifications asynchronously (don't block the response)
    Promise.all([
      sendBusinessManagerContactNotification({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        position: contact.position,
        coordinates: contact.coordinates,
        message: contact.message,
      }),
      sendBusinessManagerConfirmationEmail({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        position: contact.position,
        coordinates: contact.coordinates,
        message: contact.message,
      }),
    ]).catch((err) => {
      console.error("Error sending business manager contact emails:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Business manager contact submitted successfully",
        contactId: contact._id,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(
      "Business manager contact submission error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to submit business manager contact",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/contact/business-manager
 * Update a business manager contact (admins only)
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();
    const { contactId, status, assignedTo, notes } = data;

    if (!contactId) {
      return NextResponse.json({ error: "Missing contactId" }, { status: 400 });
    }

    const updateData: {
      status?: string;
      assignedTo?: string;
      notes?: string;
    } = {};

    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (notes !== undefined) updateData.notes = notes;

    const contact = await BusinessManagerContact.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true },
    ).populate("assignedTo", "firstName lastName email");

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error: unknown) {
    console.error(
      "Update business manager contact error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to update business manager contact",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
