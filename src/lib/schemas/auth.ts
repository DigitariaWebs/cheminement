import { z } from "zod";
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  dateStringSchema,
  roleSchema,
  genderSchema,
} from "./common";

/**
 * Auth-related Zod schemas
 */

// Professional availability schema
const availabilityDaySchema = z.object({
  day: z.string(),
  isWorkDay: z.boolean(),
  startTime: z.string(),
  endTime: z.string(),
});

const availabilitySchema = z.object({
  days: z.array(availabilityDaySchema),
  sessionDurationMinutes: z.number().int().positive().optional(),
  breakDurationMinutes: z.number().int().positive().optional(),
  firstDayOfWeek: z.string().optional(),
});

// Professional profile schema
const professionalProfileSchema = z.object({
  problematics: z.array(z.string()).optional(),
  approaches: z.array(z.string()).optional(),
  ageCategories: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  bio: z.string().optional(),
  yearsOfExperience: z.number().int().nonnegative().optional(),
  specialty: z.string().optional(),
  license: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  availability: availabilitySchema.optional(),
  languages: z.array(z.string()).optional(),
  sessionTypes: z.array(z.string()).optional(),
  modalities: z.array(z.string()).optional(),
  paymentAgreement: z.string().optional(),
  pricing: z
    .object({
      individualSession: z.number().nonnegative().optional(),
      coupleSession: z.number().nonnegative().optional(),
      groupSession: z.number().nonnegative().optional(),
    })
    .optional(),
  education: z
    .array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        year: z.number().int().optional(),
      }),
    )
    .optional(),
});

// Signup request schema
export const signupRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: roleSchema,
  phone: phoneSchema,
  dateOfBirth: dateStringSchema.optional(),
  gender: genderSchema,
  language: z.enum(["english", "french"]).optional(),
  location: z.string().optional(),
  // Medical Profile fields (for clients)
  concernedPerson: z.string().optional(),
  medicalConditions: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  substanceUse: z.string().optional(),
  previousTherapy: z.boolean().optional(),
  previousTherapyDetails: z.string().optional(),
  psychiatricHospitalization: z.boolean().optional(),
  currentTreatment: z.string().optional(),
  diagnosedConditions: z.array(z.string()).optional(),
  primaryIssue: z.string().optional(),
  secondaryIssues: z.array(z.string()).optional(),
  issueDescription: z.string().optional(),
  severity: z.string().optional(),
  duration: z.string().optional(),
  triggeringSituation: z.string().optional(),
  symptoms: z.array(z.string()).optional(),
  dailyLifeImpact: z.string().optional(),
  sleepQuality: z.string().optional(),
  appetiteChanges: z.string().optional(),
  treatmentGoals: z.array(z.string()).optional(),
  therapyApproach: z.array(z.string()).optional(),
  concernsAboutTherapy: z.string().optional(),
  availability: z.array(z.string()).optional(),
  modality: z.string().optional(),
  sessionFrequency: z.string().optional(),
  notes: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  crisisPlan: z.string().optional(),
  suicidalThoughts: z.boolean().optional(),
  preferredGender: z.string().optional(),
  preferredAge: z.string().optional(),
  languagePreference: z.string().optional(),
  culturalConsiderations: z.string().optional(),
  // Professional fields
  professionalProfile: professionalProfileSchema.optional(),
});

// Signup response schema
export const signupResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    role: roleSchema,
  }),
});

// Login request schema
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Login response schema (for NextAuth compatibility)
export const loginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().optional(),
    role: roleSchema,
  }),
});

// Types
export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type SignupResponse = z.infer<typeof signupResponseSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
