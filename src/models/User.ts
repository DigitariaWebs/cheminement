import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPaymentMethod {
  type: "card" | "transfer" | "direct_debit";
  isDefault: boolean;
  stripePaymentMethodId?: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  bankName?: string;
  accountLast4?: string;
  verified: boolean;
  verifiedAt?: Date;
  addedAt: Date;
}

export interface IUser extends Document {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: "client" | "professional" | "admin" | "guest" | "parent" | "child";
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
  stripeCustomerId?: string; // For clients to store payment methods
  stripeConnectAccountId?: string; // For professionals to receive payouts

  // Payment methods (for clients)
  paymentMethods?: IPaymentMethod[];
  defaultPaymentMethod?: string; // Stripe payment method ID

  // Bank validation for automatic payments
  bankValidationStatus?: "pending" | "verified" | "failed";
  bankValidatedAt?: Date;

  // Parent-child account hierarchy
  parentId?: mongoose.Types.ObjectId; // Reference to parent User if this is a child account
  childAccounts?: mongoose.Types.ObjectId[]; // References to child User accounts
  accountType?: "individual" | "parent" | "child";
  relationshipToChild?: string; // "parent", "guardian", "spouse", etc.

  // Profile completion tracking
  profileCompletionStatus?: {
    personalInfo: boolean;
    paymentMethod: boolean;
    preferences: boolean;
    completed: boolean;
  };

  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    type: {
      type: String,
      enum: ["card", "transfer", "direct_debit"],
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    stripePaymentMethodId: String,
    last4: String,
    brand: String,
    expiryMonth: Number,
    expiryYear: Number,
    bankName: String,
    accountLast4: String,
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

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
      required: function (this: IUser) {
        return this.role !== "guest";
      },
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
      enum: ["client", "professional", "admin", "guest", "parent", "child"],
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
    stripeCustomerId: String,
    stripeConnectAccountId: String,

    // Payment methods
    paymentMethods: [PaymentMethodSchema],
    defaultPaymentMethod: String,

    // Bank validation
    bankValidationStatus: {
      type: String,
      enum: ["pending", "verified", "failed"],
    },
    bankValidatedAt: Date,

    // Parent-child hierarchy
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    childAccounts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    accountType: {
      type: String,
      enum: ["individual", "parent", "child"],
      default: "individual",
    },
    relationshipToChild: String,

    // Profile completion
    profileCompletionStatus: {
      personalInfo: {
        type: Boolean,
        default: false,
      },
      paymentMethod: {
        type: Boolean,
        default: false,
      },
      preferences: {
        type: Boolean,
        default: false,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ isAdmin: 1 });
UserSchema.index({ adminId: 1 });
UserSchema.index({ parentId: 1 });
UserSchema.index({ stripeCustomerId: 1 });
UserSchema.index({ accountType: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
