import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import { calculateAppointmentPricing } from "@/lib/pricing";
import {
  withValidation,
  listAppointmentsQuerySchema,
  createAppointmentRequestSchema,
  type ListAppointmentsQuery,
  type CreateAppointmentRequest,
} from "@/lib/schemas";

export const GET = withValidation<never, ListAppointmentsQuery>(
  async ({ query }) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectToDatabase();

      const { status, startDate, endDate, clientId } = query || {};

      const filter: Record<string, unknown> = {};

      // Filter by user role
      if (session.user.role === "client") {
        filter.clientId = session.user.id;
      } else if (session.user.role === "professional") {
        filter.professionalId = session.user.id;
      }

      // Additional filters
      if (status) {
        filter.status = status;
      }

      if (clientId) {
        filter.clientId = clientId;
      }

      if (startDate || endDate) {
        filter.date = {};
        if (startDate)
          (filter.date as Record<string, Date>).$gte = new Date(startDate);
        if (endDate)
          (filter.date as Record<string, Date>).$lte = new Date(endDate);
      }

      const appointments = await Appointment.find(filter)
        .populate("clientId", "firstName lastName email phone")
        .populate("professionalId", "firstName lastName email phone")
        .sort({ date: 1, time: 1 });

      return NextResponse.json(appointments);
    } catch (error) {
      console.error("Get appointments error:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch appointments",
          details:
            error instanceof Error
              ? error instanceof Error
                ? error.message
                : "Unknown error"
              : "Unknown error",
        },
        { status: 500 },
      );
    }
  },
  {
    querySchema: listAppointmentsQuerySchema,
  },
);

export const POST = withValidation<CreateAppointmentRequest>(
  async ({ body }) => {
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 },
      );
    }

    try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectToDatabase();

      const data = { ...body };

      // Ensure the client is the current user if role is client
      if (session.user.role === "client") {
        data.clientId = session.user.id;
      }

      // Set default session type if not provided
      const sessionType = data.sessionType || "individual";

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
      const appointmentDate = new Date(data.startTime);
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
      }

      // Check for double-booking
      const existingAppointment = await Appointment.findOne({
        professionalId: data.professionalId,
        startTime: new Date(data.startTime),
        status: { $in: ["scheduled", "confirmed"] },
      });

      if (existingAppointment) {
        return NextResponse.json(
          { error: "This time slot is already booked" },
          { status: 409 },
        );
      }

      // Calculate pricing based on session type using professional or platform defaults
      const pricingResult = await calculateAppointmentPricing(
        data.professionalId,
        sessionType === "individual"
          ? "solo"
          : sessionType === "couple"
            ? "couple"
            : "group",
      );

      // Create appointment with pricing and defaults
      const appointmentData: Record<string, unknown> = {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        status: "scheduled" as const,
        paymentAmount: pricingResult.sessionPrice,
      };

      // Generate meeting link for video appointments
      if (data.modality === "video") {
        appointmentData.meetingLink = `https://meet.jecheminement.com/${Date.now()}`;
      }

      const appointment = new Appointment(appointmentData);
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
      // Temporarily disabled for development/testing
      /*
      Promise.all([
        sendAppointmentConfirmation(emailData),
        sendProfessionalNotification(emailData),
      ]).catch((err) => console.error("Error sending notifications:", err));
      */

      return NextResponse.json(populatedAppointment, { status: 201 });
    } catch (error) {
      console.error("Create appointment error:", error);
      return NextResponse.json(
        {
          error: "Failed to create appointment",
          details:
            error instanceof Error
              ? error instanceof Error
                ? error.message
                : "Unknown error"
              : "Unknown error",
        },
        { status: 500 },
      );
    }
  },
  {
    bodySchema: createAppointmentRequestSchema,
  },
);
