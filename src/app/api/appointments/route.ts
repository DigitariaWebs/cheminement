import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const query: any = {};

    // Filter by user role
    if (session.user.role === "client") {
      query.clientId = session.user.id;
    } else if (session.user.role === "professional") {
      query.professionalId = session.user.id;
    }

    // Additional filters
    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(query)
      .populate("clientId", "firstName lastName email phone")
      .populate("professionalId", "firstName lastName email phone")
      .sort({ date: 1, time: 1 });

    return NextResponse.json(appointments);
  } catch (error: any) {
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();

    // Ensure the client is the current user if role is client
    if (session.user.role === "client") {
      data.clientId = session.user.id;
    }

    const appointment = new Appointment(data);
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("clientId", "firstName lastName email phone")
      .populate("professionalId", "firstName lastName email phone");

    return NextResponse.json(populatedAppointment, { status: 201 });
  } catch (error: any) {
    console.error("Create appointment error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment", details: error.message },
      { status: 500 }
    );
  }
}
