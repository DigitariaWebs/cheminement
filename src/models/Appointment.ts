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
