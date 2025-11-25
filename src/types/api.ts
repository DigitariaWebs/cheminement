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

interface PersonResponse {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

type AppointmentType = "video" | "in-person" | "phone";
type TherapyType = "solo" | "couple" | "group";
type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no-show"
  | "pending"
  | "ongoing";
type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled";
type CancelledBy = "client" | "professional" | "admin";

export interface AppointmentResponse {
  _id: string;
  clientId: PersonResponse;
  professionalId: PersonResponse;
  date: string;
  time: string;
  duration: number;
  type: AppointmentType;
  therapyType: TherapyType;
  status: AppointmentStatus;
  issueType?: string;
  notes?: string;
  cancelReason?: string;
  cancelledBy?: CancelledBy;
  cancelledAt?: string;
  meetingLink?: string;
  location?: string;
  scheduledStartAt?: string;
  reminderSent: boolean;
  price: number;
  platformFee: number;
  professionalPayout: number;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  stripePaymentMethodId?: string;
  paidAt?: string;
  refundedAt?: string;
  payoutTransferId?: string;
  payoutDate?: string;
  createdAt: string;
  updatedAt: string;
}
