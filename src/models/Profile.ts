import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    problematics: [String],
    approaches: [String],
    ageCategories: [String],
    skills: [String],
    bio: {
      type: String,
      maxlength: 1000,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
    },
    specialty: String,
    license: String,
    certifications: [String],
    availability: {
      days: [String],
      timeSlots: [String],
    },
    languages: [String],
    sessionTypes: [String],
    pricing: {
      individualSession: Number,
      coupleSession: Number,
      groupSession: Number,
    },
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ specialty: 1 });
ProfileSchema.index({ problematics: 1 });

const Profile: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);

export default Profile;
