import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Request from "@/models/Request";
import Appointment from "@/models/Appointment";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only professionals and admins can convert requests to appointments
    if (
      session.user.role !== "professional" &&
      session.user.role !== "admin" &&
      !session.user.isAdmin
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const { id } = await params;
    const data = await req.json();

    // Required fields for appointment conversion
    const { date, time, duration, type, professionalId } = data;

    if (!date || !time || !type || !professionalId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: date, time, type, professionalId",
        },
        { status: 400 },
      );
    }

    // Get the request
    const request = await Request.findById(id);

    if (!request) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 },
      );
    }

    // Verify the professional
    const professional = await User.findOne({
      _id: professionalId,
      role: "professional",
      status: { $in: ["active", "pending"] },
    });

    if (!professional) {
      return NextResponse.json(
        { error: "Professional not found" },
        { status: 404 },
      );
    }

    // If current user is a professional, ensure they can only convert their own requests
    if (
      session.user.role === "professional" &&
      request.assignedProfessional?.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: "You can only convert requests assigned to you" },
        { status: 403 },
      );
    }

    // Get professional's profile for validation
    const profile = await Profile.findOne({ userId: professionalId });

    if (!profile) {
      return NextResponse.json(
        { error: "Professional profile not found" },
        { status: 404 },
      );
    }

    // Validate date is not in the past
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return NextResponse.json(
        { error: "Cannot create appointments in the past" },
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
      if (
        time < dayAvailability.startTime ||
        time >= dayAvailability.endTime
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
      professionalId,
      date: appointmentDate,
      time,
      status: { $in: ["scheduled"] },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 },
      );
    }

    // Get client ID from request
    const clientId = request.patientId;

    if (!clientId) {
      return NextResponse.json(
        {
          error:
            "Request must have an associated patient to create appointment",
        },
        { status: 400 },
      );
    }

    // Create the appointment
    const appointmentData: any = {
      clientId,
      professionalId,
      date: appointmentDate,
      time,
      duration: duration || profile.availability?.sessionDurationMinutes || 60,
      type,
      status: "scheduled",
      issueType: request.issueType,
      notes: data.notes || request.message,
    };

    // Generate meeting link for video appointments
    if (type === "video") {
      appointmentData.meetingLink = `https://meet.jecheminement.com/${Date.now()}`;
    }

    // Add location for in-person appointments
    if (type === "in-person" && data.location) {
      appointmentData.location = data.location;
    }

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Update request status to approved and link to professional
    request.status = "approved";
    request.assignedProfessional = professionalId;
    await request.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("clientId", "firstName lastName email phone")
      .populate("professionalId", "firstName lastName email phone");

    return NextResponse.json(
      {
        message: "Request successfully converted to appointment",
        appointment: populatedAppointment,
        request: {
          id: request._id,
          status: request.status,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Convert request to appointment error:", error);
    return NextResponse.json(
      {
        error: "Failed to convert request to appointment",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
