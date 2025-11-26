"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  Save,
  Edit,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppointmentResponse } from "@/types/api";
import { appointmentsAPI } from "@/lib/api-client";

export default function SessionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [appointment, setAppointment] = useState<AppointmentResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Session notes state
  const [sessionNotes, setSessionNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Status change state
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] =
    useState<AppointmentResponse["status"]>("scheduled");

  // Reschedule state
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  // Session timer state (counts from scheduledStartAt when ongoing)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await appointmentsAPI.get(sessionId);
        setAppointment(response);
        setSessionNotes(response.notes || "");
        setNewStatus(response.status);
        setRescheduleDate(response.date.split("T")[0]);
        setRescheduleTime(response.time);

        // Initialize timer if session is already ongoing
        // Always count from scheduledStartAt (server-derived), not from "now"
        if (response.status === "ongoing") {
          try {
            // scheduledStartAt is a full ISO datetime string from backend
            const startSource = response.scheduledStartAt || response.date;
            const start = new Date(startSource);
            if (!isNaN(start.getTime())) {
              const now = new Date();
              const diffSeconds = Math.max(
                0,
                Math.floor((now.getTime() - start.getTime()) / 1000),
              );
              setElapsedSeconds(diffSeconds);
            } else {
              setElapsedSeconds(0);
            }
          } catch {
            setElapsedSeconds(0);
          }
        } else {
          setElapsedSeconds(0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [sessionId]);

  // Start timer helper
  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Stop timer helper
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Manage timer lifecycle based on appointment status
  useEffect(() => {
    if (!appointment) {
      stopTimer();
      setElapsedSeconds(0);
      return;
    }

    if (appointment.status === "ongoing") {
      startTimer();
    } else {
      stopTimer();
      setElapsedSeconds(0);
    }

    return () => {
      stopTimer();
    };
  }, [appointment]);

  const handleSaveNotes = async () => {
    if (!appointment) return;

    try {
      setSaving(true);
      const response = await appointmentsAPI.update(sessionId, {
        notes: sessionNotes,
      });

      setAppointment(response);
      setIsEditingNotes(false);
    } catch (err) {
      alert("Failed to save notes. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (status?: AppointmentResponse["status"]) => {
    if (!appointment) return;

    try {
      setSaving(true);
      const response = await appointmentsAPI.update(appointment._id, {
        status: status ?? newStatus,
      });

      setAppointment(response);
      setShowStatusDialog(false);
    } catch (err) {
      alert("Failed to update status. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReschedule = async () => {
    if (!appointment || !rescheduleDate || !rescheduleTime) {
      alert("Please select both date and time");
      return;
    }

    try {
      setSaving(true);
      const response = await appointmentsAPI.update(appointment._id, {
        date: new Date(rescheduleDate),
        time: rescheduleTime,
      });

      setAppointment(response);
      setShowRescheduleDialog(false);
    } catch (err) {
      alert("Failed to reschedule. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "in-person":
        return <MapPin className="h-5 w-5" />;
      case "phone":
        return <Phone className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const formatElapsedTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ];

    return parts.join(":");
  };

  const getStatusBadge = (status: AppointmentResponse["status"]) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      "no-show": "bg-orange-100 text-orange-700",
      pending: "bg-yellow-100 text-yellow-700",
      ongoing: "bg-purple-100 text-purple-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (
    paymentStatus: AppointmentResponse["payment"]["status"],
  ) => {
    const styles: Record<string, string> = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      failed: "bg-red-100 text-red-700",
      refunded: "bg-purple-100 text-purple-700",
      cancelled: "bg-gray-100 text-gray-700",
    };

    const labels: Record<string, string> = {
      paid: "Paid",
      pending: "Pending",
      processing: "Processing",
      failed: "Failed",
      refunded: "Refunded",
      cancelled: "Cancelled",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[paymentStatus] || styles.pending}`}
      >
        {labels[paymentStatus] || paymentStatus}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-red-500">{error || "Appointment not found"}</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-light text-foreground">
              Session Details
            </h1>
            <p className="text-muted-foreground font-light mt-1">
              Manage session information and notes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {appointment.status === "ongoing" && (
            <div className="rounded-full bg-purple-50 px-4 py-1.5 flex items-center gap-2 border border-purple-100">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">
                Live
              </span>
              <span className="text-sm font-mono text-purple-900">
                {formatElapsedTime(elapsedSeconds)}
              </span>
            </div>
          )}
          {appointment.status === "scheduled" && (
            <Button
              onClick={() => handleStatusChange("ongoing")}
              className="gap-2 rounded-full"
            >
              <Video className="h-4 w-4" />
              Start Session
            </Button>
          )}
          {appointment.status === "ongoing" && (
            <Button
              onClick={() => {
                if (appointment.type === "video" && appointment.meetingLink) {
                  window.open(appointment.meetingLink, "_blank");
                }
              }}
              className="gap-2 rounded-full"
            >
              <Video className="h-4 w-4" />
              Join Session
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-serif">
                  {appointment.clientId.firstName.charAt(0)}
                  {appointment.clientId.lastName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-foreground">
                    {appointment.clientId.firstName}{" "}
                    {appointment.clientId.lastName}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>{appointment.clientId.email}</p>
                    {appointment.clientId.phone && (
                      <p>{appointment.clientId.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Notes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Session Notes</CardTitle>
                {!isEditingNotes ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingNotes(true)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSessionNotes(appointment.notes || "");
                        setIsEditingNotes(false);
                      }}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={saving}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>
                Keep track of session progress, observations, and follow-ups
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <Textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Enter your session notes here..."
                  className="min-h-[300px] font-light"
                />
              ) : (
                <div className="min-h-[200px] rounded-lg bg-muted/30 p-4">
                  {sessionNotes ? (
                    <p className="text-sm text-foreground whitespace-pre-wrap font-light">
                      {sessionNotes}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground font-light italic">
                      No notes added yet. Click Edit to add session notes.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session History */}
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>Track of changes and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Session Created</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(appointment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(appointment.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Session Details & Actions */}
        <div className="space-y-6">
          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="mt-1">{getStatusBadge(appointment.status)}</div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Payment</Label>
                <div className="mt-1 flex items-center gap-2">
                  {getPaymentStatusBadge(appointment.payment.status)}
                  <span className="text-sm text-muted-foreground">
                    ${appointment.payment.price.toFixed(2)} CAD
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Date</Label>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Time</Label>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatTime(appointment.time)} ({appointment.duration} min)
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Type</Label>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  {getTypeIcon(appointment.type)}
                  <span className="capitalize">
                    {appointment.type.replace("-", " ")}
                  </span>
                </div>
              </div>

              {appointment.therapyType && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Therapy Type
                  </Label>
                  <p className="mt-1 text-sm capitalize">
                    {appointment.therapyType}
                  </p>
                </div>
              )}

              {appointment.issueType && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Issue Type
                  </Label>
                  <p className="mt-1 text-sm">{appointment.issueType}</p>
                </div>
              )}

              {appointment.meetingLink && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Meeting Link
                  </Label>
                  <a
                    href={appointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-primary hover:underline block break-all"
                  >
                    {appointment.meetingLink}
                  </a>
                </div>
              )}

              {appointment.location && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Location
                  </Label>
                  <p className="mt-1 text-sm">{appointment.location}</p>
                </div>
              )}

              <div>
                <Label className="text-xs text-muted-foreground">
                  Payment Status
                </Label>
                <p className="mt-1 text-sm capitalize">
                  {appointment.payment.status}
                </p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Fee</Label>
                <p className="mt-1 text-sm font-medium">
                  ${appointment.payment.price}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setShowStatusDialog(true)}
              >
                <Edit className="h-4 w-4" />
                Change Status
              </Button>
              {appointment.status === "scheduled" && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setShowRescheduleDialog(true)}
                >
                  <Calendar className="h-4 w-4" />
                  Reschedule
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Session Status</DialogTitle>
            <DialogDescription>
              Update the status of this session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select
                value={newStatus}
                onValueChange={(value) =>
                  setNewStatus(value as AppointmentResponse["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">
                Current status: <strong>{appointment.status}</strong>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={() => handleStatusChange()} disabled={saving}>
              {saving ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Session</DialogTitle>
            <DialogDescription>
              Choose a new date and time for this session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-time">Time</Label>
              <Input
                id="reschedule-time"
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">
                Current: {formatDate(appointment.date)} at{" "}
                {formatTime(appointment.time)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRescheduleDialog(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleReschedule} disabled={saving}>
              {saving ? "Rescheduling..." : "Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
