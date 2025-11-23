import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlatformSettings extends Document {
  defaultPricing: {
    solo: number;
    couple: number;
    group: number;
  };
  platformFeePercentage: number;
  currency: string;
  cancellationPolicy: {
    clientCancellationHours: number;
    clientRefundPercentage: number;
    professionalCancellationHours: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PlatformSettingsSchema = new Schema<IPlatformSettings>(
  {
    defaultPricing: {
      solo: {
        type: Number,
        required: true,
        default: 120,
      },
      couple: {
        type: Number,
        required: true,
        default: 150,
      },
      group: {
        type: Number,
        required: true,
        default: 80,
      },
    },
    platformFeePercentage: {
      type: Number,
      required: true,
      default: 10,
      min: 0,
      max: 100,
    },
    currency: {
      type: String,
      default: "CAD",
    },
    cancellationPolicy: {
      clientCancellationHours: {
        type: Number,
        default: 24,
      },
      clientRefundPercentage: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
      professionalCancellationHours: {
        type: Number,
        default: 12,
      },
    },
  },
  {
    timestamps: true,
  },
);

const PlatformSettings: Model<IPlatformSettings> =
  mongoose.models.PlatformSettings ||
  mongoose.model<IPlatformSettings>("PlatformSettings", PlatformSettingsSchema);

export default PlatformSettings;
