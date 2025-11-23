/**
 * API Client Utility
 * Provides helper functions for making API calls with proper error handling and Zod validation
 */

import { z } from "zod";
import {
  signupRequestSchema,
  signupResponseSchema,
  type SignupRequest,
  type SignupResponse,
  profileResponseSchema,
  updateProfileRequestSchema,
  type UpdateProfileRequest,
  type ProfileResponse,
  medicalProfileResponseSchema,
  updateMedicalProfileRequestSchema,
  type UpdateMedicalProfileRequest,
  type MedicalProfileResponse,
  createAppointmentRequestSchema,
  updateAppointmentRequestSchema,
  appointmentResponseSchema,
  listAppointmentsQuerySchema,
  type CreateAppointmentRequest,
  type UpdateAppointmentRequest,
  type AppointmentResponse,
  type ListAppointmentsQuery,
  createRequestRequestSchema,
  updateRequestRequestSchema,
  requestResponseSchema,
  listRequestsQuerySchema,
  type CreateRequestRequest,
  type UpdateRequestRequest,
  type RequestResponse,
  type ListRequestsQuery,
  updateUserRequestSchema,
  userResponseSchema,
  listUsersQuerySchema,
  listClientsQuerySchema,
  type UpdateUserRequest,
  type UserResponse,
  type ListUsersQuery,
  type ListClientsQuery,
  ValidationError,
} from "./schemas";

interface FetchOptions extends RequestInit {
  data?: unknown;
  requestSchema?: z.ZodSchema;
  responseSchema?: z.ZodSchema;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<T> {
    const { data, requestSchema, responseSchema, ...fetchOptions } = options;

    // Validate request data if schema provided
    if (data && requestSchema) {
      const result = requestSchema.safeParse(data);
      if (!result.success) {
        const errors = result.error.issues.map((err: z.ZodIssue) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        throw new ValidationError("Request validation failed", errors);
      }
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "An error occurred");
      }

      const responseData = await response.json();

      // Validate response data if schema provided
      if (responseSchema) {
        const result = responseSchema.safeParse(responseData);
        if (!result.success) {
          console.warn("Response validation failed:", result.error.issues);
          // Return data anyway but log warning
        }
        return result.data as T;
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error");
    }
  }

  // GET request
  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", data });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", data });
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", data });
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Specific API functions with Zod validation

// Auth
export const authAPI = {
  signup: (data: SignupRequest): Promise<SignupResponse> =>
    apiClient.post<SignupResponse>("/auth/signup", data, {
      requestSchema: signupRequestSchema,
      responseSchema: signupResponseSchema,
    }),
};

// Profile
export const profileAPI = {
  get: async (): Promise<ProfileResponse | null> => {
    try {
      return await apiClient.get<ProfileResponse>("/profile", {
        responseSchema: profileResponseSchema,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Profile not found") {
        return null;
      }
      throw error;
    }
  },
  getById: (id: string): Promise<ProfileResponse> =>
    apiClient.get<ProfileResponse>(`/profile/${id}`, {
      responseSchema: profileResponseSchema,
    }),
  update: (data: UpdateProfileRequest): Promise<ProfileResponse> =>
    apiClient.put<ProfileResponse>("/profile", data, {
      requestSchema: updateProfileRequestSchema,
      responseSchema: profileResponseSchema,
    }),
};

// Medical Profile
export const medicalProfileAPI = {
  get: (): Promise<MedicalProfileResponse> =>
    apiClient.get<MedicalProfileResponse>("/medical-profile", {
      responseSchema: medicalProfileResponseSchema,
    }),
  getByUserId: (userId: string): Promise<MedicalProfileResponse> =>
    apiClient.get<MedicalProfileResponse>(`/medical-profile/${userId}`, {
      responseSchema: medicalProfileResponseSchema,
    }),
  update: (
    data: UpdateMedicalProfileRequest,
  ): Promise<MedicalProfileResponse> =>
    apiClient.put<MedicalProfileResponse>("/medical-profile", data, {
      requestSchema: updateMedicalProfileRequestSchema,
      responseSchema: medicalProfileResponseSchema,
    }),
};

// Appointments
export const appointmentsAPI = {
  list: (params?: ListAppointmentsQuery): Promise<AppointmentResponse[]> => {
    const validated = listAppointmentsQuerySchema.parse(params || {});
    const query = new URLSearchParams(
      validated as unknown as Record<string, string>,
    ).toString();
    return apiClient.get<AppointmentResponse[]>(
      `/appointments${query ? `?${query}` : ""}`,
      {
        responseSchema: z.array(appointmentResponseSchema),
      },
    );
  },
  create: (data: CreateAppointmentRequest): Promise<AppointmentResponse> =>
    apiClient.post<AppointmentResponse>("/appointments", data, {
      requestSchema: createAppointmentRequestSchema,
      responseSchema: appointmentResponseSchema,
    }),
  get: (id: string): Promise<AppointmentResponse> =>
    apiClient.get<AppointmentResponse>(`/appointments/${id}`, {
      responseSchema: appointmentResponseSchema,
    }),
  update: (
    id: string,
    data: UpdateAppointmentRequest,
  ): Promise<AppointmentResponse> =>
    apiClient.patch<AppointmentResponse>(`/appointments/${id}`, data, {
      requestSchema: updateAppointmentRequestSchema,
      responseSchema: appointmentResponseSchema,
    }),
  delete: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/appointments/${id}`),
};

// Requests
export const requestsAPI = {
  list: (params?: ListRequestsQuery): Promise<RequestResponse[]> => {
    const validated = listRequestsQuerySchema.parse(params || {});
    const query = new URLSearchParams(
      validated as unknown as Record<string, string>,
    ).toString();
    return apiClient.get<RequestResponse[]>(
      `/requests${query ? `?${query}` : ""}`,
      {
        responseSchema: z.array(requestResponseSchema),
      },
    );
  },
  create: (data: CreateRequestRequest): Promise<RequestResponse> =>
    apiClient.post<RequestResponse>("/requests", data, {
      requestSchema: createRequestRequestSchema,
      responseSchema: requestResponseSchema,
    }),
  get: (id: string): Promise<RequestResponse> =>
    apiClient.get<RequestResponse>(`/requests/${id}`, {
      responseSchema: requestResponseSchema,
    }),
  update: (id: string, data: UpdateRequestRequest): Promise<RequestResponse> =>
    apiClient.patch<RequestResponse>(`/requests/${id}`, data, {
      requestSchema: updateRequestRequestSchema,
      responseSchema: requestResponseSchema,
    }),
  delete: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/requests/${id}`),
};

// Blogs (no validation for now)
export const blogsAPI = {
  list: (params?: {
    category?: string;
    published?: boolean;
    limit?: number;
    page?: number;
  }): Promise<unknown[]> => {
    const query = new URLSearchParams(
      params as Record<string, string>,
    ).toString();
    return apiClient.get(`/blogs${query ? `?${query}` : ""}`);
  },
  create: (data: unknown): Promise<unknown> => apiClient.post("/blogs", data),
};

// Users
export const usersAPI = {
  get: (): Promise<UserResponse> =>
    apiClient.get<UserResponse>("/users/me", {
      responseSchema: userResponseSchema,
    }),
  getById: (id: string): Promise<UserResponse> =>
    apiClient.get<UserResponse>(`/users/${id}`, {
      responseSchema: userResponseSchema,
    }),
  update: (data: UpdateUserRequest): Promise<UserResponse> =>
    apiClient.patch<UserResponse>("/users/me", data, {
      requestSchema: updateUserRequestSchema,
      responseSchema: userResponseSchema,
    }),
  updateById: (id: string, data: UpdateUserRequest): Promise<UserResponse> =>
    apiClient.patch<UserResponse>(`/users/${id}`, data, {
      requestSchema: updateUserRequestSchema,
      responseSchema: userResponseSchema,
    }),
  list: (params?: ListUsersQuery): Promise<UserResponse[]> => {
    const validated = listUsersQuerySchema.parse(params || {});
    const query = new URLSearchParams(
      validated as unknown as Record<string, string>,
    ).toString();
    return apiClient.get<UserResponse[]>(`/users${query ? `?${query}` : ""}`, {
      responseSchema: z.array(userResponseSchema),
    });
  },
};

// Clients
export const clientsAPI = {
  list: (params?: ListClientsQuery): Promise<unknown[]> => {
    const validated = listClientsQuerySchema.parse(params || {});
    const query = new URLSearchParams(
      validated as unknown as Record<string, string>,
    ).toString();
    return apiClient.get(`/clients${query ? `?${query}` : ""}`);
  },
};
