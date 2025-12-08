"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
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
  Mail,
  Home,
  UserPlus,
  Calendar,
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
import { apiClient, medicalProfileAPI } from "@/lib/api-client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
}

interface MedicalProfileData {
  primaryIssue?: string;
  availability?: string[];
  modality?: "online" | "inPerson" | "both";
  sessionFrequency?: string;
  location?: string;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const { status } = useSession();

  // Auth state
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

  // Medical profile data for defaults
  const [medicalProfile, setMedicalProfile] =
    useState<MedicalProfileData | null>(null);

  // Step management - starts at -1 for auth check
  // Steps: 0 = Auth Choice, 1 = Who is this for, 2 = Guest Info, 3 = Appointment Details, 4 = Confirmation, 5 = Success
  const [currentStep, setCurrentStep] = useState(-1);

  // Form data
  const [selectedType, setSelectedType] = useState<
    "video" | "in-person" | "phone"
  >("video");
  const [therapyType, setTherapyType] = useState<"solo" | "couple" | "group">(
    "solo",
  );
  const [issueType, setIssueType] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [preferredAvailability, setPreferredAvailability] = useState<string[]>(
    [],
  );

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Booking context
  const [bookingFor, setBookingFor] = useState<
    "self" | "patient" | "loved-one" | null
  >(null);

  // Check for 'for' query param
  const searchParams = useSearchParams();
  useEffect(() => {
    const forParam = searchParams.get("for");
    if (forParam && ["self", "patient", "loved-one"].includes(forParam)) {
      setBookingFor(forParam as "self" | "patient" | "loved-one");
    }
  }, [searchParams]);

  // Fetch medical profile for defaults (authenticated users only)
  useEffect(() => {
    const fetchMedicalProfile = async () => {
      if (status === "authenticated") {
        try {
          const profile = await medicalProfileAPI.get();
          if (profile) {
            setMedicalProfile(profile as MedicalProfileData);
            // Set defaults from medical profile
            if ((profile as MedicalProfileData).primaryIssue) {
              setIssueType((profile as MedicalProfileData).primaryIssue || "");
            }
            if ((profile as MedicalProfileData).availability) {
              setPreferredAvailability(
                (profile as MedicalProfileData).availability || [],
              );
            }
            if ((profile as MedicalProfileData).modality) {
              const modality = (profile as MedicalProfileData).modality;
              if (modality === "online") {
                setSelectedType("video");
              } else if (modality === "inPerson") {
                setSelectedType("in-person");
              }
              // "both" keeps default
            }
          }
        } catch {
          // Medical profile might not exist, that's okay
        }
      }
    };
    fetchMedicalProfile();
  }, [status]);

  // Check authentication status on mount
  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      // User is logged in
      setIsGuest(false);
      setAuthCheckDone(true);
      // Skip Auth Choice (0)
      if (bookingFor) {
        setCurrentStep(3); // Skip Who is this for (1) and Guest Info (2)
      } else {
        setCurrentStep(1); // Start at Who is this for
      }
    } else {
      // User is not logged in
      setAuthCheckDone(true);
      setCurrentStep(0); // Start at Auth Choice
    }
  }, [status, bookingFor]);

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    if (bookingFor) {
      setCurrentStep(2); // Go to Guest Info
    } else {
      setCurrentStep(1); // Go to Who is this for
    }
  };

  const handleSignIn = () => {
    router.push("/login?returnUrl=/appointment");
  };

  const handleWhoChoice = (who: "self" | "patient" | "loved-one") => {
    setBookingFor(who);
    // If guest, go to Guest Info (2), else go to Appointment Details (3)
    setCurrentStep(isGuest ? 2 : 3);
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
    setCurrentStep(3); // Move to appointment details
  };

  // Submit guest appointment without payment
  const handleGuestSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const appointmentData = {
        type: selectedType,
        therapyType,
        issueType,
        notes,
        bookingFor,
        preferredAvailability,
      };

      await apiClient.post<{ appointmentId: string }>("/appointments/guest", {
        ...appointmentData,
        guestInfo,
      });

      setCurrentStep(5); // Success step
    } catch (err: unknown) {
      console.error("Error booking appointment:", err);
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType || !issueType) {
      setError("Please fill in all required fields");
      return;
    }

    // For guests, submit without payment
    if (isGuest) {
      handleGuestSubmit();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const appointmentData = {
        type: selectedType,
        therapyType,
        issueType,
        notes,
        bookingFor,
        preferredAvailability,
      };

      // Use regular endpoint for authenticated users
      await apiClient.post<{ appointmentId: string }>(
        "/appointments",
        appointmentData,
      );

      setCurrentStep(5); // Success step
    } catch (err: unknown) {
      console.error("Error submitting request:", err);
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const renderSummary = () => {
    return (
      <div className="bg-card rounded-xl border border-border/40 p-6 space-y-6 sticky top-8">
        <h3 className="font-serif text-lg font-medium border-b border-border/40 pb-4 mb-4">
          Request Summary
        </h3>

        {/* Who is this for */}
        <div className={`space-y-1 ${currentStep <= 1 ? "opacity-50" : ""}`}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            For
          </p>
          <div className="flex items-center gap-2 text-sm">
            {bookingFor && currentStep > 1 ? (
              <>
                {bookingFor === "self" && <User className="h-4 w-4" />}
                {bookingFor === "patient" && <User className="h-4 w-4" />}
                {bookingFor === "loved-one" && <Users className="h-4 w-4" />}
                <span className="capitalize">
                  {bookingFor === "loved-one" ? "Loved One" : bookingFor}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground italic">Pending...</span>
            )}
          </div>
        </div>

        {/* Guest Info */}
        {isGuest && (
          <div className={`space-y-1 ${currentStep <= 2 ? "opacity-50" : ""}`}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Your Info
            </p>
            <div className="text-sm">
              {guestInfo.firstName && currentStep > 2 ? (
                <>
                  <p className="font-medium">
                    {guestInfo.firstName} {guestInfo.lastName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {guestInfo.email}
                  </p>
                </>
              ) : (
                <span className="text-muted-foreground italic">Pending...</span>
              )}
            </div>
          </div>
        )}

        {/* Details */}
        <div className={`space-y-1 ${currentStep < 3 ? "opacity-50" : ""}`}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Details
          </p>
          <div className="text-sm space-y-1">
            {currentStep >= 3 ? (
              <>
                {therapyType && (
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span className="capitalize">{therapyType} Session</span>
                  </div>
                )}
                {selectedType && (
                  <div className="flex items-center gap-2">
                    {selectedType === "video" && <Video className="h-3 w-3" />}
                    {selectedType === "in-person" && (
                      <MapPin className="h-3 w-3" />
                    )}
                    {selectedType === "phone" && <Phone className="h-3 w-3" />}
                    <span className="capitalize">{selectedType}</span>
                  </div>
                )}
                {issueType && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" />
                    <span>{issueType}</span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-muted-foreground italic">Pending...</span>
            )}
          </div>
        </div>

        {/* Info box about the new flow */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>How it works:</strong>
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            After you submit your request, a qualified professional will review
            and contact you to schedule your appointment.
          </p>
        </div>
      </div>
    );
  };

  // Don't render until auth check is complete
  if (!authCheckDone) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background to-muted/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20">
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
            Request an Appointment
          </h1>
          <p className="text-muted-foreground text-lg">
            Submit a request to be matched with a qualified mental health
            professional
            {isGuest && (
              <span className="block text-sm mt-1 text-muted-foreground">
                Booking as guest
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Summary */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
            {renderSummary()}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* Error Display */}
            {error && currentStep < 4 && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 p-4">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Step 0: Account or Guest */}
            {currentStep === 0 && (
              <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
                <div className="p-6 border-b border-border/40">
                  <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                    <User className="h-5 w-5" />
                    How would you like to proceed?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Choose how you&apos;d like to submit your request
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sign In Option */}
                    <div
                      className="cursor-pointer rounded-xl border-2 border-border/40 p-6 transition-all hover:border-primary hover:bg-primary/5"
                      onClick={handleSignIn}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Sign In</h3>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>Manage all your appointments</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>Access your appointment history</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>Pre-filled from your profile</span>
                        </div>
                      </div>
                    </div>

                    {/* Guest Option */}
                    <div
                      className="cursor-pointer rounded-xl border-2 border-border/40 p-6 transition-all hover:border-primary hover:bg-primary/5"
                      onClick={handleContinueAsGuest}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                          <UserPlus className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg">
                          Continue as Guest
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>Quick request process</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>No account needed</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>Professional will contact you</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Who is this for? */}
            {currentStep === 1 && (
              <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
                <div className="p-6 border-b border-border/40">
                  <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Who is this appointment for?
                  </h2>
                </div>
                <div className="p-6">
                  <RadioGroup
                    value={bookingFor || ""}
                    onValueChange={(value) =>
                      handleWhoChoice(value as "self" | "patient" | "loved-one")
                    }
                    className="space-y-4"
                  >
                    <div
                      className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
                        bookingFor === "self"
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-border"
                      }`}
                      onClick={() => handleWhoChoice("self")}
                    >
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value="self" id="self" />
                        <div className="flex-1">
                          <Label
                            htmlFor="self"
                            className="cursor-pointer text-base font-medium text-foreground flex items-center gap-2"
                          >
                            <User className="h-5 w-5 text-primary" />
                            For Myself
                          </Label>
                          <p className="text-sm text-muted-foreground mt-2">
                            I&apos;m requesting this appointment for myself and
                            will be the one attending the session.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
                        bookingFor === "patient"
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-border"
                      }`}
                      onClick={() => handleWhoChoice("patient")}
                    >
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value="patient" id="patient" />
                        <div className="flex-1">
                          <Label
                            htmlFor="patient"
                            className="cursor-pointer text-base font-medium text-foreground flex items-center gap-2"
                          >
                            <User className="h-5 w-5 text-primary" />
                            For a Patient
                          </Label>
                          <p className="text-sm text-muted-foreground mt-2">
                            I&apos;m a healthcare professional requesting on
                            behalf of my patient.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
                        bookingFor === "loved-one"
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-border"
                      }`}
                      onClick={() => handleWhoChoice("loved-one")}
                    >
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value="loved-one" id="loved-one" />
                        <div className="flex-1">
                          <Label
                            htmlFor="loved-one"
                            className="cursor-pointer text-base font-medium text-foreground flex items-center gap-2"
                          >
                            <Users className="h-5 w-5 text-primary" />
                            For a Loved One
                          </Label>
                          <p className="text-sm text-muted-foreground mt-2">
                            I&apos;m requesting this appointment for a family
                            member or loved one who will be attending the
                            session.
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(0)}
                      className={status === "authenticated" ? "hidden" : ""}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Guest Info (only for guests) */}
            {isGuest && currentStep === 2 && (
              <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
                <div className="p-6 border-b border-border/40">
                  <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Your Information
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please provide your contact information so a professional
                    can reach out to you
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
                          setGuestInfo({
                            ...guestInfo,
                            firstName: e.target.value,
                          })
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
                          setGuestInfo({
                            ...guestInfo,
                            lastName: e.target.value,
                          })
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
                      A professional will contact you at this email
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
                          setGuestInfo({
                            ...guestInfo,
                            location: e.target.value,
                          })
                        }
                        placeholder="City, Province"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleGuestInfoSubmit}
                      size="lg"
                      className="gap-2"
                    >
                      Continue
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Appointment Details */}
            {currentStep === 3 && (
              <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
                <div className="p-6 border-b border-border/40">
                  <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Appointment Details
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tell us about your needs so we can match you with the right
                    professional
                  </p>
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
                    <Label>Preferred Appointment Type</Label>
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
                    <Label htmlFor="issueType">
                      What brings you here? *
                      {medicalProfile?.primaryIssue && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (Pre-filled from your profile)
                        </span>
                      )}
                    </Label>
                    <Select value={issueType} onValueChange={setIssueType}>
                      <SelectTrigger id="issueType">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Anxiety">Anxiety</SelectItem>
                        <SelectItem value="Depression">Depression</SelectItem>
                        <SelectItem value="Stress">
                          Stress Management
                        </SelectItem>
                        <SelectItem value="Relationships">
                          Relationship Issues
                        </SelectItem>
                        <SelectItem value="Trauma">Trauma</SelectItem>
                        <SelectItem value="Self-Esteem">Self-Esteem</SelectItem>
                        <SelectItem value="Career">
                          Career Counseling
                        </SelectItem>
                        <SelectItem value="Family">Family Issues</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preferred Availability */}
                  <div className="space-y-2">
                    <Label>
                      Preferred Availability
                      {medicalProfile?.availability &&
                        medicalProfile.availability.length > 0 && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (Pre-filled from your profile)
                          </span>
                        )}
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        "Weekday Mornings",
                        "Weekday Afternoons",
                        "Weekday Evenings",
                        "Weekends",
                      ].map((option) => (
                        <Button
                          key={option}
                          type="button"
                          variant={
                            preferredAvailability.includes(option)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            if (preferredAvailability.includes(option)) {
                              setPreferredAvailability(
                                preferredAvailability.filter(
                                  (a) => a !== option,
                                ),
                              );
                            } else {
                              setPreferredAvailability([
                                ...preferredAvailability,
                                option,
                              ]);
                            }
                          }}
                          className="text-xs"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Select all time slots that work for you
                    </p>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label>Additional Notes (Optional)</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tell us more about what you'd like to discuss, any preferences for your therapist, or anything else you think would be helpful..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentStep(isGuest ? 2 : 1);
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      disabled={!issueType}
                    >
                      Review Request
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
                <div className="p-6 border-b border-border/40">
                  <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Review Your Request
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please review your information before submitting
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Summary */}
                  <div className="space-y-4 bg-muted/30 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Booking For
                        </p>
                        <p className="font-medium capitalize">
                          {bookingFor === "loved-one"
                            ? "Loved One"
                            : bookingFor}
                        </p>
                      </div>
                      {isGuest && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Contact
                          </p>
                          <p className="font-medium">
                            {guestInfo.firstName} {guestInfo.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {guestInfo.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {guestInfo.phone}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Session Type
                        </p>
                        <p className="font-medium capitalize">
                          {therapyType} Session
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Appointment Type
                        </p>
                        <div className="flex items-center gap-2">
                          {selectedType === "video" && (
                            <Video className="h-4 w-4" />
                          )}
                          {selectedType === "in-person" && (
                            <MapPin className="h-4 w-4" />
                          )}
                          {selectedType === "phone" && (
                            <Phone className="h-4 w-4" />
                          )}
                          <span className="font-medium capitalize">
                            {selectedType}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Topic
                        </p>
                        <p className="font-medium">{issueType}</p>
                      </div>
                      {preferredAvailability.length > 0 && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">
                            Preferred Availability
                          </p>
                          <p className="font-medium">
                            {preferredAvailability.join(", ")}
                          </p>
                        </div>
                      )}
                      {notes && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">
                            Additional Notes
                          </p>
                          <p className="text-sm">{notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info about what happens next */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 p-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">
                          What happens next?
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          After you submit, a qualified professional will review
                          your request and contact you via{" "}
                          {isGuest ? "email or phone" : "your account"} to
                          schedule your appointment at a time that works for
                          both of you.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(3)}>
                      Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Success */}
            {currentStep === 5 && (
              <div className="max-w-2xl mx-auto text-center">
                <div className="rounded-xl bg-card border border-border/40 p-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-light text-foreground mb-2">
                    Request Submitted!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Your appointment request has been submitted successfully. A
                    qualified professional will review your request and contact
                    you soon to schedule your session.
                  </p>

                  <div className="space-y-4 text-left bg-muted/30 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Session Type
                        </p>
                        <p className="font-medium text-foreground capitalize">
                          {therapyType} {selectedType} Session
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border/40 pt-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Topic</p>
                          <p className="font-medium text-foreground">
                            {issueType}
                          </p>
                        </div>
                      </div>
                    </div>
                    {isGuest && (
                      <div className="border-t border-border/40 pt-4">
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              We&apos;ll contact you at
                            </p>
                            <p className="font-medium text-foreground">
                              {guestInfo.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {guestInfo.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 p-4 mb-6">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>What happens next?</strong>
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      A professional will review your request and reach out to
                      schedule your appointment. You&apos;ll receive a
                      confirmation once your session is booked.
                    </p>
                  </div>

                  {isGuest ? (
                    <Button
                      variant="outline"
                      onClick={() => router.push("/")}
                      className="gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Return to Home
                    </Button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() =>
                          router.push("/client/dashboard/appointments")
                        }
                        className="gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        View My Requests
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
      </div>
    </div>
  );
}
