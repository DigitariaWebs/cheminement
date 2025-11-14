import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRequest extends Document {
  patientId?: mongoose.Types.ObjectId;
  patientName: string;
  email: string;
  phone: string;
  requestDate: Date;
  preferredDate?: Date;
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
  assignedProfessional?: mongoose.Types.ObjectId;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    patientName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    preferredDate: Date,
    preferredTime: String,
    issueType: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "contacted"],
      default: "pending",
    },
    message: String,
    isNewClient: {
      type: Boolean,
      default: true,
    },
    age: Number,
    gender: String,
    mentalIllness: [String],
    treatmentHistory: {
      previousTherapists: Number,
      currentMedications: [String],
      currentlyInTreatment: Boolean,
      treatmentDuration: String,
      previousDiagnoses: [String],
    },
    assignedProfessional: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    adminNotes: String,
  },
  {
    timestamps: true,
  },
);

RequestSchema.index({ status: 1, requestDate: -1 });
RequestSchema.index({ email: 1 });
RequestSchema.index({ assignedProfessional: 1 });

const Request: Model<IRequest> =
  mongoose.models.Request || mongoose.model<IRequest>("Request", RequestSchema);

export default Request;
