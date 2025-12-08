import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import jsPDF from "jspdf";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Get appointment details
    const appointment = await Appointment.findById(appointmentId)
      .populate("clientId", "firstName lastName email")
      .populate("professionalId", "firstName lastName email");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Verify the user is authorized to download this receipt
    const client = appointment.clientId as unknown as {
      _id: { toString: () => string };
      firstName: string;
      lastName: string;
      email: string;
    };
    const professional = appointment.professionalId as unknown as {
      _id: { toString: () => string };
      firstName: string;
      lastName: string;
      email: string;
    };
    const clientId = client._id.toString();
    const professionalId = professional._id.toString();

    if (
      session.user.id !== clientId &&
      session.user.id !== professionalId &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Not authorized to access this receipt" },
        { status: 403 },
      );
    }

    // Check if payment is completed
    if (appointment.payment.status !== "paid") {
      return NextResponse.json(
        { error: "Receipt only available for paid appointments" },
        { status: 400 },
      );
    }

    // Create PDF
    const doc = new jsPDF();

    // Set colors
    const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo
    const textColor: [number, number, number] = [31, 41, 55]; // Gray-800
    const lightGray: [number, number, number] = [243, 244, 246]; // Gray-100

    // Header with company name
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Je Cheminement", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Mental Health Services Platform", 20, 32);

    // Receipt title
    doc.setTextColor(...textColor);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("RECEIPT", 20, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text(`Receipt #: REC-${appointmentId.slice(-8).toUpperCase()}`, 20, 62);
    doc.text(
      `Date Issued: ${appointment.payment.paidAt ? new Date(appointment.payment.paidAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}`,
      20,
      68,
    );

    // Divider
    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.line(20, 75, 190, 75);

    // Client Information
    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Client Information", 20, 85);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(`${client.firstName} ${client.lastName}`, 20, 92);
    doc.text(`${client.email}`, 20, 98);

    // Professional Information
    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Professional", 120, 85);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(`${professional.firstName} ${professional.lastName}`, 120, 92);
    doc.text(`${professional.email}`, 120, 98);

    // Divider
    doc.line(20, 105, 190, 105);

    // Appointment Details
    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Details", 20, 115);

    // Details box
    doc.setFillColor(...lightGray);
    doc.roundedRect(20, 120, 170, 40, 3, 3, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);

    const appointmentDate = appointment.date
      ? new Date(appointment.date).toLocaleDateString("en-CA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";

    doc.text(`Date: ${appointmentDate}`, 25, 130);
    doc.text(`Time: ${appointment.time}`, 25, 138);
    doc.text(`Duration: ${appointment.duration} minutes`, 25, 146);
    doc.text(
      `Type: ${appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}`,
      25,
      154,
    );

    const therapyTypeLabel =
      appointment.therapyType === "solo"
        ? "Individual"
        : appointment.therapyType === "couple"
          ? "Couple"
          : "Group";
    doc.text(`Therapy Type: ${therapyTypeLabel}`, 25, 162);

    // Payment Details
    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Details", 20, 183);

    // Payment table background
    doc.setFillColor(...lightGray);
    doc.roundedRect(20, 188, 170, 10, 2, 2, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 25, 195);
    doc.text("Amount", 160, 195, { align: "right" });

    // Payment rows
    let yPos = 205;

    // Session fee
    doc.setFont("helvetica", "normal");
    const therapyLabel =
      appointment.therapyType === "solo"
        ? "Individual"
        : appointment.therapyType === "couple"
          ? "Couple"
          : "Group";
    doc.text(`${therapyLabel} Therapy Session`, 25, yPos);
    doc.text(`$${appointment.payment.price.toFixed(2)}`, 160, yPos, {
      align: "right",
    });

    yPos += 10;

    // Platform fee (if showing breakdown)
    if (appointment.payment.platformFee > 0) {
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(9);
      doc.text("Platform Fee", 30, yPos);
      doc.text(`$${appointment.payment.platformFee.toFixed(2)}`, 160, yPos, {
        align: "right",
      });
      yPos += 8;
      doc.text("Professional Amount", 30, yPos);
      doc.text(
        `$${appointment.payment.professionalPayout.toFixed(2)}`,
        160,
        yPos,
        {
          align: "right",
        },
      );
      yPos += 10;
    }

    // Divider before total
    doc.setDrawColor(229, 231, 235);
    doc.line(25, yPos, 185, yPos);
    yPos += 8;

    // Total
    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total Paid", 25, yPos);
    doc.text(`$${appointment.payment.price.toFixed(2)} CAD`, 160, yPos, {
      align: "right",
    });

    yPos += 15;

    // Payment method info
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Payment Method: Credit Card", 25, yPos);
    yPos += 5;
    doc.text(
      `Transaction ID: ${appointment.payment.stripePaymentIntentId?.slice(-16) || "N/A"}`,
      25,
      yPos,
    );

    // Footer
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 260, 190, 260);

    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(
      "Thank you for choosing Je Cheminement for your mental health care needs.",
      105,
      270,
      { align: "center" },
    );
    doc.text(
      "For questions about this receipt, please contact support@jecheminement.com",
      105,
      276,
      { align: "center" },
    );

    doc.setFontSize(7);
    doc.text(
      "This is an automatically generated receipt. No signature required.",
      105,
      285,
      { align: "center" },
    );

    // Generate PDF as buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${appointmentId.slice(-8)}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Generate receipt error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate receipt",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
