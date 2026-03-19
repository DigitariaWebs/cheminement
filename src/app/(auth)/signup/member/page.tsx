"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { authAPI } from "@/lib/api-client";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Heart,
  Brain,
  Activity,
  Target,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AuthContainer,
  AuthHeader,
  AuthCard,
  AuthFooter,
} from "@/components/auth";
import { MotifSearch } from "@/components/ui/MotifSearch";

interface FormData {
  // User fields
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  language: string;
  location: string;

  // Compte pour moi ou pour mon enfant
  accountFor: string;
  childFirstName: string;
  childLastName: string;
  childDateOfBirth: string;
  childServiceType: string; // "evaluation" | "suivi"

  // Medical Profile - Personal Information
  concernedPerson: string;

  // Health Background
  medicalConditions: string[];
  currentMedications: string[];
  substanceUse: string;
  consultationMotifs: string[]; // motifs de consultation (max 10)

  // Mental Health History
  previousTherapy: string;
  previousTherapyDetails: string;
  psychiatricHospitalization: string;
  currentTreatment: string;
  diagnosedConditions: string[];

  // Current Concerns
  primaryIssue: string;
  secondaryIssues: string[];
  issueDescription: string;
  severity: string;
  duration: string;
  triggeringSituation: string;

  // Symptoms & Impact
  symptoms: string[];
  dailyLifeImpact: string;
  sleepQuality: string;
  appetiteChanges: string;

  // Goals & Treatment Preferences
  treatmentGoals: string[];
  therapyApproach: string[];
  concernsAboutTherapy: string;

  // Appointment Preferences
  availability: string[];
  modality: string;
  sessionFrequency: string;
  notes: string;

  // Emergency Information
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  crisisPlan: string;
  suicidalThoughts: string;

  // Professional Matching Preferences
  preferredGender: string;
  preferredAge: string;
  culturalConsiderations: string;

  // Mode de paiement
  paymentMethod: string;

  agreeToTerms: boolean;
}

export default function MemberSignupPage() {
  const t = useTranslations("Auth.memberSignup");
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [direction, setDirection] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    language: "",
    location: "",
    accountFor: "me",
    childFirstName: "",
    childLastName: "",
    childDateOfBirth: "",
    childServiceType: "",
    concernedPerson: "",
    medicalConditions: [],
    currentMedications: [],
    substanceUse: "",
    consultationMotifs: [],
    previousTherapy: "",
    previousTherapyDetails: "",
    psychiatricHospitalization: "",
    currentTreatment: "",
    diagnosedConditions: [],
    primaryIssue: "",
    secondaryIssues: [],
    issueDescription: "",
    severity: "",
    duration: "",
    triggeringSituation: "",
    symptoms: [],
    dailyLifeImpact: "",
    sleepQuality: "",
    appetiteChanges: "",
    treatmentGoals: [],
    therapyApproach: [],
    concernsAboutTherapy: "",
    availability: [],
    modality: "",
    sessionFrequency: "",
    notes: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    crisisPlan: "",
    suicidalThoughts: "",
    preferredGender: "",
    preferredAge: "",
    culturalConsiderations: "",
    paymentMethod: "",
    agreeToTerms: false,
  });

  const sections = [
    { title: t("sections.basicInfo"), icon: UserCircle, required: true },
    { title: t("sections.healthBackground"), icon: Heart, required: true },
    { title: t("sections.mentalHealth"), icon: Brain, required: true },
    { title: t("sections.currentConcerns"), icon: Activity, required: true },
    { title: t("sections.symptomsImpact"), icon: Activity, required: true },
    { title: t("sections.goalsPreferences"), icon: Target, required: true },
    { title: t("sections.appointmentPrefs"), icon: Clock, required: true },
    { title: t("sections.emergencyContact"), icon: AlertTriangle, required: true },
    { title: t("sections.professionalPrefs"), icon: Users, required: true },
    { title: t("sections.paymentMethod"), icon: CreditCard, required: true },
    { title: t("sections.reviewConfirm"), icon: CheckCircle2, required: true },
  ];

  const isChildEvaluation = formData.accountFor === "child" && formData.childServiceType === "evaluation";
  const stepIndices = isChildEvaluation ? [0, 1, 2, 3, 4, 6, 7, 8, 9, 10] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const actualSection = stepIndices[currentSection];
  const totalSteps = stepIndices.length;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => {
      const currentArray = prev[name] as string[];

      // Special handling for "None" option
      if (value === "None") {
        // If "None" is clicked, clear all other selections
        if (currentArray.includes("None")) {
          return { ...prev, [name]: [] };
        } else {
          return { ...prev, [name]: ["None"] };
        }
      } else {
        // If any other option is clicked, remove "None" if it exists
        const withoutNone = currentArray.filter((item) => item !== "None");
        const newArray = withoutNone.includes(value)
          ? withoutNone.filter((item) => item !== value)
          : [...withoutNone, value];
        return { ...prev, [name]: newArray };
      }
    });
  };

  const validatePassword = (pwd: string): { ok: boolean; message?: string } => {
    if (!pwd || pwd.length < 8) return { ok: false, message: t("errors.passwordMinLength") };
    if (!/[A-Z]/.test(pwd)) return { ok: false, message: t("errors.passwordUppercase") };
    if (!/[a-z]/.test(pwd)) return { ok: false, message: t("errors.passwordLowercase") };
    if (!/[0-9]/.test(pwd)) return { ok: false, message: t("errors.passwordDigit") };
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) return { ok: false, message: t("errors.passwordSymbol") };
    return { ok: true };
  };

  const validateSection = (section: number): boolean => {
    switch (section) {
      case 0: // Basic Information
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          setError(t("errors.firstNameLastNameRequired"));
          return false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError(t("errors.validEmailRequired"));
          return false;
        }
        const pwdCheck = validatePassword(formData.password);
        if (!pwdCheck.ok) {
          setError(pwdCheck.message ?? "");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError(t("errors.passwordsDoNotMatch"));
          return false;
        }
        if (!formData.language) {
          setError(t("errors.languageRequired"));
          return false;
        }
        if (formData.accountFor === "child") {
          if (!formData.childFirstName.trim() || !formData.childLastName.trim()) {
            setError(t("errors.childNameRequired"));
            return false;
          }
          if (!formData.childDateOfBirth) {
            setError(t("errors.childDobRequired"));
            return false;
          }
          if (!formData.childServiceType) {
            setError(t("errors.childServiceTypeRequired"));
            return false;
          }
        }
        return true;
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return true;
      case 7:
        return true;
      case 8:
        if (!formData.preferredGender) {
          setError(t("errors.errorPreferredGender"));
          return false;
        }
        return true;
      case 9: // Payment
        if (!formData.paymentMethod) {
          setError(t("errors.paymentMethodRequired"));
          return false;
        }
        return true;
      case 10: // Review & Confirm
        if (!formData.agreeToTerms) {
          setError(t("errors.agreeToTermsRequired"));
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    setError("");
    if (validateSection(actualSection)) {
      setDirection(1);
      setCurrentSection((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handleBack = () => {
    setError("");
    setDirection(-1);
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setError("");
    if (!validateSection(currentSection)) return;

    setIsLoading(true);

    try {
      await authAPI.signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "client",
        phone: formData.phone || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        language: formData.language || undefined,
        location: formData.location || undefined,
        accountFor: formData.accountFor || undefined,
        childFirstName: formData.childFirstName || undefined,
        childLastName: formData.childLastName || undefined,
        childDateOfBirth: formData.childDateOfBirth || undefined,
        childServiceType: formData.childServiceType || undefined,
        concernedPerson: formData.concernedPerson || undefined,
        medicalConditions:
          formData.medicalConditions.length > 0
            ? formData.medicalConditions
            : undefined,
        currentMedications:
          formData.currentMedications.length > 0
            ? formData.currentMedications
            : undefined,
        consultationMotifs:
          formData.consultationMotifs.length > 0
            ? formData.consultationMotifs
            : undefined,
        substanceUse: formData.substanceUse || undefined,
        previousTherapy: formData.previousTherapy
          ? formData.previousTherapy === "yes"
          : undefined,
        previousTherapyDetails: formData.previousTherapyDetails || undefined,
        psychiatricHospitalization: formData.psychiatricHospitalization
          ? formData.psychiatricHospitalization === "yes"
          : undefined,
        currentTreatment: formData.currentTreatment || undefined,
        diagnosedConditions:
          formData.diagnosedConditions.length > 0
            ? formData.diagnosedConditions
            : undefined,
        primaryIssue: formData.primaryIssue || undefined,
        secondaryIssues:
          formData.secondaryIssues.length > 0
            ? formData.secondaryIssues
            : undefined,
        issueDescription: formData.issueDescription || undefined,
        severity: formData.severity || undefined,
        duration: formData.duration || undefined,
        triggeringSituation: formData.triggeringSituation || undefined,
        symptoms: formData.symptoms.length > 0 ? formData.symptoms : undefined,
        dailyLifeImpact: formData.dailyLifeImpact || undefined,
        sleepQuality: formData.sleepQuality || undefined,
        appetiteChanges: formData.appetiteChanges || undefined,
        treatmentGoals:
          formData.treatmentGoals.length > 0
            ? formData.treatmentGoals
            : undefined,
        therapyApproach:
          formData.therapyApproach.length > 0
            ? formData.therapyApproach
            : undefined,
        concernsAboutTherapy: formData.concernsAboutTherapy || undefined,
        availability:
          formData.availability.length > 0 ? formData.availability : undefined,
        modality: formData.modality || undefined,
        sessionFrequency: formData.sessionFrequency || undefined,
        notes: formData.notes || undefined,
        emergencyContactName: formData.emergencyContactName || undefined,
        emergencyContactPhone: formData.emergencyContactPhone || undefined,
        emergencyContactRelation:
          formData.emergencyContactRelation || undefined,
        crisisPlan: formData.crisisPlan || undefined,
        suicidalThoughts: formData.suicidalThoughts
          ? formData.suicidalThoughts === "yes"
          : undefined,
        preferredGender: formData.preferredGender || undefined,
        preferredAge: formData.preferredAge || undefined,
        // Aligne le jumelage avec la langue choisie à l’étape 1 (infos de base)
        languagePreference: formData.language || undefined,
        culturalConsiderations: formData.culturalConsiderations || undefined,
        paymentMethod: formData.paymentMethod || undefined,
      });

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("errors.accountCreatedButSignInFailed"));
        router.push("/login");
      } else {
        router.push("/client/dashboard");
      }
    } catch {
      setError(t("errors.failedToCreateAccount"));
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const renderSection = (sectionIndex: number) => {
    switch (sectionIndex) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {t("firstName")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t("firstNamePlaceholder")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2">
                  {t("lastName")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={t("lastNamePlaceholder")}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {t("email")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("emailPlaceholder")}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {t("phone")}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("phonePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {t("dateOfBirth")}
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender">{t("gender")}</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => handleSelectChange("gender", val)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder={t("selectGender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("male")}</SelectItem>
                    <SelectItem value="female">{t("female")}</SelectItem>
                    <SelectItem value="other">{t("other")}</SelectItem>
                    <SelectItem value="preferNotToSay">
                      {t("preferNotToSay")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {t("preferredLanguage")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(val) => handleSelectChange("language", val)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder={t("selectLanguagePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="french">{t("french")}</SelectItem>
                    <SelectItem value="english">{t("english")}</SelectItem>
                    <SelectItem value="arabic">{t("arabic")}</SelectItem>
                    <SelectItem value="spanish">{t("spanish")}</SelectItem>
                    <SelectItem value="mandarin">{t("mandarin")}</SelectItem>
                    <SelectItem value="other">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("accountFor")}</Label>
              <Select
                value={formData.accountFor}
                onValueChange={(val) => handleSelectChange("accountFor", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`${t("accountForMe")} / ${t("accountForChild")}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="me">{t("accountForMe")}</SelectItem>
                  <SelectItem value="child">{t("accountForChild")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.accountFor === "child" && (
              <div className="space-y-4 rounded-lg border border-border/50 p-4 bg-muted/20">
                <p className="text-sm font-medium text-foreground">{t("childInfoTitle")}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="childFirstName">{t("childFirstName")} <span className="text-red-500">*</span></Label>
                    <Input
                      id="childFirstName"
                      name="childFirstName"
                      value={formData.childFirstName}
                      onChange={handleChange}
                      placeholder="Prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="childLastName">{t("childLastName")} <span className="text-red-500">*</span></Label>
                    <Input
                      id="childLastName"
                      name="childLastName"
                      value={formData.childLastName}
                      onChange={handleChange}
                      placeholder="Nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="childDateOfBirth">{t("childDateOfBirth")} <span className="text-red-500">*</span></Label>
                    <Input
                      id="childDateOfBirth"
                      name="childDateOfBirth"
                      type="date"
                      value={formData.childDateOfBirth}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("childServiceTypeQuestion")} <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.childServiceType}
                    onValueChange={(val) => handleSelectChange("childServiceType", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evaluation">{t("evaluation")}</SelectItem>
                      <SelectItem value="suivi">{t("psychologicalFollowUp")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {t("location")} / {t("postalCode")}
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={`${t("locationPlaceholder")} ou ${t("postalCodePlaceholder")}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                {t("password")} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("passwordPlaceholder")}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("passwordHintSecure")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("confirmPassword")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t("passwordPlaceholder")}
                required
              />
            </div>
          </div>
        );

      case 1: // Health Background
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="concernedPerson">
                {t("profileModal.step1.concernedPerson")}
              </Label>
              <Select
                value={formData.concernedPerson}
                onValueChange={(val) =>
                  handleSelectChange("concernedPerson", val)
                }
              >
                <SelectTrigger id="concernedPerson">
                  <SelectValue placeholder={t("select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="myself">{t("accountForMe")}</SelectItem>
                  <SelectItem value="child">{t("accountForChild")}</SelectItem>
                  <SelectItem value="partner">{t("spouse")}</SelectItem>
                  <SelectItem value="parent">{t("parent")}</SelectItem>
                  <SelectItem value="other">{t("other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("profileModal.step1.medicalConditions")}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Diabetes",
                  "Hypertension",
                  "Heart Disease",
                  "Asthma",
                  "Thyroid Disorder",
                  "Chronic Pain",
                  "None",
                ].map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={`condition-${condition}`}
                      checked={formData.medicalConditions.includes(condition)}
                      onCheckedChange={() =>
                        handleArrayChange("medicalConditions", condition)
                      }
                    />
                    <label
                      htmlFor={`condition-${condition}`}
                      className="text-sm cursor-pointer"
                    >
                      {condition}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("profileModal.step1.currentMedications")}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Antidepressants",
                  "Anti-anxiety",
                  "Mood stabilizers",
                  "Antipsychotics",
                  "Sleep aids",
                  "Pain medication",
                  "None",
                ].map((med) => (
                  <div key={med} className="flex items-center space-x-2">
                    <Checkbox
                      id={`med-${med}`}
                      checked={formData.currentMedications.includes(med)}
                      onCheckedChange={() =>
                        handleArrayChange("currentMedications", med)
                      }
                    />
                    <label
                      htmlFor={`med-${med}`}
                      className="text-sm cursor-pointer"
                    >
                      {med}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                {t("consultationMotifsLabel")}
              </Label>
              <MotifSearch
                value={formData.consultationMotifs}
                onChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    consultationMotifs: Array.isArray(v) ? v : v ? [v] : [],
                  }))
                }
                multiSelect
                maxSelections={10}
                placeholder={t("consultationMotifsPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="substanceUse">{t("profileModal.step1.substanceUse")}</Label>
              <Textarea
                id="substanceUse"
                name="substanceUse"
                value={formData.substanceUse}
                onChange={handleChange}
                placeholder={t("profileModal.step1.substanceUsePlaceholder")}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        );

      case 2: // Mental Health History
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="previousTherapy">
                {t("profileModal.step2.previousTherapy")}
              </Label>
              <Select
                value={formData.previousTherapy}
                onValueChange={(val) =>
                  handleSelectChange("previousTherapy", val)
                }
              >
                <SelectTrigger id="previousTherapy">
                  <SelectValue placeholder={t("select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">{t("profile.yes")}</SelectItem>
                  <SelectItem value="no">{t("profile.no")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.previousTherapy === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="previousTherapyDetails">
                  {t("profileModal.step2.previousTherapyDetails")}
                </Label>
                <Textarea
                  id="previousTherapyDetails"
                  name="previousTherapyDetails"
                  value={formData.previousTherapyDetails}
                  onChange={handleChange}
                  placeholder={t("profileModal.step2.previousTherapyDetailsPlaceholder")}
                  className="min-h-[100px] resize-none"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="psychiatricHospitalization">
                {t("profileModal.step2.psychiatricHospitalization")}
              </Label>
              <Select
                value={formData.psychiatricHospitalization}
                onValueChange={(val) =>
                  handleSelectChange("psychiatricHospitalization", val)
                }
              >
                <SelectTrigger id="psychiatricHospitalization">
                  <SelectValue placeholder={t("select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">{t("profile.yes")}</SelectItem>
                  <SelectItem value="no">{t("profile.no")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentTreatment">{t("profileModal.step2.currentTreatment")}</Label>
              <Textarea
                id="currentTreatment"
                name="currentTreatment"
                value={formData.currentTreatment}
                onChange={handleChange}
                placeholder={t("profileModal.step2.currentTreatmentPlaceholder")}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("profileModal.step2.diagnosedConditions")}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {(() => {
                  // Calculate age from dateOfBirth
                  const calculateAge = (dateOfBirth: string): number | null => {
                    if (!dateOfBirth) return null;
                    const birthDate = new Date(dateOfBirth);
                    if (isNaN(birthDate.getTime())) return null;
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                      age--;
                    }
                    return age;
                  };

                  const age = calculateAge(formData.dateOfBirth);
                  const isChild = age !== null && age < 18;

                  // Child diagnosed conditions list
                  const childDiagnosedConditions = [
                    "Trouble du langage",
                    "Handicaps intellectuels",
                    "Trouble du spectre de l'autisme (TSA)",
                    "Trouble de l'acquisition de la coordination",
                    "Tics",
                    "Syndrome de la Tourette",
                    "TDAH",
                    "Dyslexie",
                    "Dysorthographie",
                    "Dyscalculie",
                    "Trouble de la communication sociale (pragmatique)",
                    "Douance",
                    "Trouble de dérèglement disruptif de l'humeur",
                    "Trouble de l'opposition",
                    "Trouble grave du comportement",
                    "Trouble d'anxiété de séparation",
                    "Mutisme sélectif",
                    "Phobie spécifique (animaux, environnement naturel, sang/injection, situationnel)",
                    "Trouble d'anxiété sociale (Phobie sociale)",
                    "Trouble panique (avec ou sans agoraphobie)",
                    "Agoraphobie",
                    "Trouble d'anxiété généralisée (TAG)",
                    "Trichotillomanie (arrachage des cheveux)",
                    "Dermatillomanie (triturage répété de la peau)",
                    "Trouble réactionnel de l'attachement",
                    "Trouble de stress post-traumatique (TSPT)",
                    "Trouble de stress aigu (immédiatement après le choc)",
                    "Troubles de l'adaptation (avec humeur dépressive et/ou anxieuse)",
                    "Pica (ingestion de substances non comestibles)",
                    "Anorexie mentale (type restrictif ou avec accès hyperphagiques/purgations)",
                    "Boulimie",
                    "Accès hyperphagiques",
                    "Encoprésie",
                    "Énurésie",
                    "Attachement",
                  ];

                  // Adult diagnosed conditions list
                  const adultDiagnosedConditions = [
                    "Trouble de la personnalité",
                    "Trouble délirant",
                    "Trouble psychotique bref (moins d'un mois)",
                    "Schizophrénie",
                    "Trouble schizo-affectif",
                    "Trouble bipolaire",
                    "Trouble dépressif majeur (épisode unique ou récurrent)",
                    "Trouble dépressif persistant (Dysthymie)",
                    "Trouble dysphorique prémenstruel",
                    "Trouble de deuil prolongé",
                    "Trouble d'anxiété généralisée (TAG)",
                    "Trouble d'anxiété sociale (Phobie sociale)",
                    "Trouble panique (avec ou sans agoraphobie)",
                    "Agoraphobie",
                    "Trouble d'adaptation avec humeur anxiodépressive",
                    "TOC (avec obsessions de propreté, de vérification, de symétrie, etc.)",
                    "Obsession d'une dysmorphie corporelle (peur d'une imperfection physique)",
                    "Thésaurisation pathologique (accumulation)",
                    "Trouble de stress post-traumatique (TSPT)",
                    "Trouble de stress aigu (immédiatement après le choc)",
                    "Troubles de l'adaptation (avec humeur dépressive et/ou anxieuse)",
                    "Pica (ingestion de substances non comestibles)",
                    "Anorexie mentale (type restrictif ou avec accès hyperphagiques/purgations)",
                    "Boulimie",
                    "Accès hyperphagiques",
                    "Troubles liés à l'usage (alcool, cannabis, hallucinogènes, opioïdes, sédatifs, stimulants, Tabac…)",
                    "Jeu d'argent pathologique",
                    "Maladie d'Alzheimer",
                    "Maladie de Parkinson",
                    "Douance",
                    "TSA",
                    "TDAH",
                    "Traumatisme crânien (TCC)",
                    "AVC (Accident Vasculaire Cérébral) aphasies/héminégligences",
                    "Tumeurs cérébrales",
                  ];

                  const conditionsList = isChild ? childDiagnosedConditions : adultDiagnosedConditions;

                  return conditionsList.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={`diagnosed-${condition}`}
                        checked={formData.diagnosedConditions.includes(condition)}
                        onCheckedChange={() =>
                          handleArrayChange("diagnosedConditions", condition)
                        }
                      />
                      <label
                        htmlFor={`diagnosed-${condition}`}
                        className="text-sm cursor-pointer"
                      >
                        {condition}
                      </label>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        );

      case 3: // Current Concerns
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="primaryIssue">{t("profileModal.step3.primaryIssue")}</Label>
              <Textarea
                id="primaryIssue"
                name="primaryIssue"
                value={formData.primaryIssue}
                onChange={handleChange}
                placeholder={t("profileModal.step3.primaryIssuePlaceholder")}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("profileModal.step3.secondaryIssues")}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Stress",
                  "Relationships",
                  "Work/School",
                  "Family",
                  "Grief",
                  "Trauma",
                  "Self-esteem",
                  "Life transitions",
                ].map((issue) => (
                  <div key={issue} className="flex items-center space-x-2">
                    <Checkbox
                      id={`issue-${issue}`}
                      checked={formData.secondaryIssues.includes(issue)}
                      onCheckedChange={() =>
                        handleArrayChange("secondaryIssues", issue)
                      }
                    />
                    <label
                      htmlFor={`issue-${issue}`}
                      className="text-sm cursor-pointer"
                    >
                      {issue}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueDescription">{t("profileModal.step3.issueDescription")}</Label>
              <Textarea
                id="issueDescription"
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                placeholder={t("profileModal.step3.issueDescriptionPlaceholder")}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="severity">{t("profileModal.step3.severity")}</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(val) => handleSelectChange("severity", val)}
                >
                  <SelectTrigger id="severity">
                    <SelectValue placeholder={t("profileModal.step3.severityPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">{t("profile.issueDetails.mild")}</SelectItem>
                    <SelectItem value="moderate">{t("profile.issueDetails.moderate")}</SelectItem>
                    <SelectItem value="severe">{t("profile.issueDetails.severe")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">{t("profileModal.step3.duration")}</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(val) => handleSelectChange("duration", val)}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder={t("profileModal.step3.durationPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lessThanMonth">
                      {t("profile.issueDetails.lessThanMonth")}
                    </SelectItem>
                    <SelectItem value="oneToThree">{t("profile.issueDetails.oneToThree")}</SelectItem>
                    <SelectItem value="threeToSix">{t("profile.issueDetails.threeToSix")}</SelectItem>
                    <SelectItem value="moreThanSix">
                      {t("profile.issueDetails.moreThanSix")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="triggeringSituation">{t("profileModal.step3.triggeringSituation")}</Label>
              <Textarea
                id="triggeringSituation"
                name="triggeringSituation"
                value={formData.triggeringSituation}
                onChange={handleChange}
                placeholder={t("profileModal.step3.triggeringSituationPlaceholder")}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        );

      case 4: // Symptoms & Impact
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>{t("profileModal.step4.symptoms")}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Sadness",
                  "Worry",
                  "Panic attacks",
                  "Mood swings",
                  "Irritability",
                  "Fatigue",
                  "Concentration issues",
                  "Memory problems",
                  "Nightmares",
                  "Flashbacks",
                ].map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={`symptom-${symptom}`}
                      checked={formData.symptoms.includes(symptom)}
                      onCheckedChange={() =>
                        handleArrayChange("symptoms", symptom)
                      }
                    />
                    <label
                      htmlFor={`symptom-${symptom}`}
                      className="text-sm cursor-pointer"
                    >
                      {symptom}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyLifeImpact">{t("profileModal.step4.dailyLifeImpact")}</Label>
              <Textarea
                id="dailyLifeImpact"
                name="dailyLifeImpact"
                value={formData.dailyLifeImpact}
                onChange={handleChange}
                placeholder={t("profileModal.step4.dailyLifeImpactPlaceholder")}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sleepQuality">{t("profileModal.step4.sleepQuality")}</Label>
                <Select
                  value={formData.sleepQuality}
                  onValueChange={(val) =>
                    handleSelectChange("sleepQuality", val)
                  }
                >
                  <SelectTrigger id="sleepQuality">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">{t("profileModal.step4.sleepQualityOptions.normal")}</SelectItem>
                    <SelectItem value="poor">{t("profileModal.step4.sleepQualityOptions.poor")}</SelectItem>
                    <SelectItem value="insomnia">{t("profileModal.step4.sleepQualityOptions.insomnia")}</SelectItem>
                    <SelectItem value="excessive">
                      {t("profileModal.step4.sleepQualityOptions.excessive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appetiteChanges">{t("profileModal.step4.appetiteChanges")}</Label>
                <Input
                  id="appetiteChanges"
                  name="appetiteChanges"
                  value={formData.appetiteChanges}
                  onChange={handleChange}
                  placeholder={t("profileModal.step4.appetiteChangesPlaceholder")}
                />
              </div>
            </div>
          </div>
        );

      case 5: // Treatment Goals (skipped when child + evaluation)
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>{t("objectivesLabel")}</Label>
              <MotifSearch
                value={formData.treatmentGoals}
                onChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    treatmentGoals: Array.isArray(v) ? v : v ? [v] : [],
                  }))
                }
                multiSelect
                maxSelections={10}
                placeholder={t("objectivesPlaceholder")}
                items={t.raw("therapyObjectives") as string[]}
              />
            </div>

            <div className="space-y-2">
              <Label>Approche de thérapie préférée (optionnel)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "CBT",
                  "Psychodynamic",
                  "Mindfulness",
                  "Solution-focused",
                  "Family therapy",
                  "Group therapy",
                  "Art therapy",
                  "No preference",
                ].map((approach) => (
                  <div key={approach} className="flex items-center space-x-2">
                    <Checkbox
                      id={`approach-${approach}`}
                      checked={formData.therapyApproach.includes(approach)}
                      onCheckedChange={() =>
                        handleArrayChange("therapyApproach", approach)
                      }
                    />
                    <label
                      htmlFor={`approach-${approach}`}
                      className="text-sm cursor-pointer"
                    >
                      {approach}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concernsAboutTherapy">
                {t("profileModal.step5.concernsAboutTherapy")}
              </Label>
              <Textarea
                id="concernsAboutTherapy"
                name="concernsAboutTherapy"
                value={formData.concernsAboutTherapy}
                onChange={handleChange}
                placeholder={t("profileModal.step5.concernsAboutTherapyPlaceholder")}
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>
        );

      case 6: // Appointment Preferences
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>
                {t("profileModal.step6.availability")}
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Weekday mornings",
                  "Weekday afternoons",
                  "Weekday evenings",
                  "Weekend mornings",
                  "Weekend afternoons",
                  "Weekend evenings",
                  "Flexible",
                ].map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${time}`}
                      checked={formData.availability.includes(time)}
                      onCheckedChange={() =>
                        handleArrayChange("availability", time)
                      }
                    />
                    <label
                      htmlFor={`availability-${time}`}
                      className="text-sm cursor-pointer"
                    >
                      {time}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="modality">{t("profileModal.step6.modality")}</Label>
                <Select
                  value={formData.modality}
                  onValueChange={(val) => handleSelectChange("modality", val)}
                >
                  <SelectTrigger id="modality">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">{t("profile.preferences.online")}</SelectItem>
                    <SelectItem value="inPerson">{t("profile.preferences.inPerson")}</SelectItem>
                    <SelectItem value="both">
                      {t("profile.preferences.both")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionFrequency">
                  {t("profileModal.step6.sessionFrequency")}
                </Label>
                <Select
                  value={formData.sessionFrequency}
                  onValueChange={(val) =>
                    handleSelectChange("sessionFrequency", val)
                  }
                >
                  <SelectTrigger id="sessionFrequency">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">{t("profileModal.step6.sessionFrequencyOptions.weekly")}</SelectItem>
                    <SelectItem value="biweekly">{t("profileModal.step6.sessionFrequencyOptions.biweekly")}</SelectItem>
                    <SelectItem value="monthly">{t("profileModal.step6.sessionFrequencyOptions.monthly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("profileModal.step6.notes")}</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder={t("profileModal.step6.notesPlaceholder")}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        );

      case 7: // Emergency Contact
        return (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {t("profileModal.step7.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">
                  {t("profileModal.step7.emergencyContactName")}
                </Label>
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  placeholder={t("profileModal.step7.emergencyContactNamePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">
                  {t("profileModal.step7.emergencyContactPhone")}
                </Label>
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder={t("profileModal.step7.emergencyContactPhonePlaceholder")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelation">
                {t("profileModal.step7.emergencyContactRelation")}
              </Label>
              <Input
                id="emergencyContactRelation"
                name="emergencyContactRelation"
                value={formData.emergencyContactRelation}
                onChange={handleChange}
                placeholder={t("profileModal.step7.emergencyContactRelationPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crisisPlan">{t("profileModal.step7.crisisPlan")}</Label>
              <Textarea
                id="crisisPlan"
                name="crisisPlan"
                value={formData.crisisPlan}
                onChange={handleChange}
                placeholder={t("profileModal.step7.crisisPlanPlaceholder")}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suicidalThoughts">
                {t("profileModal.step7.suicidalThoughts")}
              </Label>
              <Select
                value={formData.suicidalThoughts}
                onValueChange={(val) =>
                  handleSelectChange("suicidalThoughts", val)
                }
              >
                <SelectTrigger id="suicidalThoughts">
                  <SelectValue placeholder={t("select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">{t("profile.no")}</SelectItem>
                  <SelectItem value="yes">{t("profile.yes")}</SelectItem>
                </SelectContent>
              </Select>
              {formData.suicidalThoughts === "yes" && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900 mt-4">
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
                    {t("profileModal.step7.crisisHotlinesTitle")}
                  </p>
                  <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                    <li>• Canada Suicide Prevention: 1-833-456-4566</li>
                    <li>• Quebec Suicide Prevention: 1-866-277-3553</li>
                    <li>• Crisis Text Line: Text &quot;HOME&quot; to 686868</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      case 8: // Professional Preferences
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>{t("preferredProfessionalLabel")}</Label>
            </div>
            <div className="space-y-2">
              <Select
                value={formData.preferredGender}
                onValueChange={(val) =>
                  handleSelectChange("preferredGender", val)
                }
              >
                <SelectTrigger id="preferredGender">
                  <SelectValue
                    placeholder={t("profileModal.step8.preferredGenderPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noPreference">{t("noPreference")}</SelectItem>
                  <SelectItem value="male">{t("preferredProfessionalMale")}</SelectItem>
                  <SelectItem value="female">{t("preferredProfessionalFemale")}</SelectItem>
                  <SelectItem value="other">{t("preferredProfessionalOther")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferredAge">
                  {t("profileModal.step8.preferredAge")}
                </Label>
                <Select
                  value={formData.preferredAge}
                  onValueChange={(val) =>
                    handleSelectChange("preferredAge", val)
                  }
                >
                  <SelectTrigger id="preferredAge">
                    <SelectValue
                      placeholder={t("profileModal.step8.preferredAgePlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t("profile.matching.any")}</SelectItem>
                    <SelectItem value="younger">{t("profile.matching.younger")}</SelectItem>
                    <SelectItem value="middle">{t("profile.matching.middle")}</SelectItem>
                    <SelectItem value="older">{t("profile.matching.older")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="culturalConsiderations">
                {t("profileModal.step8.culturalConsiderations")}
              </Label>
              <Textarea
                id="culturalConsiderations"
                name="culturalConsiderations"
                value={formData.culturalConsiderations}
                onChange={handleChange}
                placeholder={t("profileModal.step8.culturalConsiderationsPlaceholder")}
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>
        );

      case 9: // Mode de paiement
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              {t("paymentStepDescription")}
            </p>
            <div className="space-y-3">
              {[
                { value: "credit_card", label: t("paymentCreditCard") },
                { value: "interac", label: t("paymentInterac") },
                { value: "bank_withdrawal", label: t("paymentBankWithdrawal") },
              ].map((opt) => (
                <div
                  key={opt.value}
                  className="flex items-center space-x-3 rounded-lg border p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="radio"
                    id={`payment-${opt.value}`}
                    name="paymentMethod"
                    value={opt.value}
                    checked={formData.paymentMethod === opt.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                    className="h-4 w-4 text-primary"
                  />
                  <label
                    htmlFor={`payment-${opt.value}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 10: // Review & Confirm
        return (
          <div className="space-y-6">
            <div className="rounded-xl bg-muted/30 p-6">
              <h3 className="font-serif text-lg mb-4">
                {t("reviewInfoTitle")}
              </h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-2 pb-2 border-b">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pb-2 border-b">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                {formData.phone && (
                  <div className="grid grid-cols-2 gap-2 pb-2 border-b">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                )}
                {formData.primaryIssue && (
                  <div className="grid grid-cols-2 gap-2 pb-2 border-b">
                    <span className="text-muted-foreground">
                      Primary Concern:
                    </span>
                    <span className="font-medium">
                      {formData.primaryIssue.substring(0, 100)}
                      {formData.primaryIssue.length > 100 ? "..." : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreeToTerms: checked as boolean,
                  }))
                }
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm leading-relaxed cursor-pointer"
              >
                {t("agreeToTerms")}{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  {t("termsOfService")}
                </Link>{" "}
                {t("and")}{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  {t("privacyPolicy")}
                </Link>
                . {t("agreeToTermsSuffix")}
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const CurrentIcon = sections[actualSection].icon;

  return (
    <AuthContainer maxWidth="2xl">
      <AuthHeader
        icon={<UserCircle className="w-8 h-8 text-primary" />}
        title={t("title")}
        description={t("description")}
      />

      <AuthCard>
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CurrentIcon className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-serif text-lg">
                  {sections[actualSection].title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("stepOf", { current: currentSection + 1, total: totalSteps })}
                </p>
              </div>
            </div>
            {sections[actualSection].required && (
              <span className="text-xs text-red-500">* {t("required")}</span>
            )}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentSection + 1) / totalSteps) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Animated form sections */}
        <div className="relative overflow-hidden min-h-[500px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSection}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full"
            >
              {renderSection(actualSection)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentSection === 0}
            className="flex items-center gap-2 px-6 py-3 text-foreground font-light transition-opacity disabled:opacity-0 disabled:pointer-events-none hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t("back")}</span>
          </button>

          {currentSection < totalSteps - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="group flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-light hover:scale-105 transition-transform"
            >
              <span>{t("continue")}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !formData.agreeToTerms}
              className="group flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-light hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("creating")}</span>
                </>
              ) : (
                <>
                  <span>{t("createAccount")}</span>
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </AuthCard>

      <AuthFooter>
        <p className="text-sm text-muted-foreground font-light">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            {t("signIn")}
          </Link>
        </p>
      </AuthFooter>

      <AuthFooter>
        <Link
          href="/"
          className="text-sm text-muted-foreground font-light hover:text-foreground transition-colors"
        >
          {t("backToHome")}
        </Link>
      </AuthFooter>
    </AuthContainer>
  );
}
