/**
 * API Client Utility
 * Provides helper functions for making API calls with proper error handling
 */

interface FetchOptions extends RequestInit {
  data?: any;
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
    const { data, ...fetchOptions } = options;

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

      return await response.json();
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
    data?: any,
    options?: FetchOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", data });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: any,
    options?: FetchOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", data });
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    data?: any,
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

// Specific API functions for common operations

// Auth
export const authAPI = {
  signup: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => apiClient.post("/auth/signup", data),
};

// Profile
export const profileAPI = {
  get: () => apiClient.get("/profile"),
  update: (data: any) => apiClient.put("/profile", data),
};

// Appointments
export const appointmentsAPI = {
  list: (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get(`/appointments${query ? `?${query}` : ""}`);
  },
  create: (data: any) => apiClient.post("/appointments", data),
  get: (id: string) => apiClient.get(`/appointments/${id}`),
  update: (id: string, data: any) =>
    apiClient.patch(`/appointments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/appointments/${id}`),
};

// Requests
export const requestsAPI = {
  list: (params?: { status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get(`/requests${query ? `?${query}` : ""}`);
  },
  create: (data: any) => apiClient.post("/requests", data),
  get: (id: string) => apiClient.get(`/requests/${id}`),
  update: (id: string, data: any) => apiClient.patch(`/requests/${id}`, data),
  delete: (id: string) => apiClient.delete(`/requests/${id}`),
};

// Blogs
export const blogsAPI = {
  list: (params?: {
    category?: string;
    published?: boolean;
    limit?: number;
    page?: number;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get(`/blogs${query ? `?${query}` : ""}`);
  },
  create: (data: any) => apiClient.post("/blogs", data),
};

// Users
export const usersAPI = {
  list: (params?: { role?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get(`/users${query ? `?${query}` : ""}`);
  },
};
