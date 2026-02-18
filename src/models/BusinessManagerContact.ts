import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBusinessManagerContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  coordinates?: string; // Additional contact details/address
  message?: string;
  status: "new" | "contacted" | "in-discussion" | "converted" | "archived";
  assignedTo?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessManagerContactSchema = new Schema<IBusinessManagerContact>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "in-discussion", "converted", "archived"],
      default: "new",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
BusinessManagerContactSchema.index({ status: 1, createdAt: -1 });
BusinessManagerContactSchema.index({ email: 1 });
BusinessManagerContactSchema.index({ company: 1 });

const BusinessManagerContact: Model<IBusinessManagerContact> =
  mongoose.models.BusinessManagerContact ||
  mongoose.model<IBusinessManagerContact>(
    "BusinessManagerContact",
    BusinessManagerContactSchema,
  );

export default BusinessManagerContact;
