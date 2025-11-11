"use client";

import {
  X,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Clock,
  Activity,
  Pill,
  Heart,
  Check,
} from "lucide-react";

interface AppointmentRequest {
  id: string;
  patientId: string;
  patientName: string;
  email: string;
  phone: string;
  requestDate: string;
  preferredDate: string;
  preferredTime: string;
  issueType: string;
  urgency: "low" | "medium" | "high";
  status: "pending" | "accepted" | "declined";
  isNewClient: boolean;
  mentalIllness?: string[];
  treatmentHistory?: {
    previousTherapists: number;
    currentMedications: string[];
    currentlyInTreatment: boolean;
    treatmentDuration?: string;
    previousDiagnoses?: string[];
  };
  message?: string;
  age?: number;
  gender?: string;
}

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AppointmentRequest | null;
}

export default function PatientProfileModal({
  isOpen,
  onClose,
  request,
}: PatientProfileModalProps) {
  if (!isOpen || !request) return null;

  const getUrgencyBadge = (urgency: AppointmentRequest["urgency"]) => {
    const styles = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-light ${styles[urgency]}`}
      >
        {urgency.charAt(0).toUpperCase() + urgency.slice(1)} Priority
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

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
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
              {request.patientName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-serif font-light text-foreground">
                {request.patientName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {request.isNewClient ? (
                  <span className="px-3 py-1 rounded-full text-xs font-light bg-purple-100 text-purple-700">
                    New Patient
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-light bg-blue-100 text-blue-700">
                    Returning Patient
                  </span>
                )}
                {getUrgencyBadge(request.urgency)}
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
          {/* Appointment Request Info */}
          <div className="rounded-xl bg-card p-6 border border-border/40">
            <h3 className="text-lg font-serif font-light text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Appointment Request
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    Requested Date
                  </p>
                  <p className="text-sm text-foreground font-light">
                    {formatDate(request.preferredDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    Preferred Time
                  </p>
                  <p className="text-sm text-foreground font-light">
                    {request.preferredTime}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    Issue Type
                  </p>
                  <p className="text-sm text-foreground font-light">
                    {request.issueType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    Request Submitted
                  </p>
                  <p className="text-sm text-foreground font-light">
                    {formatShortDate(request.requestDate)}
                  </p>
                </div>
              </div>
            </div>
            {request.message && (
              <div className="mt-6 pt-6 border-t border-border/40">
                <p className="text-xs text-muted-foreground font-light mb-2">
                  Patient Message
                </p>
                <p className="text-sm text-foreground font-light leading-relaxed">
                  {request.message}
                </p>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="rounded-xl bg-card p-6 border border-border/40">
            <h3 className="text-lg font-serif font-light text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-light mb-1">
                      Email
                    </p>
                    <p className="text-sm text-foreground font-light">
                      {request.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-light mb-1">
                      Phone
                    </p>
                    <p className="text-sm text-foreground font-light">
                      {request.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {request.age && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground font-light mb-1">
                        Age
                      </p>
                      <p className="text-sm text-foreground font-light">
                        {request.age} years old
                      </p>
                    </div>
                  </div>
                )}

                {request.gender && (
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground font-light mb-1">
                        Gender
                      </p>
                      <p className="text-sm text-foreground font-light">
                        {request.gender}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mental Illness */}
          {request.mentalIllness && request.mentalIllness.length > 0 && (
            <div className="rounded-xl bg-card p-6 border border-border/40">
              <h3 className="text-lg font-serif font-light text-foreground mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Mental Health Conditions
              </h3>
              <div className="space-y-3">
                {request.mentalIllness.map((condition, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground font-light">
                        {condition}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Treatment History */}
          {request.treatmentHistory && (
            <div className="rounded-xl bg-card p-6 border border-border/40">
              <h3 className="text-lg font-serif font-light text-foreground mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Treatment History
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground font-light mb-1">
                          Previous Therapists
                        </p>
                        <p className="text-sm text-foreground font-light">
                          {request.treatmentHistory.previousTherapists === 0
                            ? "No previous therapy"
                            : `${request.treatmentHistory.previousTherapists} therapist${
                                request.treatmentHistory.previousTherapists > 1
                                  ? "s"
                                  : ""
                              }`}
                        </p>
                      </div>
                    </div>

                    {request.treatmentHistory.treatmentDuration && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground font-light mb-1">
                            Treatment Duration
                          </p>
                          <p className="text-sm text-foreground font-light">
                            {request.treatmentHistory.treatmentDuration}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground font-light mb-1">
                          Currently in Treatment
                        </p>
                        <p className="text-sm text-foreground font-light flex items-center gap-2">
                          {request.treatmentHistory.currentlyInTreatment ? (
                            <>
                              <Check className="h-4 w-4 text-green-600" />
                              Yes
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 text-gray-400" />
                              No
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Medications */}
                {request.treatmentHistory.currentMedications &&
                  request.treatmentHistory.currentMedications.length > 0 && (
                    <div className="pt-6 border-t border-border/40">
                      <div className="flex items-center gap-2 mb-3">
                        <Pill className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-light text-muted-foreground">
                          Current Medications
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {request.treatmentHistory.currentMedications.map(
                          (medication, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg bg-muted/30"
                            >
                              <p className="text-sm text-foreground font-light">
                                {medication}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Previous Diagnoses */}
                {request.treatmentHistory.previousDiagnoses &&
                  request.treatmentHistory.previousDiagnoses.length > 0 && (
                    <div className="pt-6 border-t border-border/40">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-light text-muted-foreground">
                          Previous Diagnoses
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {request.treatmentHistory.previousDiagnoses.map(
                          (diagnosis, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg bg-muted/30"
                            >
                              <p className="text-sm text-foreground font-light">
                                {diagnosis}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-foreground font-light transition-colors hover:text-muted-foreground rounded-full"
            >
              Close
            </button>
            {request.status === "pending" && (
              <>
                <button className="px-6 py-2.5 bg-muted text-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:bg-muted/80">
                  Decline Request
                </button>
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Accept & Schedule
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
