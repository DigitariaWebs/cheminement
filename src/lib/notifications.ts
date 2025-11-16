/**
 * Email notification utilities for appointment scheduling
 * This is a basic structure - integrate with SendGrid, Resend, or similar service
 */

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

// Send email (placeholder - integrate with your email service)
async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    // TODO: Integrate with SendGrid, Resend, AWS SES, or similar
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'JeChemine <noreply@jecheminement.com>',
    //   to: data.to,
    //   subject: data.subject,
    //   html: data.html,
    // });

    console.log("Email would be sent:", {
      to: data.to,
      subject: data.subject,
    });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
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
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8B7355; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .button { display: inline-block; background: #8B7355; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
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
                <strong>Date:</strong>
                <span>${formattedDate}</span>
              </div>
              <div class="detail-row">
                <strong>Time:</strong>
                <span>${data.time}</span>
              </div>
              <div class="detail-row">
                <strong>Duration:</strong>
                <span>${data.duration} minutes</span>
              </div>
              <div class="detail-row">
                <strong>Type:</strong>
                <span>${data.type === "video" ? "Video Call" : data.type === "in-person" ? "In Person" : "Phone Call"}</span>
              </div>
              ${
                data.meetingLink
                  ? `
              <div class="detail-row">
                <strong>Meeting Link:</strong>
                <span><a href="${data.meetingLink}">Join Session</a></span>
              </div>
              `
                  : ""
              }
              ${
                data.location
                  ? `
              <div class="detail-row">
                <strong>Location:</strong>
                <span>${data.location}</span>
              </div>
              `
                  : ""
              }
            </div>

            ${
              data.meetingLink
                ? `<a href="${data.meetingLink}" class="button">Join Video Session</a>`
                : ""
            }

            <p>If you need to reschedule or cancel, please log in to your dashboard.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} JeChemine. All rights reserved.</p>
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
Type: ${data.type}
${data.meetingLink ? `Meeting Link: ${data.meetingLink}` : ""}
${data.location ? `Location: ${data.location}` : ""}

If you need to reschedule or cancel, please log in to your dashboard.

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
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8B7355; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .button { display: inline-block; background: #8B7355; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Appointment Scheduled</h1>
          </div>
          <div class="content">
            <p>Dear ${data.professionalName},</p>
            <p>A new appointment has been scheduled with ${data.clientName}.</p>
            
            <div class="details">
              <div class="detail-row">
                <strong>Client:</strong>
                <span>${data.clientName}</span>
              </div>
              <div class="detail-row">
                <strong>Date:</strong>
                <span>${formattedDate}</span>
              </div>
              <div class="detail-row">
                <strong>Time:</strong>
                <span>${data.time}</span>
              </div>
              <div class="detail-row">
                <strong>Duration:</strong>
                <span>${data.duration} minutes</span>
              </div>
              <div class="detail-row">
                <strong>Type:</strong>
                <span>${data.type === "video" ? "Video Call" : data.type === "in-person" ? "In Person" : "Phone Call"}</span>
              </div>
            </div>

            <a href="${process.env.NEXTAUTH_URL}/professional/dashboard/schedule" class="button">View Schedule</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} JeChemine. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
New Appointment Scheduled

Dear ${data.professionalName},

A new appointment has been scheduled with ${data.clientName}.

Client: ${data.clientName}
Date: ${formattedDate}
Time: ${data.time}
Duration: ${data.duration} minutes
Type: ${data.type}

View your schedule at: ${process.env.NEXTAUTH_URL}/professional/dashboard/schedule

© ${new Date().getFullYear()} JeChemine. All rights reserved.
  `;

  return sendEmail({
    to: data.professionalEmail,
    subject: `New Appointment - ${formattedDate} at ${data.time}`,
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
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8B7355; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .reminder { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #8B7355; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
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
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Duration:</strong> ${data.duration} minutes</p>
              ${data.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">Join Session</a></p>` : ""}
            </div>

            ${data.meetingLink ? `<a href="${data.meetingLink}" class="button">Join Video Session</a>` : ""}

            <p>We look forward to seeing you!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} JeChemine. All rights reserved.</p>
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
    data.cancelledBy === "client"
      ? data.professionalEmail
      : data.clientEmail;
  const recipientName =
    data.cancelledBy === "client"
      ? data.professionalName
      : data.clientName;
  const cancellerName =
    data.cancelledBy === "client"
      ? data.clientName
      : data.professionalName;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
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
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Duration:</strong> ${data.duration} minutes</p>
            </div>

            <p>If you have any questions, please contact us.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} JeChemine. All rights reserved.</p>
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
