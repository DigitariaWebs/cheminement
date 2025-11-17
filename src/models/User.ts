import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "client" | "professional" | "admin";
  isAdmin: boolean;
  adminId?: mongoose.Types.ObjectId; // Reference to Admin document if user is admin
  profile?: mongoose.Types.ObjectId; // Reference to Profile document
  phone?: string;
  language?: "fr" | "en";
  gender?: string;
  dateOfBirth?: Date;
  location?: string;
  status: "active" | "pending" | "inactive";
  emailVerified?: Date;
  image?: string;
  stripeConnectAccountId?: string; // For professionals to receive payouts
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["client", "professional", "admin"],
      required: [true, "Role is required"],
      default: "client",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    phone: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      enum: ["fr", "en"],
      default: "en",
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "pending", "inactive"],
      default: "pending",
    },
    emailVerified: Date,
    image: String,
    stripeConnectAccountId: String, // For professionals to receive payouts
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ isAdmin: 1 });
UserSchema.index({ adminId: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
