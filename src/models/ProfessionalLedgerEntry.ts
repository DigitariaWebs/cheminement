import mongoose, { Schema, Document, Model } from "mongoose";

/** Ligne du grand livre — revenu lié à une séance clôturée. */
export interface IProfessionalLedgerEntry extends Document {
  professionalId: mongoose.Types.ObjectId;
  appointmentId: mongoose.Types.ObjectId;
  sessionActNature?: string;
  grossAmountCad: number;
  platformFeeCad: number;
  netToProfessionalCad: number;
  paymentChannel: "stripe" | "transfer" | "none";
  createdAt?: Date;
  updatedAt?: Date;
}

const ProfessionalLedgerEntrySchema = new Schema<IProfessionalLedgerEntry>(
  {
    professionalId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    sessionActNature: String,
    grossAmountCad: { type: Number, required: true },
    platformFeeCad: { type: Number, required: true },
    netToProfessionalCad: { type: Number, required: true },
    paymentChannel: {
      type: String,
      enum: ["stripe", "transfer", "none"],
      required: true,
    },
  },
  { timestamps: true },
);

ProfessionalLedgerEntrySchema.index({ professionalId: 1, createdAt: -1 });

const ProfessionalLedgerEntry: Model<IProfessionalLedgerEntry> =
  mongoose.models.ProfessionalLedgerEntry ||
  mongoose.model<IProfessionalLedgerEntry>(
    "ProfessionalLedgerEntry",
    ProfessionalLedgerEntrySchema,
  );

export default ProfessionalLedgerEntry;
