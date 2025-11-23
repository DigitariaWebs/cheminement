/**
 * Zod Schemas Index
 * Exports all schemas and validation utilities
 */

// Common schemas
export * from "./common";

// Auth schemas
export * from "./auth";

// Profile schemas
export * from "./profile";

// Medical profile schemas
export * from "./medical-profile";

// Appointment and request schemas
export * from "./appointments";

// User and client schemas
export * from "./users";

// Validation utilities
import { z } from "zod";
import { NextResponse } from "next/server";

/**
 * Validates request body against a Zod schema
 * Returns validated data or throws an error with details
 */
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((err: z.ZodIssue) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    throw new ValidationError("Validation failed", errors);
  }

  return result.data;
}

/**
 * Validates query parameters against a Zod schema
 * Returns validated data or throws an error with details
 */
export function validateQueryParams<T>(
  schema: z.ZodSchema<T>,
  params: Record<string, string | string[] | undefined>,
): T {
  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = result.error.issues.map((err: z.ZodIssue) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    throw new ValidationError("Invalid query parameters", errors);
  }

  return result.data;
}

/**
 * Validates response data against a Zod schema
 * Returns validated data or the original data if validation fails (with warning)
 */
export function validateResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.warn("Response validation failed:", result.error.issues);
    return data as T; // Return original data but log warning
  }

  return result.data;
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  public errors: Array<{ path: string; message: string }>;

  constructor(
    message: string,
    errors: Array<{ path: string; message: string }>,
  ) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

/**
 * Creates a validation error response
 */
export function validationErrorResponse(error: ValidationError) {
  return NextResponse.json(
    {
      error: error.message,
      details: error.errors,
    },
    { status: 400 },
  );
}

/**
 * Wraps an async route handler with validation
 */
export function withValidation<TBody = unknown, TQuery = unknown>(
  handler: (
    validated: {
      body?: TBody;
      query?: TQuery;
      params?: Record<string, string>;
    },
    request: Request,
  ) => Promise<Response>,
  options?: {
    bodySchema?: z.ZodSchema<TBody>;
    querySchema?: z.ZodSchema<TQuery>;
  },
) {
  return async (
    request: Request,
    context?: { params: Record<string, string> },
  ) => {
    try {
      const validated: {
        body?: TBody;
        query?: TQuery;
        params?: Record<string, string>;
      } = {
        params: context?.params,
      };

      // Validate body if schema provided
      if (options?.bodySchema) {
        const body = await request.json().catch(() => ({}));
        validated.body = validateRequestBody(options.bodySchema, body);
      }

      // Validate query params if schema provided
      if (options?.querySchema) {
        const url = new URL(request.url);
        const params = Object.fromEntries(url.searchParams);
        validated.query = validateQueryParams(options.querySchema, params);
      }

      return await handler(validated, request);
    } catch (error) {
      if (error instanceof ValidationError) {
        return validationErrorResponse(error);
      }

      console.error("Unexpected error in route handler:", error);
      return NextResponse.json(
        {
          error: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  };
}
