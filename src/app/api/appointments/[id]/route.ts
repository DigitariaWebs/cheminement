import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { authOptions } from "@/lib/auth";
import { Error } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { id } = await params;

    const appointment = await Appointment.findById(id)
      .populate("clientId", "firstName lastName email phone")
      .populate("professionalId", "firstName lastName email phone");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Check if user has access to this appointment
    if (
      appointment.clientId._id.toString() !== session.user.id &&
      appointment.professionalId._id.toString() !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error("Get appointment error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment", details: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { id } = await params;
    const data = await req.json();

    const appointment = await Appointment.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate("clientId", "firstName lastName email phone")
      .populate("professionalId", "firstName lastName email phone");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { id } = await params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error: any) {
    console.error("Delete appointment error:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment", details: error.message },
      { status: 500 },
    );
  }
}
