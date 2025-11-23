import { z } from "zod";
import { objectIdSchema, dateStringSchema } from "./common";

/**
 * Appointment and Request-related Zod schemas
 */

// Appointment status enum
export const appointmentStatusSchema = z.enum([
  "scheduled",
  "confirmed",
  "cancelled",
  "completed",
  "no-show",
  "rescheduled",
]);

// Appointment type enum
export const appointmentTypeSchema = z.enum([
  "initial",
  "follow-up",
  "emergency",
  "consultation",
]);

// Session type enum
export const sessionTypeSchema = z.enum([
  "individual",
  "couple",
  "family",
  "group",
]);

// Modality enum
export const modalitySchema = z.enum(["in-person", "video", "phone", "chat"]);

// Appointment schema
export const appointmentSchema = z.object({
  _id: objectIdSchema.optional(),
  clientId: objectIdSchema,
  professionalId: objectIdSchema,
  startTime: z.date().or(dateStringSchema),
  endTime: z.date().or(dateStringSchema),
  status: appointmentStatusSchema,
  type: appointmentTypeSchema.optional(),
  sessionType: sessionTypeSchema.optional(),
  modality: modalitySchema.optional(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(),
  paymentAmount: z.number().nonnegative().optional(),
  meetingLink: z.string().url().optional(),
  reminderSent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create appointment request schema
export const createAppointmentRequestSchema = z.object({
  clientId: objectIdSchema,
  professionalId: objectIdSchema,
  startTime: dateStringSchema,
  endTime: dateStringSchema,
  type: appointmentTypeSchema.optional(),
  sessionType: sessionTypeSchema.optional(),
  modality: modalitySchema.optional(),
  notes: z.string().optional(),
});

// Update appointment request schema
export const updateAppointmentRequestSchema = z.object({
  startTime: dateStringSchema.optional(),
  endTime: dateStringSchema.optional(),
  status: appointmentStatusSchema.optional(),
  type: appointmentTypeSchema.optional(),
  sessionType: sessionTypeSchema.optional(),
  modality: modalitySchema.optional(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(),
  paymentAmount: z.number().nonnegative().optional(),
  meetingLink: z.string().url().optional(),
});

// List appointments query params
export const listAppointmentsQuerySchema = z.object({
  status: appointmentStatusSchema.optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
  clientId: objectIdSchema.optional(),
  professionalId: objectIdSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Appointment response schema
export const appointmentResponseSchema = appointmentSchema;

// Get appointment by ID params
export const getAppointmentByIdParamsSchema = z.object({
  id: objectIdSchema,
});

// Request status enum
export const requestStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "cancelled",
  "converted",
]);

// Request schema
export const requestSchema = z.object({
  _id: objectIdSchema.optional(),
  clientId: objectIdSchema,
  professionalId: objectIdSchema,
  preferredDates: z.array(dateStringSchema).optional(),
  preferredTimes: z.array(z.string()).optional(),
  sessionType: sessionTypeSchema.optional(),
  modality: modalitySchema.optional(),
  urgency: z.enum(["low", "medium", "high", "urgent"]).optional(),
  message: z.string().optional(),
  status: requestStatusSchema,
  responseMessage: z.string().optional(),
  proposedDate: dateStringSchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create request schema
export const createRequestRequestSchema = z.object({
  clientId: objectIdSchema,
  professionalId: objectIdSchema,
  preferredDates: z.array(dateStringSchema).optional(),
  preferredTimes: z.array(z.string()).optional(),
  sessionType: sessionTypeSchema.optional(),
  modality: modalitySchema.optional(),
  urgency: z.enum(["low", "medium", "high", "urgent"]).optional(),
  message: z.string().optional(),
});

// Update request schema
export const updateRequestRequestSchema = z.object({
  preferredDates: z.array(dateStringSchema).optional(),
  preferredTimes: z.array(z.string()).optional(),
  sessionType: sessionTypeSchema.optional(),
  modality: modalitySchema.optional(),
  urgency: z.enum(["low", "medium", "high", "urgent"]).optional(),
  message: z.string().optional(),
  status: requestStatusSchema.optional(),
  responseMessage: z.string().optional(),
  proposedDate: dateStringSchema.optional(),
});

// List requests query params
export const listRequestsQuerySchema = z.object({
  status: requestStatusSchema.optional(),
  clientId: objectIdSchema.optional(),
  professionalId: objectIdSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Request response schema
export const requestResponseSchema = requestSchema;

// Get request by ID params
export const getRequestByIdParamsSchema = z.object({
  id: objectIdSchema,
});

// Available slots query params
export const availableSlotsQuerySchema = z.object({
  professionalId: objectIdSchema,
  date: dateStringSchema,
  sessionDurationMinutes: z.coerce.number().int().positive().default(60),
});

// Types
export type Appointment = z.infer<typeof appointmentSchema>;
export type CreateAppointmentRequest = z.infer<
  typeof createAppointmentRequestSchema
>;
export type UpdateAppointmentRequest = z.infer<
  typeof updateAppointmentRequestSchema
>;
export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>;
export type AppointmentResponse = z.infer<typeof appointmentResponseSchema>;
export type GetAppointmentByIdParams = z.infer<
  typeof getAppointmentByIdParamsSchema
>;

export type Request = z.infer<typeof requestSchema>;
export type CreateRequestRequest = z.infer<typeof createRequestRequestSchema>;
export type UpdateRequestRequest = z.infer<typeof updateRequestRequestSchema>;
export type ListRequestsQuery = z.infer<typeof listRequestsQuerySchema>;
export type RequestResponse = z.infer<typeof requestResponseSchema>;
export type GetRequestByIdParams = z.infer<typeof getRequestByIdParamsSchema>;
export type AvailableSlotsQuery = z.infer<typeof availableSlotsQuerySchema>;
