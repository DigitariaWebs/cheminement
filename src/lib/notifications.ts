/**
 * Email notification utilities for appointment scheduling
 * Uses nodemailer with SMTP for sending emails
 */

import nodemailer from "nodemailer";

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface AppointmentEmailData {
  clientName: string;
  clientEmail: string;
  professionalName: string;
  professionalEmail: string;
  date: string;
  time: string;
  duration: number;
  type: "video" | "in-person" | "phone";
  meetingLink?: string;
  location?: string;
}

interface GuestBookingEmailData {
  guestName: string;
  guestEmail: string;
  professionalName: string;
  date: string;
  time: string;
  duration: number;
  type: "video" | "in-person" | "phone";
  therapyType: "solo" | "couple" | "group";
  price: number;
}

// Create reusable transporter using SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Format date for emails
function formatEmailDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Send email using nodemailer
async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    // Check if SMTP is configured
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
}

// Send guest booking confirmation email
export async function sendGuestBookingConfirmation(
  data: GuestBookingEmailData,
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);
  const sessionType =
    data.therapyType === "solo"
      ? "Individual"
      : data.therapyType === "couple"
        ? "Couple"
        : "Group";
  const appointmentType =
    data.type === "video"
      ? "Video Call"
      : data.type === "in-person"
        ? "In Person"
        : "Phone Call";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-weight: 300; font-size: 28px; }
          .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .success-badge { display: inline-block; background: #d4edda; color: #155724; padding: 8px 16px; border-radius: 20px; font-size: 14px; margin-bottom: 20px; }
          .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B7355; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #666; font-size: 14px; }
          .detail-value { font-weight: 600; color: #333; }
          .price-section { background: #8B7355; color: white; padding: 15px 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .price-section .amount { font-size: 24px; font-weight: 600; }
          .price-section .note { font-size: 12px; opacity: 0.9; margin-top: 5px; }
          .info-box { background: #e7f3ff; border: 1px solid #b6d4fe; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .info-box h3 { margin: 0 0 10px; color: #0a58ca; font-size: 16px; }
          .info-box p { margin: 0; color: #084298; font-size: 14px; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          .footer a { color: #8B7355; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Request Received</h1>
            <p>Thank you for booking with JeChemine</p>
          </div>
          <div class="content">
            <div style="text-align: center;">
              <span class="success-badge">✓ Request Submitted Successfully</span>
            </div>

            <p>Dear ${data.guestName},</p>
            <p>Thank you for your appointment request. Your booking is currently <strong>pending confirmation</strong> from ${data.professionalName}.</p>

            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Professional</span>
                <span class="detail-value">${data.professionalName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time</span>
                <span class="detail-value">${data.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration</span>
                <span class="detail-value">${data.duration} minutes</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Session Type</span>
                <span class="detail-value">${sessionType} Session</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Appointment Type</span>
                <span class="detail-value">${appointmentType}</span>
              </div>
            </div>

            <div class="price-section">
              <div class="amount">$${data.price.toFixed(2)} CAD</div>
              <div class="note">Your card will be charged once the professional confirms the appointment</div>
            </div>

            <div class="info-box">
              <h3>What happens next?</h3>
              <p>1. The professional will review your request and confirm the appointment.<br>
              2. Once confirmed, your card will be charged automatically.<br>
              3. You will receive another email with the final confirmation and any meeting details.</p>
            </div>

            <p style="color: #666; font-size: 14px;">If you have any questions or need to make changes, please reply to this email or contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} JeChemine. All rights reserved.</p>
            <p><a href="${process.env.NEXTAUTH_URL}">Visit our website</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Appointment Request Received

Dear ${data.guestName},

Thank you for your appointment request. Your booking is currently pending confirmation from ${data.professionalName}.

APPOINTMENT DETAILS
-------------------
Professional: ${data.professionalName}
Date: ${formattedDate}
Time: ${data.time}
Duration: ${data.duration} minutes
Session Type: ${sessionType} Session
Appointment Type: ${appointmentType}

PAYMENT
-------
Amount: $${data.price.toFixed(2)} CAD
Your card will be charged once the professional confirms the appointment.

WHAT HAPPENS NEXT?
------------------
1. The professional will review your request and confirm the appointment.
2. Once confirmed, your card will be charged automatically.
3. You will receive another email with the final confirmation and any meeting details.

If you have any questions or need to make changes, please reply to this email or contact our support team.

© ${new Date().getFullYear()} JeChemine. All rights reserved.
  `;

  return sendEmail({
    to: data.guestEmail,
    subject: `Appointment Request Received - ${formattedDate} at ${data.time}`,
    html,
    text,
  });
}

// Send appointment confirmation email to client
export async function sendAppointmentConfirmation(
  data: AppointmentEmailData,
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-weight: 300; font-size: 28px; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B7355; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #666; font-size: 14px; }
          .detail-value { font-weight: 600; color: #333; }
          .button { display: inline-block; background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: 500; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          .footer a { color: #8B7355; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Confirmed</h1>
          </div>
          <div class="content">
            <p>Dear ${data.clientName},</p>
            <p>Your appointment has been confirmed with ${data.professionalName}.</p>

            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time</span>
                <span class="detail-value">${data.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration</span>
                <span class="detail-value">${data.duration} minutes</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Type</span>
                <span class="detail-value">${data.type === "video" ? "Video Call" : data.type === "in-person" ? "In Person" : "Phone Call"}</span>
              </div>
              ${
                data.meetingLink
                  ? `
              <div class="detail-row">
                <span class="detail-label">Meeting Link</span>
                <span class="detail-value"><a href="${data.meetingLink}" style="color: #8B7355;">Join Session</a></span>
              </div>
              `
                  : ""
              }
              ${
                data.location
                  ? `
              <div class="detail-row">
                <span class="detail-label">Location</span>
                <span class="detail-value">${data.location}</span>
              </div>
              `
                  : ""
              }
            </div>

            ${
              data.meetingLink
                ? `<div style="text-align: center;"><a href="${data.meetingLink}" class="button">Join Video Session</a></div>`
                : ""
            }

            <p style="color: #666; font-size: 14px;">If you need to reschedule or cancel, please log in to your dashboard or contact us at least 24 hours in advance.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} JeChemine. All rights reserved.</p>
            <p><a href="${process.env.NEXTAUTH_URL}">Visit our website</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Appointment Confirmed

Dear ${data.clientName},

Your appointment has been confirmed with ${data.professionalName}.

Date: ${formattedDate}
Time: ${data.time}
Duration: ${data.duration} minutes
Type: ${data.type === "video" ? "Video Call" : data.type === "in-person" ? "In Person" : "Phone Call"}
${data.meetingLink ? `Meeting Link: ${data.meetingLink}` : ""}
${data.location ? `Location: ${data.location}` : ""}

If you need to reschedule or cancel, please log in to your dashboard or contact us at least 24 hours in advance.

© ${new Date().getFullYear()} JeChemine. All rights reserved.
  `;

  return sendEmail({
    to: data.clientEmail,
    subject: `Appointment Confirmed - ${formattedDate} at ${data.time}`,
    html,
    text,
  });
}

// Send appointment confirmation email to professional
export async function sendProfessionalNotification(
  data: AppointmentEmailData,
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-weight: 300; font-size: 28px; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B7355; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #666; font-size: 14px; }
          .detail-value { font-weight: 600; color: #333; }
          .button { display: inline-block; background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: 500; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          .footer a { color: #8B7355; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Appointment Request</h1>
          </div>
          <div class="content">
            <p>Dear ${data.professionalName},</p>
            <p>A new appointment has been requested by ${data.clientName}.</p>

            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Client</span>
                <span class="detail-value">${data.clientName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time</span>
                <span class="detail-value">${data.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration</span>
                <span class="detail-value">${data.duration} minutes</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Type</span>
                <span class="detail-value">${data.type === "video" ? "Video Call" : data.type === "in-person" ? "In Person" : "Phone Call"}</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/professional/dashboard/schedule" class="button">View Schedule</a>
            </div>

            <p style="color: #666; font-size: 14px;">Please review and confirm this appointment from your dashboard.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} JeChemine. All rights reserved.</p>
            <p><a href="${process.env.NEXTAUTH_URL}">Visit our website</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
New Appointment Request

Dear ${data.professionalName},

A new appointment has been requested by ${data.clientName}.

Client: ${data.clientName}
Date: ${formattedDate}
Time: ${data.time}
Duration: ${data.duration} minutes
Type: ${data.type === "video" ? "Video Call" : data.type === "in-person" ? "In Person" : "Phone Call"}

View your schedule at: ${process.env.NEXTAUTH_URL}/professional/dashboard/schedule

Please review and confirm this appointment from your dashboard.

© ${new Date().getFullYear()} JeChemine. All rights reserved.
  `;

  return sendEmail({
    to: data.professionalEmail,
    subject: `New Appointment Request - ${formattedDate} at ${data.time}`,
    html,
    text,
  });
}

// Send appointment reminder (24 hours before)
export async function sendAppointmentReminder(
  data: AppointmentEmailData,
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-weight: 300; font-size: 28px; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .reminder { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
          .reminder strong { color: #856404; }
          .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B7355; }
          .detail-row { padding: 8px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: 500; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          .footer a { color: #8B7355; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Reminder</h1>
          </div>
          <div class="content">
            <p>Dear ${data.clientName},</p>

            <div class="reminder">
              <strong>⏰ Reminder:</strong> Your appointment is scheduled for tomorrow!
            </div>

            <p>Your appointment with ${data.professionalName} is coming up:</p>

            <div class="details">
              <div class="detail-row"><strong>Date:</strong> ${formattedDate}</div>
              <div class="detail-row"><strong>Time:</strong> ${data.time}</div>
              <div class="detail-row"><strong>Duration:</strong> ${data.duration} minutes</div>
              ${data.meetingLink ? `<div class="detail-row"><strong>Meeting Link:</strong> <a href="${data.meetingLink}" style="color: #8B7355;">Join Session</a></div>` : ""}
            </div>

            ${data.meetingLink ? `<div style="text-align: center;"><a href="${data.meetingLink}" class="button">Join Video Session</a></div>` : ""}

            <p>We look forward to seeing you!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} JeChemine. All rights reserved.</p>
            <p><a href="${process.env.NEXTAUTH_URL}">Visit our website</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Appointment Reminder

Dear ${data.clientName},

Reminder: Your appointment is scheduled for tomorrow!

Date: ${formattedDate}
Time: ${data.time}
Duration: ${data.duration} minutes
${data.meetingLink ? `Meeting Link: ${data.meetingLink}` : ""}

We look forward to seeing you!

© ${new Date().getFullYear()} JeChemine. All rights reserved.
  `;

  return sendEmail({
    to: data.clientEmail,
    subject: `Reminder: Appointment Tomorrow at ${data.time}`,
    html,
    text,
  });
}

// Send cancellation notification
export async function sendCancellationNotification(
  data: AppointmentEmailData & { cancelledBy: "client" | "professional" },
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);
  const recipientEmail =
    data.cancelledBy === "client" ? data.professionalEmail : data.clientEmail;
  const recipientName =
    data.cancelledBy === "client" ? data.professionalName : data.clientName;
  const cancellerName =
    data.cancelledBy === "client" ? data.clientName : data.professionalName;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #b02a37 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-weight: 300; font-size: 28px; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545; }
          .detail-row { padding: 8px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          .footer a { color: #8B7355; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Cancelled</h1>
          </div>
          <div class="content">
            <p>Dear ${recipientName},</p>
            <p>The appointment scheduled for ${formattedDate} at ${data.time} has been cancelled by ${cancellerName}.</p>

            <div class="details">
              <div class="detail-row"><strong>Date:</strong> ${formattedDate}</div>
              <div class="detail-row"><strong>Time:</strong> ${data.time}</div>
              <div class="detail-row"><strong>Duration:</strong> ${data.duration} minutes</div>
            </div>

            <p>If you have any questions, please contact us.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} JeChemine. All rights reserved.</p>
            <p><a href="${process.env.NEXTAUTH_URL}">Visit our website</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Appointment Cancelled

Dear ${recipientName},

The appointment scheduled for ${formattedDate} at ${data.time} has been cancelled by ${cancellerName}.

Date: ${formattedDate}
Time: ${data.time}
Duration: ${data.duration} minutes

If you have any questions, please contact us.

© ${new Date().getFullYear()} JeChemine. All rights reserved.
  `;

  return sendEmail({
    to: recipientEmail,
    subject: `Appointment Cancelled - ${formattedDate}`,
    html,
    text,
  });
}

// Send payment confirmation email to guest
export async function sendGuestPaymentConfirmation(
  data: GuestBookingEmailData & { meetingLink?: string },
): Promise<boolean> {
  const formattedDate = formatEmailDate(data.date);
  const sessionType =
    data.therapyType === "solo"
      ? "Individual"
      : data.therapyType === "couple"
        ? "Couple"
        : "Group";
  const appointmentType =
    data.type === "video"
      ? "Video Call"
      : data.type === "in-person"
        ? "In Person"
        : "Phone Call";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-weight: 300; font-size: 28px; }
          .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .success-badge { display: inline-block; background: #d4edda; color: #155724; padding: 8px 16px; border-radius: 20px; font-size: 14px; margin-bottom: 20px; }
          .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #666; font-size: 14px; }
          .detail-value { font-weight: 600; color: #333; }
          .price-section { background: #28a745; color: white; padding: 15px 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .price-section .amount { font-size: 24px; font-weight: 600; }
          .price-section .note { font-size: 12px; opacity: 0.9; margin-top: 5px; }
          .button { display: inline-block; background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: 500; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          .footer a { color: #8B7355; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Confirmed</h1>
            <p>Payment Successful</p>
          </div>
          <div class="content">
            <div style="text-align: center;">
              <span class="success-badge">✓ Payment Confirmed</span>
            </div>

            <p>Dear ${data.guestName},</p>
            <p>Great news! Your appointment with ${data.professionalName} has been confirmed and your payment has been processed successfully.</p>

            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Professional</span>
                <span class="detail-value">${data.professionalName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time</span>
                <span class="detail-value">${data.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration</span>
                <span class="detail-value">${data.duration} minutes</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Session Type</span>
                <span class="detail-value">${sessionType} Session</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Appointment Type</span>
                <span class="detail-value">${appointmentType}</span>
              </div>
              ${
                data.meetingLink
                  ? `
              <div class="detail-row">
                <span class="detail-label">Meeting Link</span>
                <span class="detail-value"><a href="${data.meetingLink}" style="color: #28a745;">Join Session</a></span>
              </div>
              `
                  : ""
              }
            </div>

            <div class="price-section">
              <div class="amount">$${data.price.toFixed(2)} CAD</div>
              <div class="note">Payment processed successfully</div>
            </div>

            ${
              data.meetingLink
                ? `<div style="text-align: center;"><a href="${data.meetingLink}" class="button">Join Video Session</a></div>`
                : ""
            }

            <p style="color: #666; font-size: 14px;">Please save this email for your records. If you need to reschedule or have any questions, please reply to this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} JeChemine. All rights reserved.</p>
            <p><a href="${process.env.NEXTAUTH_URL}">Visit our website</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Appointment Confirmed - Payment Successful

Dear ${data.guestName},

Great news! Your appointment with ${data.professionalName} has been confirmed and your payment has been processed successfully.

APPOINTMENT DETAILS
-------------------
Professional: ${data.professionalName}
Date: ${formattedDate}
Time: ${data.time}
Duration: ${data.duration} minutes
Session Type: ${sessionType} Session
Appointment Type: ${appointmentType}
${data.meetingLink ? `Meeting Link: ${data.meetingLink}` : ""}

PAYMENT
-------
Amount: $${data.price.toFixed(2)} CAD
Status: Payment processed successfully

Please save this email for your records. If you need to reschedule or have any questions, please reply to this email.

© ${new Date().getFullYear()} JeChemine. All rights reserved.
  `;

  return sendEmail({
    to: data.guestEmail,
    subject: `Appointment Confirmed - ${formattedDate} at ${data.time}`,
    html,
    text,
  });
}
