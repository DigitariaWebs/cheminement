"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Wallet,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api-client";

interface Professional {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty?: string;
  license?: string;
  bio?: string;
}

interface AvailableSlot {
  time: string;
  available: boolean;
}

interface AvailabilityData {
  professionalInfo: Professional & {
    pricing: {
      individualSession: number;
    };
  };
  workingHours: {
    start: string;
    end: string;
  };
  available: boolean;
  slots: AvailableSlot[];
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const t = useTranslations("Booking");

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Form data
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedType, setSelectedType] = useState<
    "video" | "in-person" | "phone"
  >("video");
  const [issueType, setIssueType] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [createdAppointmentId, setCreatedAppointmentId] = useState<string>("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [availabilityData, setAvailabilityData] =
    useState<AvailabilityData | null>(null);
  const [error, setError] = useState<string>("");

  // Load professionals on mount
  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<Professional[]>(
        "/users?role=professional",
      );
      setProfessionals(data);
    } catch (err: any) {
      console.error("Error loading professionals:", err);
      setError("Failed to load professionals");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends if professional doesn't work weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        }),
      });
    }

    return dates;
  };

  const loadAvailableSlots = async () => {
    if (!selectedProfessional || !selectedDate) return;

    try {
      setLoadingSlots(true);
      setError("");

      const response = await apiClient.get<
        AvailabilityData & { message?: string }
      >(
        `/appointments/available-slots?professionalId=${selectedProfessional}&date=${selectedDate}`,
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

  useEffect(() => {
    if (selectedProfessional && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedProfessional, selectedDate]);

  const handleProfessionalSelect = (professionalId: string) => {
    setSelectedProfessional(professionalId);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots([]);
    setAvailabilityData(null);
    setCompletedSteps([1]);
    setCurrentStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCompletedSteps([1, 2]);
    setCurrentStep(3);
  };

  const handleSubmit = async () => {
    if (
      !selectedProfessional ||
      !selectedDate ||
      !selectedTime ||
      !selectedType ||
      !issueType
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await apiClient.post<{ appointmentId: string }>(
        "/appointments",
        {
          professionalId: selectedProfessional,
          date: selectedDate,
          time: selectedTime,
          type: selectedType,
          issueType,
          notes,
        },
      );

      setCreatedAppointmentId(response.appointmentId);
      setCompletedSteps([1, 2, 3]);
      setCurrentStep(4); // Success step
    } catch (err: any) {
      console.error("Error booking appointment:", err);
      setError(err.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setSelectedProfessional("");
    setSelectedDate("");
    setSelectedTime("");
    setSelectedType("video");
    setIssueType("");
    setNotes("");
    setAvailableSlots([]);
    setAvailabilityData(null);
    setError("");
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
        return <Calendar className="h-5 w-5" />;
    }
  };

  const selectedProfessionalData = professionals.find(
    (p) => p._id === selectedProfessional,
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-serif font-light text-foreground mb-2">
            Book an Appointment
          </h1>
          <p className="text-muted-foreground text-lg">
            Schedule a session with a qualified mental health professional
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    completedSteps.includes(step) || currentStep > step
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step === 4 ? <CheckCircle2 className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-colors ${
                      completedSteps.includes(step) ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-16 text-sm text-muted-foreground">
            <span
              className={currentStep >= 1 ? "text-foreground font-medium" : ""}
            >
              Choose Professional
            </span>
            <span
              className={currentStep >= 2 ? "text-foreground font-medium" : ""}
            >
              Select Date & Time
            </span>
            <span
              className={currentStep >= 3 ? "text-foreground font-medium" : ""}
            >
              Appointment Details
            </span>
            <span
              className={currentStep >= 4 ? "text-foreground font-medium" : ""}
            >
              Confirmation
            </span>
          </div>
        </div>

        {/* Step 1: Choose Professional */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                Choose Your Professional
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {professionals.map((professional) => (
                    <div
                      key={professional._id}
                      className={`cursor-pointer transition-all hover:shadow-md rounded-xl border border-border/40 p-6 ${
                        selectedProfessional === professional._id
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                      onClick={() => handleProfessionalSelect(professional._id)}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {professional.firstName} {professional.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {professional.specialty ||
                              "Mental Health Professional"}
                          </p>
                        </div>
                      </div>
                      {professional.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {professional.bio}
                        </p>
                      )}
                      {professional.license && (
                        <Badge variant="secondary" className="mt-2">
                          Licensed: {professional.license}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Select Date & Time
              </h2>
              {selectedProfessionalData && (
                <p className="text-muted-foreground mt-2">
                  Booking with {selectedProfessionalData.firstName}{" "}
                  {selectedProfessionalData.lastName}
                </p>
              )}
            </div>
            <div className="p-6 space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Select a Date</Label>
                <Select value={selectedDate} onValueChange={handleDateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a date" />
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
                  <Label>Select a Time</Label>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => handleTimeSelect(slot.time)}
                          className={`rounded-lg border px-4 py-3 text-sm font-light transition ${
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
                        {error || "No available slots for this date"}
                      </p>
                    </div>
                  )}

                  {availabilityData && (
                    <p className="text-xs text-muted-foreground">
                      Working hours: {availabilityData.workingHours.start} -{" "}
                      {availabilityData.workingHours.end}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Appointment Details */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto rounded-xl bg-card border border-border/40">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-serif font-light text-foreground">
                Appointment Details
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Session Type */}
              <div className="space-y-2">
                <Label>Session Type</Label>
                <Select
                  value={selectedType}
                  onValueChange={(value: any) => setSelectedType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Video Call
                      </div>
                    </SelectItem>
                    <SelectItem value="in-person">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        In-Person
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Call
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Issue Type */}
              <div className="space-y-2">
                <Label>Primary Concern *</Label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary concern" />
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
                <Label>Additional Notes (Optional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us more about what you'd like to discuss..."
                  rows={4}
                />
              </div>

              {/* Pricing */}
              {availabilityData?.professionalInfo.pricing && (
                <div className="rounded-lg bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Session Price</span>
                    <span className="text-lg font-semibold">
                      $
                      {
                        availabilityData.professionalInfo.pricing
                          .individualSession
                      }{" "}
                      CAD
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    60-minute session
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={loading || !issueType}
                className="w-full gap-2"
                size="lg"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Book Appointment
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Success Header */}
            <div className="rounded-xl bg-card border border-border/40 text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-light text-foreground mb-2">
                Appointment Booked Successfully!
              </h2>
              <p className="text-muted-foreground">
                Your appointment has been scheduled. You'll receive a
                confirmation email shortly.
              </p>
            </div>

            {/* Appointment Details Card */}
            <div className="rounded-xl bg-card border border-border/40 p-6">
              <h3 className="text-lg font-serif font-light text-foreground mb-4">
                Appointment Details
              </h3>
              
              <div className="space-y-4">
                {/* Professional */}
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Professional</p>
                    <p className="font-medium text-foreground">
                      {selectedProfessionalData?.firstName}{" "}
                      {selectedProfessionalData?.lastName}
                    </p>
                    {selectedProfessionalData?.specialty && (
                      <p className="text-sm text-muted-foreground capitalize">
                        {selectedProfessionalData.specialty}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedTime}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Session Type */}
                <div className="flex items-start gap-3">
                  {getTypeIcon(selectedType)}
                  <div>
                    <p className="text-sm text-muted-foreground">Session Type</p>
                    <p className="font-medium text-foreground capitalize">
                      {selectedType.replace("-", " ")}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Primary Concern */}
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Primary Concern</p>
                    <p className="font-medium text-foreground">{issueType}</p>
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="rounded-lg bg-muted/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Session Price
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      $
                      {availabilityData?.professionalInfo.pricing
                        ?.individualSession || 120}{" "}
                      CAD
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Payment Status
                    </span>
                    <span className="inline-flex items-center rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="rounded-xl bg-card border border-border/40 p-6">
              <h3 className="text-lg font-serif font-light text-foreground mb-4">
                Next Steps
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete your payment now to confirm your appointment, or pay later from your billing page.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() =>
                    router.push("/client/dashboard/billing")
                  }
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <Wallet className="h-4 w-4" />
                  Pay Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/client/dashboard")}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <User className="h-4 w-4" />
                  View Dashboard
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={resetBooking}
                className="w-full mt-2"
              >
                Book Another Appointment
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {currentStep > 1 && currentStep < 4 && (
          <div className="flex justify-center mt-8 gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
