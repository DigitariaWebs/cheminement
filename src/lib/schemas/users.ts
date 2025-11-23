import { z } from "zod";
import {
  objectIdSchema,
  emailSchema,
  phoneSchema,
  roleSchema,
  statusSchema,
  genderSchema,
  languageSchema,
} from "./common";

/**
 * User and Client-related Zod schemas
 */

// User schema
export const userSchema = z.object({
  _id: objectIdSchema.optional(),
  email: emailSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: roleSchema,
  status: statusSchema.optional(),
  phone: phoneSchema,
  gender: genderSchema,
  dateOfBirth: z.date().or(z.string()).optional(),
  language: languageSchema.optional(),
  location: z.string().optional(),
  profileImage: z.string().url().optional(),
  profile: objectIdSchema.optional(),
  stripeCustomerId: z.string().optional(),
  stripeAccountId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Update user request schema
export const updateUserRequestSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: phoneSchema,
  gender: genderSchema,
  dateOfBirth: z.string().optional(),
  language: languageSchema.optional(),
  location: z.string().optional(),
  profileImage: z.string().url().optional(),
  status: statusSchema.optional(),
});

// User response schema (excludes password)
export const userResponseSchema = userSchema.omit({ _id: true }).extend({
  id: z.string(),
});

// Get user by ID params
export const getUserByIdParamsSchema = z.object({
  id: objectIdSchema,
});

// List users query params
export const listUsersQuerySchema = z.object({
  role: roleSchema.optional(),
  status: statusSchema.optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Client list item schema (for client list views)
export const clientListItemSchema = z.object({
  _id: objectIdSchema,
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  status: statusSchema,
  dateOfBirth: z.date().optional(),
  gender: genderSchema,
  location: z.string().optional(),
  primaryIssue: z.string().optional(),
  severity: z.string().optional(),
  lastAppointment: z.date().optional(),
  nextAppointment: z.date().optional(),
  totalAppointments: z.number().int().nonnegative().optional(),
  createdAt: z.date().optional(),
});

// List clients query params
export const listClientsQuerySchema = z.object({
  status: statusSchema.optional(),
  issueType: z.string().optional(),
  search: z.string().optional(),
  professionalId: objectIdSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Client response schema (user with medical profile)
export const clientResponseSchema = userResponseSchema.extend({
  medicalProfile: z.any().optional(),
});

// Types
export type User = z.infer<typeof userSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type GetUserByIdParams = z.infer<typeof getUserByIdParamsSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type ClientListItem = z.infer<typeof clientListItemSchema>;
export type ListClientsQuery = z.infer<typeof listClientsQuerySchema>;
export type ClientResponse = z.infer<typeof clientResponseSchema>;
