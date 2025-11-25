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

export interface PaymentInfo {
  price: number;
  platformFee: number;
  professionalPayout: number;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  stripePaymentMethodId?: string;
  paidAt?: string;
  refundedAt?: string;
  payoutTransferId?: string;
  payoutDate?: string;
}

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
  payment: PaymentInfo;
  createdAt: string;
  updatedAt: string;
}
