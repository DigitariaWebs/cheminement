"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Video, MapPin, Phone, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalId: string;
  professionalName: string;
  onSuccess?: () => void;
}

interface TimeSlot {
  time: string;
  duration: number;
  available: boolean;
}

interface AvailabilityData {
  date: string;
  dayOfWeek: string;
  available: boolean;
  slots: TimeSlot[];
  professionalInfo: {
    id: string;
    name: string;
    sessionDuration: number;
    pricing: {
      individualSession?: number;
      coupleSession?: number;
      groupSession?: number;
    };
    sessionTypes: string[];
  };
  workingHours: {
    start: string;
    end: string;
  };
}

export default function BookAppointmentModal({
  isOpen,
  onClose,
  professionalId,
  professionalName,
  onSuccess,
}: BookAppointmentModalProps) {
  const t = useTranslations("Client.appointments");
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState<
    "video" | "in-person" | "phone"
  >("video");
  const [issueType, setIssueType] = useState("");
  const [notes, setNotes] = useState("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [availabilityData, setAvailabilityData] =
    useState<AvailabilityData | null>(null);
  const [error, setError] = useState("");

  // Generate next 30 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }
    return dates;
  };

  useEffect(() => {
    if (selectedDate && professionalId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, professionalId]);

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    setError("");
    try {
      const response = await apiClient.get<AvailabilityData & { message?: string }>(
        `/appointments/available-slots?professionalId=${professionalId}&date=${selectedDate}`,
      );

      if (response.available) {
        setAvailableSlots(response.slots);
        setAvailabilityData(response);
      } else {
        setAvailableSlots([]);
        setAvailabilityData(response);
        setError(response.message || "No available slots for this date");
      }
    } catch (err: any) {
      console.error("Error fetching slots:", err);
      setError(err.message || "Failed to load available time slots");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiClient.post("/appointments", {
        professionalId,
        date: selectedDate,
        time: selectedTime,
        type: selectedType,
        issueType,
        notes,
      });

      onSuccess?.();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error("Error booking appointment:", err);
      setError(err.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDate("");
    setSelectedTime("");
    setSelectedType("video");
    setIssueType("");
    setNotes("");
    setAvailableSlots([]);
    setAvailabilityData(null);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getPricing = () => {
    if (!availabilityData?.professionalInfo.pricing) return null;

    const pricing = availabilityData.professionalInfo.pricing;
    switch (selectedType) {
      case "video":
      case "phone":
      case "in-person":
        return pricing.individualSession;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-light">
            {t("booking.title")}
          </DialogTitle>
          <DialogDescription>
            {t("booking.description", { professional: professionalName })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t("booking.selectDate")}
            </Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger id="date">
                <SelectValue placeholder={t("booking.datePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {getAvailableDates().map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Available Time Slots */}
          {selectedDate && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t("booking.selectTime")}
              </Label>

              {loadingSlots ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedTime(slot.time)}
                      className={`rounded-lg border px-4 py-2 text-sm font-light transition ${
                        selectedTime === slot.time
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/30 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {error || t("booking.noSlots")}
                  </p>
                </div>
              )}

              {availabilityData && (
                <p className="text-xs text-muted-foreground">
                  {t("booking.workingHours")}:{" "}
                  {availabilityData.workingHours.start} -{" "}
                  {availabilityData.workingHours.end}
                </p>
              )}
            </div>
          )}

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">{t("booking.sessionType")}</Label>
            <Select
              value={selectedType}
              onValueChange={(value: any) => setSelectedType(value)}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    {t("modality.video")}
                  </div>
                </SelectItem>
                <SelectItem value="in-person">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t("modality.inPerson")}
                  </div>
                </SelectItem>
                <SelectItem value="phone">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t("modality.phone")}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {availabilityData && getPricing() && (
              <p className="text-sm text-muted-foreground">
                {t("booking.price")}: ${getPricing()} CAD
              </p>
            )}
          </div>

          {/* Issue Type */}
          <div className="space-y-2">
            <Label htmlFor="issueType">{t("booking.concern")}</Label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger id="issueType">
                <SelectValue placeholder={t("booking.concernPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Anxiety">Anxiety</SelectItem>
                <SelectItem value="Depression">Depression</SelectItem>
                <SelectItem value="Stress">Stress Management</SelectItem>
                <SelectItem value="Relationships">
                  Relationship Issues
                </SelectItem>
                <SelectItem value="Trauma">Trauma</SelectItem>
                <SelectItem value="Self-Esteem">Self-Esteem</SelectItem>
                <SelectItem value="Career">Career Counseling</SelectItem>
                <SelectItem value="Family">Family Issues</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t("booking.additionalNotes")}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("booking.notesPlaceholder")}
              rows={3}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="rounded-full"
            >
              {t("booking.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !selectedDate ||
                !selectedTime ||
                !selectedType ||
                !issueType
              }
              className="gap-2 rounded-full"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("booking.confirm")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
