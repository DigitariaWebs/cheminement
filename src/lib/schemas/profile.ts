import { z } from "zod";
import { objectIdSchema } from "./common";

/**
 * Profile-related Zod schemas
 */

// Availability day schema
const availabilityDaySchema = z.object({
  day: z.string(),
  isWorkDay: z.boolean(),
  startTime: z.string(),
  endTime: z.string(),
});

// Availability schema
const availabilitySchema = z.object({
  days: z.array(availabilityDaySchema),
  sessionDurationMinutes: z.number().int().positive().optional(),
  breakDurationMinutes: z.number().int().positive().optional(),
  firstDayOfWeek: z.string().optional(),
});

// Education schema
const educationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  year: z.number().int().optional(),
});

// Pricing schema
const pricingSchema = z.object({
  individualSession: z.number().nonnegative().optional(),
  coupleSession: z.number().nonnegative().optional(),
  groupSession: z.number().nonnegative().optional(),
});

// Profile schema (for professional profiles)
export const profileSchema = z.object({
  _id: objectIdSchema.optional(),
  userId: objectIdSchema,
  // Professional Information
  problematics: z.array(z.string()).optional(),
  approaches: z.array(z.string()).optional(),
  ageCategories: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  bio: z.string().optional(),
  yearsOfExperience: z.number().int().nonnegative().optional(),
  specialty: z.string().optional(),
  license: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  // Availability & Scheduling
  availability: availabilitySchema.optional(),
  // Languages & Session Types
  languages: z.array(z.string()).optional(),
  sessionTypes: z.array(z.string()).optional(),
  modalities: z.array(z.string()).optional(),
  // Pricing & Payment
  pricing: pricingSchema.optional(),
  paymentAgreement: z.string().optional(),
  // Education
  education: z.array(educationSchema).optional(),
  // Status
  profileCompleted: z.boolean().optional(),
  // Timestamps
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Update profile request schema (all fields optional for partial updates)
export const updateProfileRequestSchema = profileSchema.partial().omit({
  _id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Profile response schema
export const profileResponseSchema = profileSchema;

// Get profile by ID params
export const getProfileByIdParamsSchema = z.object({
  id: objectIdSchema,
});

// Types
export type Profile = z.infer<typeof profileSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type GetProfileByIdParams = z.infer<typeof getProfileByIdParamsSchema>;
