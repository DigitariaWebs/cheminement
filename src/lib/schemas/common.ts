import { z } from "zod";

/**
 * Common Zod schemas used across the application
 */

// MongoDB ObjectId validation
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// Email validation
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .toLowerCase();

// Password validation (min 8 chars)
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

// Phone number (basic validation)
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]+$/, "Invalid phone number")
  .optional();

// Date string validation
export const dateStringSchema = z
  .string()
  .datetime()
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

// Role enum
export const roleSchema = z.enum(["client", "professional", "admin"]);

// Status enum
export const statusSchema = z.enum([
  "active",
  "inactive",
  "pending",
  "suspended",
]);

// Language enum
export const languageSchema = z.enum(["en", "fr"]);

// Gender enum
export const genderSchema = z
  .enum(["male", "female", "other", "prefer_not_to_say"])
  .optional();

// Generic success response
export const successResponseSchema = z.object({
  message: z.string(),
  data: z.any().optional(),
});

// Generic error response
export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// Pagination params
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Date range params
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
