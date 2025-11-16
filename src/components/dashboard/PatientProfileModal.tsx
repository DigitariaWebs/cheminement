"use client";

import { X, Mail, Calendar, User } from "lucide-react";

interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AppointmentData {
  _id: string;
  clientId: PopulatedUser;
  professionalId: PopulatedUser;
  date: string;
  time: string;
  duration: number;
  type: "video" | "in-person" | "phone";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  issueType?: string;
  notes?: string;
  meetingLink?: string;
  location?: string;
}

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentData | null;
}

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
}: AppointmentDetailsModalProps) {
  if (!isOpen || !appointment) return null;

  const getTypeBadge = (type: AppointmentData["type"]) => {
    const styles = {
      video: "bg-blue-100 text-blue-700",
      "in-person": "bg-green-100 text-green-700",
      phone: "bg-purple-100 text-purple-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-light ${styles[type]}`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: AppointmentData["status"]) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-gray-100 text-gray-700",
      "no-show": "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-light ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-serif">
              {appointment.clientId.firstName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-serif font-light text-foreground">
                {appointment.clientId.firstName} {appointment.clientId.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {getTypeBadge(appointment.type)}
                {getStatusBadge(appointment.status)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Appointment Details */}
          <div className="rounded-xl bg-card p-6 border border-border/40">
            <h3 className="text-lg font-serif font-light text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Appointment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    Date
                  </p>
                  <p className="text-sm text-foreground font-light">
                    {formatDate(appointment.date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    Time
                  </p>
                  <p className="text-sm text-foreground font-light">
                    {appointment.time}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    Duration
                  </p>
                  <p className="text-sm text-foreground font-light">
                    {appointment.duration} minutes
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    Type
                  </p>
                  <p className="text-sm text-foreground font-light">
                    {appointment.type.charAt(0).toUpperCase() +
                      appointment.type.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    Issue Type
                  </p>
                  <p className="text-sm text-foreground font-light">
                    {appointment.issueType || "N/A"}
                  </p>
                </div>
                {appointment.location && (
                  <div>
                    <p className="text-xs text-muted-foreground font-light mb-1">
                      Location
                    </p>
                    <p className="text-sm text-foreground font-light">
                      {appointment.location}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {appointment.notes && (
              <div className="mt-6 pt-6 border-t border-border/40">
                <p className="text-xs text-muted-foreground font-light mb-2">
                  Notes
                </p>
                <p className="text-sm text-foreground font-light leading-relaxed">
                  {appointment.notes}
                </p>
              </div>
            )}
            {appointment.meetingLink && (
              <div className="mt-6 pt-6 border-t border-border/40">
                <p className="text-xs text-muted-foreground font-light mb-2">
                  Meeting Link
                </p>
                <a
                  href={appointment.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary font-light hover:underline"
                >
                  {appointment.meetingLink}
                </a>
              </div>
            )}
          </div>

          {/* Client Information */}
          <div className="rounded-xl bg-card p-6 border border-border/40">
            <h3 className="text-lg font-serif font-light text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Client Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    Name
                  </p>
                  <p className="text-sm text-foreground font-light">
                    {appointment.clientId.firstName}{" "}
                    {appointment.clientId.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    Email
                  </p>
                  <p className="text-sm text-foreground font-light">
                    {appointment.clientId.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-foreground font-light transition-colors hover:text-muted-foreground rounded-full"
            >
              Close
            </button>
            {appointment.status === "scheduled" && (
              <button className="px-6 py-2.5 bg-red-100 text-red-700 rounded-full font-light tracking-wide transition-all duration-300 hover:bg-red-200">
                Cancel Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
