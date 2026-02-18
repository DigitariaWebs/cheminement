import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactSubmission extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "in-progress" | "resolved" | "archived";
  assignedTo?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
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
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "archived"],
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
ContactSubmissionSchema.index({ status: 1, createdAt: -1 });
ContactSubmissionSchema.index({ email: 1 });

const ContactSubmission: Model<IContactSubmission> =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>(
    "ContactSubmission",
    ContactSubmissionSchema,
  );

export default ContactSubmission;
