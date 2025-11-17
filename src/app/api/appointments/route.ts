import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Profile from "@/models/Profile";
import User from "@/models/User";
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
    const clientId = searchParams.get("clientId");

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

    if (clientId) {
      query.clientId = clientId;
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
      { status: 500 },
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

    // Validate required fields
    if (!data.professionalId || !data.date || !data.time || !data.type) {
      return NextResponse.json(
        { error: "Missing required fields: professionalId, date, time, type" },
        { status: 400 },
      );
    }

    // Verify professional exists and is active
    const professional = await User.findOne({
      _id: data.professionalId,
      role: "professional",
      status: { $in: ["active", "pending"] },
    });

    if (!professional) {
      return NextResponse.json(
        { error: "Professional not found" },
        { status: 404 },
      );
    }

    // Get professional's profile for availability and pricing
    const profile = await Profile.findOne({ userId: data.professionalId });

    if (!profile) {
      return NextResponse.json(
        { error: "Professional profile not found" },
        { status: 404 },
      );
    }

    // Validate date is not in the past
    const appointmentDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return NextResponse.json(
        { error: "Cannot book appointments in the past" },
        { status: 400 },
      );
    }

    // Check if professional is available on the requested day
    if (profile.availability?.days) {
      const dayOfWeek = appointmentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const dayAvailability = profile.availability.days.find(
        (d) => d.day === dayOfWeek,
      );

      if (!dayAvailability || !dayAvailability.isWorkDay) {
        return NextResponse.json(
          { error: `Professional is not available on ${dayOfWeek}s` },
          { status: 400 },
        );
      }

      // Validate time is within working hours
      const requestedTime = data.time;
      if (
        requestedTime < dayAvailability.startTime ||
        requestedTime >= dayAvailability.endTime
      ) {
        return NextResponse.json(
          {
            error: `Time slot outside of working hours (${dayAvailability.startTime} - ${dayAvailability.endTime})`,
          },
          { status: 400 },
        );
      }
    }

    // Check for double-booking
    const existingAppointment = await Appointment.findOne({
      professionalId: data.professionalId,
      date: appointmentDate,
      time: data.time,
      status: { $in: ["scheduled"] },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 },
      );
    }

    // Set default duration from profile or default to 60 minutes
    if (!data.duration) {
      data.duration = profile.availability?.sessionDurationMinutes || 60;
    }

    // Generate meeting link for video appointments
    if (data.type === "video" && !data.meetingLink) {
      // In a real app, integrate with Zoom/Teams/etc API
      data.meetingLink = `https://meet.jecheminement.com/${Date.now()}`;
    }

    const appointment = new Appointment(data);
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("clientId", "firstName lastName email phone")
      .populate("professionalId", "firstName lastName email phone");

    if (!populatedAppointment) {
      return NextResponse.json(
        { error: "Appointment created but not found" },
        { status: 500 },
      );
    }

    // Send email notifications (non-blocking)

    // Send notifications without blocking the response
    // Temporarily disabled for development/testing
    /*
    Promise.all([
      sendAppointmentConfirmation(emailData),
      sendProfessionalNotification(emailData),
    ]).catch((err) => console.error("Error sending notifications:", err));
    */

    return NextResponse.json(populatedAppointment, { status: 201 });
  } catch (error: any) {
    console.error("Create appointment error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment", details: error.message },
      { status: 500 },
    );
  }
}
