import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  conversationId: string; // appointment_${appointmentId}
  appointmentId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  message: string;
  type: "text" | "system" | "appointment_proposal";
  metadata?: {
    proposedDate?: Date;
    proposedTime?: string;
    proposedDuration?: number;
    meetingLink?: string;
  };
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "system", "appointment_proposal"],
      default: "text",
    },
    metadata: {
      proposedDate: Date,
      proposedTime: String,
      proposedDuration: Number,
      meetingLink: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  {
    timestamps: true,
  },
);

// Indexes for faster queries
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ recipientId: 1, read: 1 });
MessageSchema.index({ senderId: 1, recipientId: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
