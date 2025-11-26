/**
 * Email notification utilities for appointment scheduling
 * Uses nodemailer with SMTP for sending emails
 */

import nodemailer from "nodemailer";

// =============================================================================
// Types
// =============================================================================

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface BaseAppointmentData {
  date: string;
  time: string;
  duration: number;
  type: "video" | "in-person" | "phone";
}

interface AppointmentEmailData extends BaseAppointmentData {
  clientName: string;
  clientEmail: string;
  professionalName: string;
  professionalEmail: string;
  meetingLink?: string;
  location?: string;
}

interface GuestBookingEmailData extends BaseAppointmentData {
  guestName: string;
  guestEmail: string;
  professionalName: string;
  therapyType: "solo" | "couple" | "group";
  price: number;
  meetingLink?: string;
}

interface MeetingLinkEmailData {
  guestName: string;
  guestEmail: string;
  professionalName: string;
  date: string;
  time: string;
  duration: number;
  type: "video" | "in-person" | "phone";
  meetingLink: string;
}

type EmailTheme = "success" | "info" | "warning" | "danger";

// =============================================================================
// Configuration & Transport
// =============================================================================

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// =============================================================================
// Formatting Helpers
// =============================================================================

const formatEmailDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatAppointmentType = (
  type: "video" | "in-person" | "phone",
): string => {
  const types = {
    video: "Video Call",
    "in-person": "In Person",
    phone: "Phone Call",
  };
  return types[type];
};

const formatSessionType = (type: "solo" | "couple" | "group"): string => {
  const types = {
    solo: "Individual",
    couple: "Couple",
    group: "Group",
  };
  return types[type];
};

// =============================================================================
// Email Template Components
// =============================================================================

const getThemeColors = (theme: EmailTheme) => {
  const themes = {
    success: {
      primary: "#28a745",
      secondary: "#1e7e34",
      bg: "#d4edda",
      text: "#155724",
    },
    info: {
      primary: "#8B7355",
      secondary: "#6B5344",
      bg: "#f8f9fa",
      text: "#333",
    },
    warning: {
      primary: "#ffc107",
      secondary: "#e0a800",
      bg: "#fff3cd",
      text: "#856404",
    },
    danger: {
      primary: "#dc3545",
      secondary: "#b02a37",
      bg: "#f8d7da",
      text: "#721c24",
    },
  };
  return themes[theme];
};

const baseStyles = `
  body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B7355; }
  .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #666; font-size: 14px; }
  .detail-value { font-weight: 600; color: #333; }
  .button { display: inline-block; background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: 500; }
  .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
  .footer a { color: #8B7355; text-decoration: none; }
`;

const createHeader = (
  title: string,
  subtitle?: string,
  theme: EmailTheme = "info",
) => {
  const colors = getThemeColors(theme);
  return `
    <div class="header" style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-weight: 300; font-size: 28px;">${title}</h1>
      ${subtitle ? `<p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">${subtitle}</p>` : ""}
    </div>
  `;
};

const createDetailRow = (label: string, value: string, isLink = false) => {
  const valueHtml = isLink
    ? `<a href="${value}" style="color: #8B7355;">${value.includes("Join") ? "Join Session" : value}</a>`
    : value;
  return `
    <div class="detail-row">
      <span class="detail-label">${label}</span>
      <span class="detail-value">${valueHtml}</span>
    </div>
  `;
};

const createDetailsSection = (
  details: Array<{ label: string; value: string; isLink?: boolean }>,
  borderColor = "#8B7355",
) => {
  const rows = details
    .map((d) => createDetailRow(d.label, d.value, d.isLink))
    .join("");
  return `<div class="details" style="border-left-color: ${borderColor};">${rows}</div>`;
};

const createPriceSection = (
  amount: number,
  note: string,
  theme: EmailTheme = "info",
) => {
  const colors = getThemeColors(theme);
  return `
    <div style="background: ${colors.primary}; color: white; padding: 15px 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <div style="font-size: 24px; font-weight: 600;">$${amount.toFixed(2)} CAD</div>
      <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">${note}</div>
    </div>
  `;
};

const createInfoBox = (
  title: string,
  content: string,
  theme: EmailTheme = "info",
) => {
  const colors = getThemeColors(theme);
  return `
    <div style="background: ${colors.bg}; border: 1px solid ${colors.primary}40; padding: 15px 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px; color: ${colors.primary}; font-size: 16px;">${title}</h3>
      <p style="margin: 0; color: ${colors.text}; font-size: 14px;">${content}</p>
    </div>
  `;
};

const createButton = (text: string, url: string) => {
  return `<div style="text-align: center;"><a href="${url}" class="button">${text}</a></div>`;
};

const createFooter = () => {
  const year = new Date().getFullYear();
  const url = process.env.NEXTAUTH_URL || "";
  return `
    <div class="footer">
      <p>&copy; ${year} JeChemine. All rights reserved.</p>
      <p><a href="${url}">Visit our website</a></p>
    </div>
  `;
};

const createBadge = (text: string, theme: EmailTheme = "success") => {
  const colors = getThemeColors(theme);
  return `<span style="display: inline-block; background: ${colors.bg}; color: ${colors.text}; padding: 8px 16px; border-radius: 20px; font-size: 14px;">${text}</span>`;
};

// =============================================================================
// Email Template Builder
// =============================================================================

interface EmailTemplateOptions {
  title: string;
  subtitle?: string;
  theme?: EmailTheme;
  greeting: string;
  intro: string;
  details: Array<{ label: string; value: string; isLink?: boolean }>;
  detailsBorderColor?: string;
  price?: { amount: number; note: string; theme?: EmailTheme };
  infoBox?: { title: string; content: string; theme?: EmailTheme };
  badge?: { text: string; theme?: EmailTheme };
  button?: { text: string; url: string };
  outro?: string;
}

const buildEmailHtml = (options: EmailTemplateOptions): string => {
  const {
    title,
    subtitle,
    theme = "info",
    greeting,
    intro,
    details,
    detailsBorderColor,
    price,
    infoBox,
    badge,
    button,
    outro,
  } = options;

  const colors = getThemeColors(theme);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          ${createHeader(title, subtitle, theme)}
          <div class="content">
            ${badge ? `<div style="text-align: center; margin-bottom: 20px;">${createBadge(badge.text, badge.theme)}</div>` : ""}
            <p>${greeting}</p>
            <p>${intro}</p>
            ${createDetailsSection(details, detailsBorderColor || colors.primary)}
            ${price ? createPriceSection(price.amount, price.note, price.theme || theme) : ""}
            ${infoBox ? createInfoBox(infoBox.title, infoBox.content, infoBox.theme) : ""}
            ${button ? createButton(button.text, button.url) : ""}
            ${outro ? `<p style="color: #666; font-size: 14px;">${outro}</p>` : ""}
          </div>
          ${createFooter()}
        </div>
      </body>
    </html>
  `;
};

const buildEmailText = (sections: string[]): string => {
  return (
    sections.filter(Boolean).join("\n\n") +
    `\n\n© ${new Date().getFullYear()} JeChemine. All rights reserved.`
  );
};

// =============================================================================
// Email Sender
// =============================================================================

const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.log("SMTP not configured. Email would be sent:", {
        to: data.to,
        subject: data.subject,
      });
      return true;
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"JeChemine" <${process.env.SMTP_USER}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text,
    });

    console.log("Email sent successfully to:", data.to);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// =============================================================================
// Public Email Functions
// =============================================================================

export async function sendGuestBookingConfirmation(
  data: GuestBookingEmailData,
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);
  const sessionType = formatSessionType(data.therapyType);
  const appointmentType = formatAppointmentType(data.type);

  const html = buildEmailHtml({
    title: "Appointment Booked",
    subtitle: "Payment Successful",
    theme: "success",
    badge: { text: "✓ Payment Confirmed", theme: "success" },
    greeting: `Dear ${data.guestName},`,
    intro: `Thank you for booking with JeChemine! Your payment has been processed and your appointment is now <strong>pending confirmation</strong> from ${data.professionalName}.`,
    details: [
      { label: "Professional", value: data.professionalName },
      { label: "Date", value: formattedDate },
      { label: "Time", value: data.time },
      { label: "Duration", value: `${data.duration} minutes` },
      { label: "Session Type", value: `${sessionType} Session` },
      { label: "Appointment Type", value: appointmentType },
    ],
    price: {
      amount: data.price,
      note: "Payment processed successfully",
      theme: "success",
    },
    infoBox: {
      title: "What happens next?",
      content:
        "1. The professional will review your request and confirm the appointment.<br>2. You will receive a confirmation email once approved.<br>3. If the appointment is not confirmed, you will receive a full refund.",
    },
    outro:
      "If you have any questions or need to make changes, please reply to this email or contact our support team.",
  });

  const text = buildEmailText([
    "Appointment Booked - Payment Successful",
    `Dear ${data.guestName},`,
    `Thank you for booking with JeChemine! Your payment has been processed and your appointment is now pending confirmation from ${data.professionalName}.`,
    "APPOINTMENT DETAILS",
    `Professional: ${data.professionalName}`,
    `Date: ${formattedDate}`,
    `Time: ${data.time}`,
    `Duration: ${data.duration} minutes`,
    `Session Type: ${sessionType} Session`,
    `Appointment Type: ${appointmentType}`,
    "PAYMENT",
    `Amount: $${data.price.toFixed(2)} CAD`,
    "Status: Payment processed successfully",
    "WHAT HAPPENS NEXT?",
    "1. The professional will review your request and confirm the appointment.",
    "2. You will receive a confirmation email once approved.",
    "3. If the appointment is not confirmed, you will receive a full refund.",
  ]);

  return sendEmail({
    to: data.guestEmail,
    subject: `Appointment Booked - ${formattedDate} at ${data.time}`,
    html,
    text,
  });
}

export async function sendGuestPaymentConfirmation(
  data: GuestBookingEmailData,
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);
  const sessionType = formatSessionType(data.therapyType);
  const appointmentType = formatAppointmentType(data.type);

  const details: Array<{ label: string; value: string; isLink?: boolean }> = [
    { label: "Professional", value: data.professionalName },
    { label: "Date", value: formattedDate },
    { label: "Time", value: data.time },
    { label: "Duration", value: `${data.duration} minutes` },
    { label: "Session Type", value: `${sessionType} Session` },
    { label: "Appointment Type", value: appointmentType },
  ];

  if (data.meetingLink) {
    details.push({
      label: "Meeting Link",
      value: data.meetingLink,
      isLink: true,
    });
  }

  const html = buildEmailHtml({
    title: "Appointment Confirmed",
    subtitle: "Payment Successful",
    theme: "success",
    badge: { text: "✓ Payment Confirmed", theme: "success" },
    greeting: `Dear ${data.guestName},`,
    intro: `Great news! Your appointment with ${data.professionalName} has been confirmed and your payment has been processed successfully.`,
    details,
    detailsBorderColor: "#28a745",
    price: {
      amount: data.price,
      note: "Payment processed successfully",
      theme: "success",
    },
    button: data.meetingLink
      ? { text: "Join Video Session", url: data.meetingLink }
      : undefined,
    outro:
      "Please save this email for your records. If you need to reschedule or have any questions, please reply to this email.",
  });

  const text = buildEmailText([
    "Appointment Confirmed - Payment Successful",
    `Dear ${data.guestName},`,
    `Great news! Your appointment with ${data.professionalName} has been confirmed and your payment has been processed successfully.`,
    "APPOINTMENT DETAILS",
    `Professional: ${data.professionalName}`,
    `Date: ${formattedDate}`,
    `Time: ${data.time}`,
    `Duration: ${data.duration} minutes`,
    `Session Type: ${sessionType} Session`,
    `Appointment Type: ${appointmentType}`,
    data.meetingLink ? `Meeting Link: ${data.meetingLink}` : "",
    "PAYMENT",
    `Amount: $${data.price.toFixed(2)} CAD`,
    "Status: Payment processed successfully",
  ]);

  return sendEmail({
    to: data.guestEmail,
    subject: `Appointment Confirmed - ${formattedDate} at ${data.time}`,
    html,
    text,
  });
}

export async function sendAppointmentConfirmation(
  data: AppointmentEmailData,
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);
  const appointmentType = formatAppointmentType(data.type);

  const details: Array<{ label: string; value: string; isLink?: boolean }> = [
    { label: "Date", value: formattedDate },
    { label: "Time", value: data.time },
    { label: "Duration", value: `${data.duration} minutes` },
    { label: "Type", value: appointmentType },
  ];

  if (data.meetingLink) {
    details.push({
      label: "Meeting Link",
      value: data.meetingLink,
      isLink: true,
    });
  }
  if (data.location) {
    details.push({ label: "Location", value: data.location });
  }

  const html = buildEmailHtml({
    title: "Appointment Confirmed",
    theme: "info",
    greeting: `Dear ${data.clientName},`,
    intro: `Your appointment has been confirmed with ${data.professionalName}.`,
    details,
    button: data.meetingLink
      ? { text: "Join Video Session", url: data.meetingLink }
      : undefined,
    outro:
      "If you need to reschedule or cancel, please log in to your dashboard or contact us at least 24 hours in advance.",
  });

  const text = buildEmailText([
    "Appointment Confirmed",
    `Dear ${data.clientName},`,
    `Your appointment has been confirmed with ${data.professionalName}.`,
    `Date: ${formattedDate}`,
    `Time: ${data.time}`,
    `Duration: ${data.duration} minutes`,
    `Type: ${appointmentType}`,
    data.meetingLink ? `Meeting Link: ${data.meetingLink}` : "",
    data.location ? `Location: ${data.location}` : "",
    "If you need to reschedule or cancel, please log in to your dashboard or contact us at least 24 hours in advance.",
  ]);

  return sendEmail({
    to: data.clientEmail,
    subject: `Appointment Confirmed - ${formattedDate} at ${data.time}`,
    html,
    text,
  });
}

export async function sendProfessionalNotification(
  data: AppointmentEmailData,
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);
  const appointmentType = formatAppointmentType(data.type);
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/professional/dashboard/schedule`;

  const html = buildEmailHtml({
    title: "New Appointment Request",
    theme: "info",
    greeting: `Dear ${data.professionalName},`,
    intro: `A new appointment has been requested by ${data.clientName}.`,
    details: [
      { label: "Client", value: data.clientName },
      { label: "Date", value: formattedDate },
      { label: "Time", value: data.time },
      { label: "Duration", value: `${data.duration} minutes` },
      { label: "Type", value: appointmentType },
    ],
    button: { text: "View Schedule", url: dashboardUrl },
    outro: "Please review and confirm this appointment from your dashboard.",
  });

  const text = buildEmailText([
    "New Appointment Request",
    `Dear ${data.professionalName},`,
    `A new appointment has been requested by ${data.clientName}.`,
    `Client: ${data.clientName}`,
    `Date: ${formattedDate}`,
    `Time: ${data.time}`,
    `Duration: ${data.duration} minutes`,
    `Type: ${appointmentType}`,
    `View your schedule at: ${dashboardUrl}`,
    "Please review and confirm this appointment from your dashboard.",
  ]);

  return sendEmail({
    to: data.professionalEmail,
    subject: `New Appointment Request - ${formattedDate} at ${data.time}`,
    html,
    text,
  });
}

export async function sendAppointmentReminder(
  data: AppointmentEmailData,
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);

  const details: Array<{ label: string; value: string; isLink?: boolean }> = [
    { label: "Date", value: formattedDate },
    { label: "Time", value: data.time },
    { label: "Duration", value: `${data.duration} minutes` },
  ];

  if (data.meetingLink) {
    details.push({
      label: "Meeting Link",
      value: data.meetingLink,
      isLink: true,
    });
  }

  const html = buildEmailHtml({
    title: "Appointment Reminder",
    theme: "info",
    greeting: `Dear ${data.clientName},`,
    intro: `Your appointment with ${data.professionalName} is coming up:`,
    details,
    infoBox: {
      title: "⏰ Reminder",
      content: "Your appointment is scheduled for tomorrow!",
      theme: "warning",
    },
    button: data.meetingLink
      ? { text: "Join Video Session", url: data.meetingLink }
      : undefined,
    outro: "We look forward to seeing you!",
  });

  const text = buildEmailText([
    "Appointment Reminder",
    `Dear ${data.clientName},`,
    "Reminder: Your appointment is scheduled for tomorrow!",
    `Date: ${formattedDate}`,
    `Time: ${data.time}`,
    `Duration: ${data.duration} minutes`,
    data.meetingLink ? `Meeting Link: ${data.meetingLink}` : "",
    "We look forward to seeing you!",
  ]);

  return sendEmail({
    to: data.clientEmail,
    subject: `Reminder: Appointment Tomorrow at ${data.time}`,
    html,
    text,
  });
}

export async function sendMeetingLinkNotification(
  data: MeetingLinkEmailData,
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);
  const appointmentType = formatAppointmentType(data.type);

  const html = buildEmailHtml({
    title: "Meeting Link Added",
    subtitle: "Your session details are ready",
    theme: "success",
    badge: { text: "✓ Ready to Join", theme: "success" },
    greeting: `Dear ${data.guestName},`,
    intro: `Great news! ${data.professionalName} has added the meeting link for your upcoming appointment.`,
    details: [
      { label: "Professional", value: data.professionalName },
      { label: "Date", value: formattedDate },
      { label: "Time", value: data.time },
      { label: "Duration", value: `${data.duration} minutes` },
      { label: "Type", value: appointmentType },
      { label: "Meeting Link", value: data.meetingLink, isLink: true },
    ],
    detailsBorderColor: "#28a745",
    button: { text: "Join Video Session", url: data.meetingLink },
    outro:
      "Please join the session a few minutes early to ensure everything is working properly. If you have any issues, please reply to this email.",
  });

  const text = buildEmailText([
    "Meeting Link Added - Your Session Details Are Ready",
    `Dear ${data.guestName},`,
    `Great news! ${data.professionalName} has added the meeting link for your upcoming appointment.`,
    "APPOINTMENT DETAILS",
    `Professional: ${data.professionalName}`,
    `Date: ${formattedDate}`,
    `Time: ${data.time}`,
    `Duration: ${data.duration} minutes`,
    `Type: ${appointmentType}`,
    `Meeting Link: ${data.meetingLink}`,
    "Please join the session a few minutes early to ensure everything is working properly.",
  ]);

  return sendEmail({
    to: data.guestEmail,
    subject: `Meeting Link Ready - ${formattedDate} at ${data.time}`,
    html,
    text,
  });
}

export async function sendCancellationNotification(
  data: AppointmentEmailData & { cancelledBy: "client" | "professional" },
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);
  const isClientCancellation = data.cancelledBy === "client";
  const recipientEmail = isClientCancellation
    ? data.professionalEmail
    : data.clientEmail;
  const recipientName = isClientCancellation
    ? data.professionalName
    : data.clientName;
  const cancellerName = isClientCancellation
    ? data.clientName
    : data.professionalName;

  const html = buildEmailHtml({
    title: "Appointment Cancelled",
    theme: "danger",
    greeting: `Dear ${recipientName},`,
    intro: `The appointment scheduled for ${formattedDate} at ${data.time} has been cancelled by ${cancellerName}.`,
    details: [
      { label: "Date", value: formattedDate },
      { label: "Time", value: data.time },
      { label: "Duration", value: `${data.duration} minutes` },
    ],
    detailsBorderColor: "#dc3545",
    outro: "If you have any questions, please contact us.",
  });

  const text = buildEmailText([
    "Appointment Cancelled",
    `Dear ${recipientName},`,
    `The appointment scheduled for ${formattedDate} at ${data.time} has been cancelled by ${cancellerName}.`,
    `Date: ${formattedDate}`,
    `Time: ${data.time}`,
    `Duration: ${data.duration} minutes`,
    "If you have any questions, please contact us.",
  ]);

  return sendEmail({
    to: recipientEmail,
    subject: `Appointment Cancelled - ${formattedDate}`,
    html,
    text,
  });
}
