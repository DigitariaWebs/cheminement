import { z } from "zod";
import { objectIdSchema } from "./common";

/**
 * Medical Profile-related Zod schemas
 */

// Medical profile schema
export const medicalProfileSchema = z.object({
  _id: objectIdSchema.optional(),
  userId: objectIdSchema,
  // Personal Information
  concernedPerson: z.string().optional(),
  // Health Background
  medicalConditions: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  substanceUse: z.string().optional(),
  // Mental Health History
  previousTherapy: z.boolean().optional(),
  previousTherapyDetails: z.string().optional(),
  psychiatricHospitalization: z.boolean().optional(),
  currentTreatment: z.string().optional(),
  diagnosedConditions: z.array(z.string()).optional(),
  // Current Concerns
  primaryIssue: z.string().optional(),
  secondaryIssues: z.array(z.string()).optional(),
  issueDescription: z.string().optional(),
  severity: z.string().optional(),
  duration: z.string().optional(),
  triggeringSituation: z.string().optional(),
  // Symptoms & Impact
  symptoms: z.array(z.string()).optional(),
  dailyLifeImpact: z.string().optional(),
  sleepQuality: z.string().optional(),
  appetiteChanges: z.string().optional(),
  // Goals & Treatment Preferences
  treatmentGoals: z.array(z.string()).optional(),
  therapyApproach: z.array(z.string()).optional(),
  concernsAboutTherapy: z.string().optional(),
  // Appointment Preferences
  availability: z.array(z.string()).optional(),
  modality: z.string().optional(),
  sessionFrequency: z.string().optional(),
  notes: z.string().optional(),
  // Emergency Information
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  crisisPlan: z.string().optional(),
  suicidalThoughts: z.boolean().optional(),
  // Professional Matching Preferences
  preferredGender: z.string().optional(),
  preferredAge: z.string().optional(),
  languagePreference: z.string().optional(),
  culturalConsiderations: z.string().optional(),
  // Status
  profileCompleted: z.boolean().optional(),
  // Timestamps
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Update medical profile request schema (all fields optional for partial updates)
export const updateMedicalProfileRequestSchema = medicalProfileSchema
  .partial()
  .omit({
    _id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  });

// Medical profile response schema
export const medicalProfileResponseSchema = medicalProfileSchema;

// Get medical profile by ID params
export const getMedicalProfileByIdParamsSchema = z.object({
  id: objectIdSchema,
});

// Types
export type MedicalProfile = z.infer<typeof medicalProfileSchema>;
export type UpdateMedicalProfileRequest = z.infer<
  typeof updateMedicalProfileRequestSchema
>;
export type MedicalProfileResponse = z.infer<
  typeof medicalProfileResponseSchema
>;
export type GetMedicalProfileByIdParams = z.infer<
  typeof getMedicalProfileByIdParamsSchema
>;
