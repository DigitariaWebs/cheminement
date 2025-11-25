import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment {
  price: number;
  platformFee: number;
  professionalPayout: number;
  status:
    | "pending"
    | "processing"
    | "paid"
    | "failed"
    | "refunded"
    | "cancelled";
  stripePaymentIntentId?: string;
  stripePaymentMethodId?: string;
  paidAt?: Date;
  refundedAt?: Date;
  payoutTransferId?: string;
  payoutDate?: Date;
}

export interface IAppointment extends Document {
  clientId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  duration: number;
  type: "video" | "in-person" | "phone";
  therapyType: "solo" | "couple" | "group";
  status:
    | "scheduled"
    | "completed"
    | "cancelled"
    | "no-show"
    | "pending"
    | "ongoing";
  issueType?: string;
  notes?: string;
  cancelReason?: string;
  cancelledBy?: "client" | "professional" | "admin";
  cancelledAt?: Date;
  meetingLink?: string;
  location?: string;
  scheduledStartAt?: Date;
  reminderSent: boolean;
  payment: IPayment;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    price: {
      type: Number,
      required: true,
      default: 120,
    },
    platformFee: {
      type: Number,
      required: true,
      default: 12,
    },
    professionalPayout: {
      type: Number,
      required: true,
      default: 108,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
        "cancelled",
      ],
      default: "pending",
    },
    stripePaymentIntentId: String,
    stripePaymentMethodId: String,
    paidAt: Date,
    refundedAt: Date,
    payoutTransferId: String,
    payoutDate: Date,
  },
  { _id: false },
);

const AppointmentSchema = new Schema<IAppointment>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    professionalId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60,
    },
    type: {
      type: String,
      enum: ["video", "in-person", "phone"],
      required: true,
      default: "video",
    },
    therapyType: {
      type: String,
      enum: ["solo", "couple", "group"],
      required: true,
      default: "solo",
    },
    status: {
      type: String,
      enum: [
        "scheduled",
        "completed",
        "cancelled",
        "no-show",
        "pending",
        "ongoing",
      ],
      default: "pending",
    },
    issueType: String,
    notes: String,
    cancelReason: String,
    cancelledBy: {
      type: String,
      enum: ["client", "professional", "admin"],
    },
    cancelledAt: Date,
    meetingLink: String,
    location: String,
    scheduledStartAt: Date,
    reminderSent: {
      type: Boolean,
      default: false,
    },
    payment: {
      type: PaymentSchema,
      required: true,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

AppointmentSchema.index({ clientId: 1, date: 1 });
AppointmentSchema.index({ professionalId: 1, date: 1 });
AppointmentSchema.index({ status: 1, date: 1 });

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
