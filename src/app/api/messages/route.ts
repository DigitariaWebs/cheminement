import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/messages
 * Get messages for a conversation or all conversations
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");
    const conversationId = searchParams.get("conversationId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    if (appointmentId || conversationId) {
      // Get messages for specific conversation
      const convId = conversationId || `appointment_${appointmentId}`;

      // Verify user has access to this conversation
      const appointment = await Appointment.findById(
        appointmentId || convId.replace("appointment_", ""),
      );

      if (!appointment) {
        return NextResponse.json(
          { error: "Appointment not found" },
          { status: 404 },
        );
      }

      if (
        appointment.clientId.toString() !== session.user.id &&
        appointment.professionalId?.toString() !== session.user.id &&
        session.user.role !== "admin"
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const messages = await Message.find({ conversationId: convId })
        .populate("senderId", "firstName lastName role")
        .populate("recipientId", "firstName lastName role")
        .sort({ createdAt: 1 })
        .limit(limit)
        .skip(skip);

      // Mark messages as read
      await Message.updateMany(
        {
          conversationId: convId,
          recipientId: session.user.id,
          read: false,
        },
        {
          $set: {
            read: true,
            readAt: new Date(),
          },
        },
      );

      return NextResponse.json({
        messages,
        conversationId: convId,
        appointmentId: appointmentId || convId.replace("appointment_", ""),
      });
    } else {
      // Get all conversations (list of recent messages grouped by conversation)
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [
              { senderId: new mongoose.Types.ObjectId(session.user.id) },
              { recipientId: new mongoose.Types.ObjectId(session.user.id) },
            ],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: "$conversationId",
            lastMessage: { $first: "$$ROOT" },
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $eq: [
                          "$recipientId",
                          new mongoose.Types.ObjectId(session.user.id),
                        ],
                      },
                      { $eq: ["$read", false] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: { "lastMessage.createdAt": -1 },
        },
        {
          $limit: limit,
        },
      ]);

      // Populate user details
      const populatedConversations = await Promise.all(
        conversations.map(async (conv) => {
          const lastMsg = await Message.findById(conv.lastMessage._id)
            .populate("senderId", "firstName lastName role")
            .populate("recipientId", "firstName lastName role")
            .populate("appointmentId");
          return {
            conversationId: conv._id,
            lastMessage: lastMsg,
            unreadCount: conv.unreadCount,
          };
        }),
      );

      return NextResponse.json({
        conversations: populatedConversations,
      });
    }
  } catch (error: unknown) {
    console.error(
      "Get messages error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to fetch messages",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/messages
 * Send a new message
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();
    const { appointmentId, message, type, metadata } = data;

    if (!appointmentId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get appointment to find recipient
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Determine recipient
    let recipientId: mongoose.Types.ObjectId;
    if (appointment.clientId.toString() === session.user.id) {
      // Sender is client, recipient is professional
      if (!appointment.professionalId) {
        return NextResponse.json(
          { error: "No professional assigned yet" },
          { status: 400 },
        );
      }
      recipientId = appointment.professionalId;
    } else if (appointment.professionalId?.toString() === session.user.id) {
      // Sender is professional, recipient is client
      recipientId = appointment.clientId;
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const conversationId = `appointment_${appointmentId}`;

    const newMessage = new Message({
      conversationId,
      appointmentId,
      senderId: session.user.id,
      recipientId,
      message,
      type: type || "text",
      metadata,
      read: false,
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "firstName lastName role")
      .populate("recipientId", "firstName lastName role");

    // TODO: Send notification to recipient (email/push)

    return NextResponse.json(
      {
        success: true,
        message: populatedMessage,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(
      "Send message error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to send message",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/messages
 * Mark messages as read
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();
    const { conversationId, messageIds } = data;

    if (messageIds) {
      // Mark specific messages as read
      await Message.updateMany(
        {
          _id: { $in: messageIds },
          recipientId: session.user.id,
        },
        {
          $set: {
            read: true,
            readAt: new Date(),
          },
        },
      );
    } else if (conversationId) {
      // Mark all messages in conversation as read
      await Message.updateMany(
        {
          conversationId,
          recipientId: session.user.id,
          read: false,
        },
        {
          $set: {
            read: true,
            readAt: new Date(),
          },
        },
      );
    } else {
      return NextResponse.json(
        { error: "Must provide conversationId or messageIds" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error: unknown) {
    console.error(
      "Mark messages read error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to mark messages as read",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
