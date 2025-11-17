import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  clientId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  date: Date;
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
  // Payment fields
  price: number; // Session price in dollars
  platformFee: number; // Platform fee amount
  professionalPayout: number; // Amount professional receives
  paymentStatus:
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
  payoutTransferId?: string; // Stripe transfer ID for professional payout
  payoutDate?: Date; // When professional was paid out
  createdAt: Date;
  updatedAt: Date;
}

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
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    issueType: String,
    notes: String,
    cancelReason: String,
    meetingLink: String,
    location: String,
    reminderSent: {
      type: Boolean,
      default: false,
    },
    // Payment fields
    price: {
      type: Number,
      required: true,
      default: 120, // Default session price in CAD
    },
    platformFee: {
      type: Number,
      required: true,
      default: 12, // 10% of default price
    },
    professionalPayout: {
      type: Number,
      required: true,
      default: 108, // 90% of default price
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "paid", "failed", "refunded", "cancelled"],
      default: "pending",
    },
    stripePaymentIntentId: String,
    stripePaymentMethodId: String,
    paidAt: Date,
    refundedAt: Date,
    payoutTransferId: String, // Stripe transfer ID for professional payout
    payoutDate: Date, // When professional was paid out
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
