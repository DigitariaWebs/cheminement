# Zod Validation Quick Reference

## Import Schemas

```typescript
import {
  // Validation utilities
  withValidation,
  validateRequestBody,
  validateQueryParams,
  ValidationError,

  // Auth schemas
  signupRequestSchema,
  signupResponseSchema,
  type SignupRequest,
  type SignupResponse,

  // Profile schemas
  profileSchema,
  updateProfileRequestSchema,
  type Profile,
  type UpdateProfileRequest,

  // Medical profile schemas
  medicalProfileSchema,
  updateMedicalProfileRequestSchema,
  type MedicalProfile,

  // Appointment schemas
  createAppointmentRequestSchema,
  updateAppointmentRequestSchema,
  listAppointmentsQuerySchema,
  type CreateAppointmentRequest,
  type ListAppointmentsQuery,

  // User schemas
  userSchema,
  updateUserRequestSchema,
  listUsersQuerySchema,
  type User,
  type UpdateUserRequest,
} from "@/lib/schemas";
```

## API Route Examples

### POST with Body Validation

```typescript
import { NextResponse } from "next/server";
import {
  withValidation,
  createRequestSchema,
  type CreateRequest,
} from "@/lib/schemas";

export const POST = withValidation<CreateRequest>(
  async ({ body }) => {
    const { field1, field2 } = body!;

    // Your logic here
    const result = await createSomething(body);

    return NextResponse.json(result, { status: 201 });
  },
  {
    bodySchema: createRequestSchema,
  },
);
```

### GET with Query Validation

```typescript
import { NextResponse } from "next/server";
import { withValidation, listQuerySchema, type ListQuery } from "@/lib/schemas";

export const GET = withValidation<never, ListQuery>(
  async ({ query }) => {
    const { page, limit, status } = query!;

    // Your logic here
    const results = await findMany({ page, limit, status });

    return NextResponse.json(results);
  },
  {
    querySchema: listQuerySchema,
  },
);
```

### PUT/PATCH with Body Validation

```typescript
import { NextResponse } from "next/server";
import {
  withValidation,
  updateRequestSchema,
  type UpdateRequest,
} from "@/lib/schemas";

export const PATCH = withValidation<UpdateRequest>(
  async ({ body, params }) => {
    const { id } = params!;

    // Your logic here
    const updated = await updateById(id, body!);

    return NextResponse.json(updated);
  },
  {
    bodySchema: updateRequestSchema,
  },
);
```

### Both Body and Query Validation

```typescript
export const POST = withValidation<CreateRequest, FilterQuery>(
  async ({ body, query }) => {
    // Both body and query are validated and typed
    const item = await create(body!, query!);
    return NextResponse.json(item);
  },
  {
    bodySchema: createRequestSchema,
    querySchema: filterQuerySchema,
  },
);
```

## Client-Side Usage

### Using API Client

```typescript
import { authAPI, profileAPI, appointmentsAPI } from "@/lib/api-client";

// Signup
const response = await authAPI.signup({
  email: "user@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
  role: "client",
});

// Update profile
const profile = await profileAPI.update({
  bio: "Updated bio",
  yearsOfExperience: 5,
});

// List appointments
const appointments = await appointmentsAPI.list({
  status: "scheduled",
  page: 1,
  limit: 10,
});
```

### Direct API Client Usage

```typescript
import { apiClient } from "@/lib/api-client";
import { myRequestSchema, myResponseSchema } from "@/lib/schemas";

const data = await apiClient.post("/my-endpoint", requestData, {
  requestSchema: myRequestSchema,
  responseSchema: myResponseSchema,
});
```

## Creating Custom Schemas

### Basic Schema

```typescript
import { z } from "zod";
import { objectIdSchema } from "./common";

export const mySchema = z.object({
  id: objectIdSchema,
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([]),
  active: z.boolean().default(true),
});

export type MyType = z.infer<typeof mySchema>;
```

### Partial Schema for Updates

```typescript
export const updateMySchema = mySchema.partial().omit({
  id: true,
  createdAt: true,
});
```

### Nested Schemas

```typescript
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string().regex(/^\d{5}$/),
});

export const userSchema = z.object({
  name: z.string(),
  address: addressSchema,
  alternateAddresses: z.array(addressSchema).optional(),
});
```

### Enums

```typescript
export const statusSchema = z.enum(["active", "inactive", "pending"]);
export type Status = z.infer<typeof statusSchema>;
```

### Unions

```typescript
export const contactSchema = z.union([
  z.object({ type: z.literal("email"), email: z.string().email() }),
  z.object({ type: z.literal("phone"), phone: z.string() }),
]);
```

### Custom Validation

```typescript
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/[0-9]/, "Must contain number");
```

### Refinements

```typescript
export const dateRangeSchema = z
  .object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });
```

## Manual Validation

### Validate Request Body

```typescript
import { validateRequestBody, myRequestSchema } from "@/lib/schemas";

try {
  const validatedData = validateRequestBody(myRequestSchema, rawData);
  // Use validatedData safely
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.errors);
  }
}
```

### Validate Query Params

```typescript
import { validateQueryParams, myQuerySchema } from "@/lib/schemas";

const params = Object.fromEntries(new URL(request.url).searchParams);
const validated = validateQueryParams(myQuerySchema, params);
```

### Safe Parse (No Throw)

```typescript
const result = mySchema.safeParse(data);

if (result.success) {
  console.log(result.data); // Validated data
} else {
  console.log(result.error.issues); // Validation errors
}
```

## Common Patterns

### Optional with Default

```typescript
z.string().optional().default("default value");
z.number().default(0);
z.array(z.string()).default([]);
```

### Nullable vs Optional

```typescript
z.string().optional(); // Can be undefined
z.string().nullable(); // Can be null
z.string().nullish(); // Can be null or undefined
```

### Coercion

```typescript
z.coerce.number(); // Converts "123" to 123
z.coerce.boolean(); // Converts "true" to true
z.coerce.date(); // Converts string to Date
```

### Transforms

```typescript
z.string()
  .transform((val) => val.toLowerCase())
  .transform((val) => val.trim());
```

### Preprocess

```typescript
z.preprocess(
  (val) => (typeof val === "string" ? val.split(",") : val),
  z.array(z.string()),
);
```

## Error Handling

### Catch Validation Errors

```typescript
try {
  const data = await apiClient.post("/endpoint", payload, {
    requestSchema: mySchema,
  });
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
    error.errors.forEach(({ path, message }) => {
      console.log(`${path}: ${message}`);
    });
  } else {
    // Handle other errors
    console.error(error);
  }
}
```

### Custom Error Messages

```typescript
z.string({ required_error: "Email is required" }).email({
  message: "Invalid email format",
});
```

## Testing Schemas

```typescript
import { describe, it, expect } from "vitest";
import { mySchema } from "./schemas";

describe("mySchema", () => {
  it("should validate correct data", () => {
    const result = mySchema.safeParse({
      name: "John",
      email: "john@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = mySchema.safeParse({
      name: "John",
      email: "invalid",
    });
    expect(result.success).toBe(false);
  });
});
```

## Tips

1. **Always export types**: Use `z.infer<typeof schema>` for TypeScript types
2. **Compose schemas**: Reuse common schemas to stay DRY
3. **Use `.partial()` for updates**: Allows optional fields for PATCH endpoints
4. **Coerce query params**: URLs params are strings, use `z.coerce` to convert
5. **Validate responses in dev**: Helps catch bugs early
6. **Custom error messages**: Make errors user-friendly
7. **Use enums**: Better than string unions for fixed values
8. **Document schemas**: Add descriptions for API documentation

## Common Validations

```typescript
// Email
z.string().email();

// URL
z.string().url();

// UUID
z.string().uuid();

// MongoDB ObjectId
z.string().regex(/^[0-9a-fA-F]{24}$/);

// Phone (basic)
z.string().regex(/^\+?[\d\s\-()]+$/);

// Password
z.string().min(8);

// Positive number
z.number().positive();

// Integer
z.number().int();

// Date string
z.string().datetime();

// ISO date
z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// Enum
z.enum(["value1", "value2", "value3"]);

// Array with min/max length
z.array(z.string()).min(1).max(10);

// Record/Dictionary
z.record(z.string(), z.number());
```
