"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  Users,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Mail,
  Home,
  CreditCard,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import AuthPromptModal from "@/components/appointment/AuthPromptModal";
import { GuestPaymentForm } from "@/components/payments";

interface Professional {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty?: string;
  license?: string;
  bio?: string;
  hasSchedule?: boolean;
}

interface AvailableSlot {
  time: string;
  available: boolean;
}

interface AvailabilityData {
  date: string;
  dayOfWeek: string;
  available: boolean;
  slots: AvailableSlot[];
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
  message?: string;
}

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const { status } = useSession();

  // Auth state
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [authCheckDone, setAuthCheckDone] = useState(false);

  // Guest info
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
  });

  // Step management - starts at -1 for auth check
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Selection method
  const [selectionMethod, setSelectionMethod] = useState<
    "best-fit" | "choose" | null
  >(null);

  // Form data
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedType, setSelectedType] = useState<
    "video" | "in-person" | "phone"
  >("video");
  const [therapyType, setTherapyType] = useState<"solo" | "couple" | "group">(
    "solo",
  );
  const [issueType, setIssueType] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [availabilityData, setAvailabilityData] =
    useState<AvailabilityData | null>(null);
  const [error, setError] = useState<string>("");

  // Check authentication status on mount
  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      // User is logged in, proceed to selection method
      setIsGuest(false);
      setAuthCheckDone(true);
      setCurrentStep(0);
    } else {
      // User is not logged in, show auth prompt
      setShowAuthPrompt(true);
    }
  }, [status]);

  const handleContinueAsGuest = () => {
    setShowAuthPrompt(false);
    setIsGuest(true);
    setAuthCheckDone(true);
    setCurrentStep(0); // Start with guest info step
  };

  // Load professionals on mount
  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiClient.get<Professional[]>(
        "/users?role=professional",
      );
      setProfessionals(data);

      if (data.length === 0) {
        setError("No professionals available.");
      }
    } catch (err: unknown) {
      console.error("Error loading professionals:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load professionals",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionMethodChoice = (method: "best-fit" | "choose") => {
    setSelectionMethod(method);
    if (method === "best-fit") {
      // Auto-select first available professional
      if (professionals.length > 0) {
        setCompletedSteps(isGuest ? [0, 1] : [0]);
        handleProfessionalSelect(professionals[0]._id);
      }
    } else {
      const nextStep = isGuest ? 2 : 1;
      setCompletedSteps(isGuest ? [0, 1] : [0]);
      setCurrentStep(nextStep);
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      });
    }
    return dates;
  };

  const loadAvailableSlots = useCallback(async () => {
    if (!selectedProfessional || !selectedDate) return;

    try {
      setLoadingSlots(true);
      setError("");
      const response = await apiClient.get<AvailabilityData>(
        `/appointments/available-slots?professionalId=${selectedProfessional}&date=${selectedDate}`,
      );

      if (response.available && response.slots) {
        setAvailableSlots(response.slots);
        setAvailabilityData(response);
      } else {
        setAvailableSlots([]);
        setAvailabilityData(response);
        setError(response.message || "No available slots for this date");
      }
    } catch (err: unknown) {
      console.error("Error fetching slots:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load available time slots",
      );
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedProfessional, selectedDate]);

  useEffect(() => {
    if (selectedProfessional && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedProfessional, selectedDate, loadAvailableSlots]);

  const handleProfessionalSelect = (professionalId: string) => {
    setSelectedProfessional(professionalId);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots([]);
    setAvailabilityData(null);
    const nextStep = isGuest ? 3 : 2;
    setCompletedSteps(isGuest ? [0, 1, 2] : [0, 1]);
    setCurrentStep(nextStep);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    const nextStep = isGuest ? 4 : 3;
    setCompletedSteps(isGuest ? [0, 1, 2, 3] : [0, 1, 2]);
    setCurrentStep(nextStep);
  };

  const handleGuestInfoSubmit = () => {
    // Validate guest info
    if (
      !guestInfo.firstName.trim() ||
      !guestInfo.lastName.trim() ||
      !guestInfo.email.trim() ||
      !guestInfo.phone.trim() ||
      !guestInfo.location.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestInfo.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(guestInfo.phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    setError("");
    setCompletedSteps([0]);
    setCurrentStep(1); // Move to selection method
  };

  // Handle moving to payment step for guests
  const handleProceedToPayment = () => {
    if (!issueType) {
      setError("Please select what brings you here");
      return;
    }
    setError("");
    setCompletedSteps([0, 1, 2, 3, 4]);
    setCurrentStep(5); // Move to payment step
  };

  // Handle payment success for guests
  const handlePaymentSuccess = (methodId: string) => {
    // Automatically proceed to create appointment after payment verification
    handleGuestSubmitWithPayment(methodId);
  };

  // Submit guest appointment with payment method
  const handleGuestSubmitWithPayment = async (methodId: string) => {
    try {
      setLoading(true);
      setError("");

      const appointmentData = {
        professionalId: selectedProfessional,
        date: selectedDate,
        time: selectedTime,
        type: selectedType,
        therapyType,
        issueType,
        notes,
      };

      await apiClient.post<{ appointmentId: string }>("/appointments/guest", {
        ...appointmentData,
        guestInfo,
        paymentMethodId: methodId,
      });

      setCompletedSteps([0, 1, 2, 3, 4, 5, 6]);
      setCurrentStep(6); // Success step
    } catch (err: unknown) {
      console.error("Error booking appointment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to book appointment",
      );
    } finally {
      setLoading(false);
    }
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

    // For guests, proceed to payment step instead of submitting
    if (isGuest) {
      handleProceedToPayment();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const appointmentData = {
        professionalId: selectedProfessional,
        date: selectedDate,
        time: selectedTime,
        type: selectedType,
        therapyType,
        issueType,
        notes,
      };

      // Use regular endpoint for authenticated users
      await apiClient.post<{ appointmentId: string }>(
        "/appointments",
        appointmentData,
      );

      setCompletedSteps([0, 1, 2, 3, 4]);
      setCurrentStep(4); // Success step for authenticated users
    } catch (err: unknown) {
      console.error("Error booking appointment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to book appointment",
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedProfessionalData = professionals.find(
    (p) => p._id === selectedProfessional,
  );

  // Don't render until auth check is complete
  if (!authCheckDone) {
    return (
      <>
        <AuthPromptModal
          open={showAuthPrompt}
          onContinueAsGuest={handleContinueAsGuest}
        />
        <div className="min-h-screen bg-linear-to-br from-background to-muted/20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  const steps = isGuest ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4];
  const stepLabels = isGuest
    ? [
        "Your Info",
        "Selection Method",
        "Choose Professional",
        "Select Date & Time",
        "Appointment Details",
        "Payment",
        "Confirmation",
      ]
    : [
        "Selection Method",
        "Choose Professional",
        "Select Date & Time",
        "Appointment Details",
        "Confirmation",
      ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20">
      <AuthPromptModal
        open={showAuthPrompt}
        onContinueAsGuest={handleContinueAsGuest}
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            {isGuest && (
              <span className="block text-sm mt-1 text-muted-foreground">
                Booking as guest
              </span>
            )}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            {steps.map((step, idx) => (
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
                  {step === steps.length - 1 ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                {step < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-1 transition-colors ${
                      completedSteps.includes(step) ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-6 text-xs text-muted-foreground">
            {stepLabels.map((label, idx) => (
              <span
                key={idx}
                className={
                  currentStep >= (isGuest ? idx : idx)
                    ? "text-foreground font-medium"
                    : ""
                }
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && currentStep < 4 && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 p-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Step 0: Guest Info (only for guests) */}
        {isGuest && currentStep === 0 && (
          <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Information
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Please provide your contact information to proceed with booking
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={guestInfo.firstName}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, firstName: e.target.value })
                    }
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={guestInfo.lastName}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, lastName: e.target.value })
                    }
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, email: e.target.value })
                    }
                    placeholder="your.email@example.com"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We&apos;ll send your appointment confirmation here
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={guestInfo.phone}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={guestInfo.location}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, location: e.target.value })
                    }
                    placeholder="City, Province"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleGuestInfoSubmit}
                  size="lg"
                  className="gap-2"
                >
                  Continue to Booking
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 0/1: Selection Method */}
        {currentStep === (isGuest ? 1 : 0) && (
          <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                How would you like to choose your professional?
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <RadioGroup
                  value={selectionMethod || ""}
                  onValueChange={(value) =>
                    handleSelectionMethodChoice(value as "best-fit" | "choose")
                  }
                  className="space-y-4"
                >
                  <div
                    className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
                      selectionMethod === "best-fit"
                        ? "border-primary bg-primary/5"
                        : "border-border/40 hover:border-border"
                    }`}
                    onClick={() => handleSelectionMethodChoice("best-fit")}
                  >
                    <div className="flex items-start gap-4">
                      <RadioGroupItem value="best-fit" id="best-fit" />
                      <div className="flex-1">
                        <Label
                          htmlFor="best-fit"
                          className="cursor-pointer text-base font-medium text-foreground flex items-center gap-2"
                        >
                          <Sparkles className="h-5 w-5 text-primary" />
                          Best Fit for Me (Recommended)
                        </Label>
                        <p className="text-sm text-muted-foreground mt-2">
                          Let us match you with the most suitable professional
                          based on availability and expertise. This option gets
                          you started quickly with a qualified professional.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
                      selectionMethod === "choose"
                        ? "border-primary bg-primary/5"
                        : "border-border/40 hover:border-border"
                    }`}
                    onClick={() => handleSelectionMethodChoice("choose")}
                  >
                    <div className="flex items-start gap-4">
                      <RadioGroupItem value="choose" id="choose" />
                      <div className="flex-1">
                        <Label
                          htmlFor="choose"
                          className="cursor-pointer text-base font-medium text-foreground flex items-center gap-2"
                        >
                          <User className="h-5 w-5 text-primary" />
                          I&apos;ll Choose My Professional
                        </Label>
                        <p className="text-sm text-muted-foreground mt-2">
                          Browse through our active professionals and select the
                          one that best suits your needs. View their
                          specialties, experience, and availability.
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              )}
            </div>
          </div>
        )}

        {/* Step 1/2: Choose Professional */}
        {currentStep === (isGuest ? 2 : 1) && (
          <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                Choose Your Professional
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                All professionals shown are active and have availability
                schedules configured
              </p>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : professionals.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No professionals available at the moment.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please check back later or contact support for assistance.
                  </p>
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
                          <p className="text-sm text-muted-foreground capitalize">
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
                      <Badge variant="outline" className="mt-2 ml-2">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active & Available
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                  Back
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2/3: Select Date & Time */}
        {currentStep === (isGuest ? 3 : 2) && (
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
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={
                            selectedTime === slot.time ? "default" : "outline"
                          }
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          className="w-full"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border/40 bg-muted/30 p-6 text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No available time slots for this date
                      </p>
                    </div>
                  )}
                  {availabilityData && (
                    <p className="text-xs text-muted-foreground">
                      Working hours: {availabilityData.workingHours?.start} -{" "}
                      {availabilityData.workingHours?.end}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (isGuest) {
                      setCurrentStep(0); // Back to guest info
                    } else {
                      setCurrentStep(selectionMethod === "best-fit" ? 0 : 1);
                    }
                    setSelectedDate("");
                    setSelectedTime("");
                  }}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3/4: Appointment Details */}
        {currentStep === (isGuest ? 4 : 3) && (
          <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Appointment Details
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Session Type */}
              <div className="space-y-2">
                <Label>Session Type</Label>
                <Select
                  value={therapyType}
                  onValueChange={(value: "solo" | "couple" | "group") =>
                    setTherapyType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Individual Session
                      </div>
                    </SelectItem>
                    <SelectItem value="couple">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Couple Session
                      </div>
                    </SelectItem>
                    <SelectItem value="group">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Group Session
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Appointment Type */}
              <div className="space-y-2">
                <Label>Appointment Type</Label>
                <Select
                  value={selectedType}
                  onValueChange={(value: "video" | "in-person" | "phone") =>
                    setSelectedType(value)
                  }
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
                <Label htmlFor="issueType">What brings you here? *</Label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger id="issueType">
                    <SelectValue placeholder="Select a topic" />
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

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(2);
                  }}
                >
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading || !issueType}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isGuest ? "Processing..." : "Booking..."}
                    </>
                  ) : isGuest ? (
                    "Continue to Payment"
                  ) : (
                    "Continue to Confirmation"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Payment (guests only) */}
        {isGuest && currentStep === 5 && (
          <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Enter your card details to complete the booking. You will only
                be charged after your appointment is confirmed.
              </p>
            </div>
            <div className="p-6">
              <GuestPaymentForm
                guestEmail={guestInfo.email}
                guestName={`${guestInfo.firstName} ${guestInfo.lastName}`}
                onSuccess={handlePaymentSuccess}
                onBack={() => setCurrentStep(4)}
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* Step 4/6: Success */}
        {currentStep === (isGuest ? 6 : 4) && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="rounded-xl bg-card border border-border/40 p-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-serif font-light text-foreground mb-2">
                Appointment Requested!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your appointment request has been submitted successfully.
                {isGuest
                  ? " A confirmation email has been sent to your email address."
                  : " You'll receive a confirmation email shortly with all the details."}
              </p>

              <div className="space-y-4 text-left bg-muted/30 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Professional
                    </p>
                    <p className="font-medium text-foreground">
                      {selectedProfessionalData?.firstName}{" "}
                      {selectedProfessionalData?.lastName}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedTime}
                    </p>
                  </div>
                </div>
                {isGuest && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Confirmation sent to
                        </p>
                        <p className="font-medium text-foreground">
                          {guestInfo.email}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {isGuest ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>What happens next?</strong>
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      The professional will review your request. Once confirmed,
                      your card will be charged and you&apos;ll receive another
                      email with the final confirmation and meeting details.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/")}
                    className="gap-2"
                  >
                    Return to Home
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() =>
                      router.push("/client/dashboard/appointments")
                    }
                    className="gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    View My Appointments
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/client/dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
