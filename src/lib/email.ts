// NOTE: This file is currently unused. The project uses @/lib/notifications instead.
// Kept for reference but commented out to avoid build errors.

/*
import nodemailer from 'nodemailer';

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
*/

interface EmailData {
  clientName: string;
  clientEmail: string;
  professionalName: string;
  professionalEmail: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  meetingLink?: string;
  location?: string;
}

/*
export async function sendAppointmentConfirmation(data: EmailData) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: data.clientEmail,
      subject: 'Appointment Confirmation - JeChemine',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Appointment Confirmed</h2>
          <p>Dear ${data.clientName},</p>
          <p>Your appointment has been successfully booked:</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Professional:</strong> ${data.professionalName}</p>
            <p><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Duration:</strong> ${data.duration} minutes</p>
            <p><strong>Type:</strong> ${data.type}</p>
            ${data.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>` : ''}
            ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
          </div>
          <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
          <p>Best regards,<br>JeChemine Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Appointment confirmation email sent to:', data.clientEmail);
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    // Don't throw error to avoid blocking appointment creation
  }
}
*/

/*
export async function sendProfessionalNotification(data: EmailData) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: data.professionalEmail,
      subject: 'New Appointment Scheduled - JeChemine',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Appointment Scheduled</h2>
          <p>Dear ${data.professionalName},</p>
          <p>A new appointment has been booked:</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Client:</strong> ${data.clientName}</p>
            <p><strong>Email:</strong> ${data.clientEmail}</p>
            <p><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Duration:</strong> ${data.duration} minutes</p>
            <p><strong>Type:</strong> ${data.type}</p>
            ${data.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>` : ''}
            ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
          </div>
          <p>Please prepare for the session and ensure you're available at the scheduled time.</p>
          <p>Best regards,<br>JeChemine Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Professional notification email sent to:', data.professionalEmail);
  } catch (error) {
    console.error('Error sending professional notification email:', error);
    // Don't throw error to avoid blocking appointment creation
  }
}
*/
