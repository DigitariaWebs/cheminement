export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "client" | "professional" | "admin";
  status: "active" | "pending" | "inactive";
  phone?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  userId: string;
  problematics?: string[];
  approaches?: string[];
  ageCategories?: string[];
  skills?: string[];
  bio?: string;
  yearsOfExperience?: number;
  specialty?: string;
  license?: string;
  certifications?: string[];
  availability?: {
    days: string[];
    timeSlots: string[];
  };
  languages?: string[];
  sessionTypes?: string[];
  pricing?: {
    individualSession: number;
    coupleSession: number;
    groupSession: number;
  };
  education?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  profileCompleted: boolean;
}

export interface AppointmentResponse {
  id: string;
  clientId: UserResponse;
  professionalId: UserResponse;
  date: string;
  time: string;
  duration: number;
  type: "video" | "in-person" | "phone";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  issueType?: string;
  notes?: string;
  cancelReason?: string;
  meetingLink?: string;
  location?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RequestResponse {
  id: string;
  patientId?: string;
  patientName: string;
  email: string;
  phone: string;
  requestDate: string;
  preferredDate?: string;
  preferredTime?: string;
  issueType: string;
  urgency: "low" | "medium" | "high";
  status: "pending" | "approved" | "rejected" | "contacted";
  message?: string;
  isNewClient: boolean;
  age?: number;
  gender?: string;
  mentalIllness?: string[];
  treatmentHistory?: {
    previousTherapists?: number;
    currentMedications?: string[];
    currentlyInTreatment?: boolean;
    treatmentDuration?: string;
    previousDiagnoses?: string[];
  };
  assignedProfessional?: UserResponse;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
