"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { authAPI } from "@/lib/api-client";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
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
  GraduationCap,
  Target,
  Clock,
  DollarSign,
  CheckCircle2,
  Users,
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
import { APPROACHES_ET_THERAPIES } from "@/data/approaches";
import { CHILD_PROBLEMATICS } from "@/data/childProblematics";
import { ADULT_PROBLEMATICS } from "@/data/adultProblematics";
import { CHILD_DIAGNOSTICS } from "@/data/childDiagnostics";
import { ADULT_DIAGNOSTICS } from "@/data/adultDiagnostics";
import { PROFESSIONAL_TITLES, AGE_CATEGORIES } from "@/data/professionalTitles";

interface FormData {
  // Basic Information
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

  // Professional Profile
  specialty: string;
  license: string;
  yearsOfExperience: string;
  bio: string;

  // Education
  degree: string;
  institution: string;
  graduationYear: string;

  // Certifications
  certifications: string[];

  // Practice Details
  problematics: string[];
  approaches: string[];
  ageCategories: string[];
  diagnosedConditions: string[];
  sessionTypes: string[];
  modalities: string[];
  languages: string[];

  // Pricing
  individualSessionRate: string;
  coupleSessionRate: string;
  groupSessionRate: string;
  paymentFrequency: string;
  paymentAgreement: string;

  // Availability
  availableDays: string[];
  sessionDuration: string;
  breakDuration: string;

  agreeToTerms: boolean;
  acceptPrivacyPolicy: boolean;
}

/** Stored `value` strings are sent to the API; labels use `Auth.professionalSignup.*Options`. */
const PROFESSIONAL_SIGNUP_CERT_OPTIONS = [
  { value: "CBT Certified", msgKey: "cbtCertified" },
  { value: "DBT Certified", msgKey: "dbtCertified" },
  { value: "EMDR Certified", msgKey: "emdrCertified" },
  { value: "Family Therapy", msgKey: "familyTherapy" },
  { value: "Trauma-Informed", msgKey: "traumaInformed" },
  { value: "Substance Abuse", msgKey: "substanceAbuse" },
  { value: "Child & Adolescent", msgKey: "childAdolescent" },
  { value: "Couples Therapy", msgKey: "couplesTherapy" },
] as const;

const PROFESSIONAL_SESSION_TYPE_OPTIONS = [
  { value: "Individual", msgKey: "individual" },
  { value: "Couple", msgKey: "couple" },
  { value: "Family", msgKey: "family" },
  { value: "Group", msgKey: "group" },
  { value: "Coaching", msgKey: "coaching" },
] as const;

const PROFESSIONAL_MODALITY_OPTIONS = [
  { value: "In-Person (Office)", msgKey: "inPersonOffice" },
  { value: "Video Call", msgKey: "videoCall" },
  { value: "Phone Call", msgKey: "phoneCall" },
  { value: "Chat/Messaging", msgKey: "chatMessaging" },
] as const;

const PROFESSIONAL_WEEKDAY_OPTIONS = [
  { value: "Monday", msgKey: "monday" },
  { value: "Tuesday", msgKey: "tuesday" },
  { value: "Wednesday", msgKey: "wednesday" },
  { value: "Thursday", msgKey: "thursday" },
  { value: "Friday", msgKey: "friday" },
  { value: "Saturday", msgKey: "saturday" },
  { value: "Sunday", msgKey: "sunday" },
] as const;

export default function ProfessionalSignupPage() {
  const t = useTranslations("Auth.professionalSignup");
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
    specialty: "",
    license: "",
    yearsOfExperience: "",
    bio: "",
    degree: "",
    institution: "",
    graduationYear: "",
    certifications: [],
    problematics: [],
    approaches: [],
    ageCategories: [],
    diagnosedConditions: [],
    sessionTypes: [],
    modalities: [],
    languages: [],
    individualSessionRate: "",
    coupleSessionRate: "",
    groupSessionRate: "",
    paymentFrequency: "",
    paymentAgreement: "",
    availableDays: [],
    sessionDuration: "",
    breakDuration: "",
    agreeToTerms: false,
    acceptPrivacyPolicy: false,
  });

  const sections = [
    { title: t("sections.basicInfo"), icon: User, required: true },
    { title: t("sections.professionalDetails"), icon: Briefcase, required: true },
    { title: t("sections.education"), icon: GraduationCap, required: true },
    { title: t("sections.expertise"), icon: Target, required: false },
    { title: t("sections.sessionTypes"), icon: Users, required: false },
    { title: t("sections.pricing"), icon: DollarSign, required: false },
    { title: t("sections.availability"), icon: Clock, required: false },
    { title: t("sections.review"), icon: CheckCircle2, required: true },
  ];

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
      const currentArray = (prev[name] as string[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [name]: newArray };
    });
  };

  const validateSection = () => {
    switch (currentSection) {
      case 0: // Basic Information
        if (!formData.firstName.trim()) return t("errors.firstNameRequired");
        if (!formData.lastName.trim()) return t("errors.lastNameRequired");
        if (!formData.email.trim()) return t("errors.emailRequired");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
          return t("errors.invalidEmail");
        if (!formData.password) return t("errors.passwordRequired");
        if (formData.password.length < 8)
          return t("errors.passwordMinLength");
        if (formData.password !== formData.confirmPassword)
          return t("errors.passwordsDoNotMatch");
        {
          const digits = formData.phone.replace(/\D/g, "");
          if (digits.length < 10) return t("errors.phoneRequiredMin10");
        }
        break;
      case 1: // Professional Details (Titre professionnel + permis)
        if (!formData.specialty) return t("errors.specialtyRequired");
        if (!formData.license.trim())
          return t("errors.licenseRequired");
        break;
      case 2: // Education
        if (!formData.degree.trim()) return t("errors.degreeRequired");
        if (!formData.institution.trim()) return t("errors.institutionRequired");
        if (formData.certifications.length === 0)
          return t("errors.certificationsRequired");
        break;
      case 4: // Session types & age categories
        if (formData.ageCategories.length === 0)
          return t("errors.ageCategoryRequired");
        break;
      case 5: // Pricing
        if (!formData.paymentFrequency)
          return t("errors.paymentFrequencyRequired");
        break;
      case 7:
        if (!formData.agreeToTerms) return t("errors.agreeToTermsRequired");
        if (!formData.acceptPrivacyPolicy)
          return t("errors.acceptPrivacyPolicyRequired");
        break;
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateSection();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setDirection(1);
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const handleBack = () => {
    setError("");
    setDirection(-1);
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      setError(t("errors.agreeToTermsRequired"));
      return;
    }
    if (!formData.acceptPrivacyPolicy) {
      setError(t("errors.acceptPrivacyPolicyRequired"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const signupResult = await authAPI.signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "professional",
        agreeToTerms: formData.agreeToTerms,
        acceptPrivacyPolicy: formData.acceptPrivacyPolicy,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        language: formData.languages[0] || formData.language,
        location: formData.location,
        professionalProfile: {
          specialty: formData.specialty,
          license: formData.license,
          yearsOfExperience: formData.yearsOfExperience
            ? Number(formData.yearsOfExperience)
            : undefined,
          bio: formData.bio,
          problematics:
            formData.problematics.length > 0
              ? formData.problematics
              : undefined,
          approaches:
            formData.approaches.length > 0 ? formData.approaches : undefined,
          ageCategories:
            formData.ageCategories.length > 0
              ? formData.ageCategories
              : undefined,
          diagnosedConditions:
            formData.diagnosedConditions.length > 0
              ? formData.diagnosedConditions
              : undefined,
          sessionTypes:
            formData.sessionTypes.length > 0
              ? formData.sessionTypes
              : undefined,
          modalities:
            formData.modalities.length > 0 ? formData.modalities : undefined,
          languages:
            formData.languages.length > 0 ? formData.languages : undefined,
          certifications:
            formData.certifications.length > 0
              ? formData.certifications
              : undefined,
          paymentFrequency: formData.paymentFrequency || undefined,
          pricing: {
            individualSession: formData.individualSessionRate
              ? Number(formData.individualSessionRate)
              : undefined,
            coupleSession: formData.coupleSessionRate
              ? Number(formData.coupleSessionRate)
              : undefined,
            groupSession: formData.groupSessionRate
              ? Number(formData.groupSessionRate)
              : undefined,
          },
          education:
            formData.degree || formData.institution
              ? [
                  {
                    degree: formData.degree,
                    institution: formData.institution,
                    year: formData.graduationYear
                      ? Number(formData.graduationYear)
                      : undefined,
                  },
                ]
              : undefined,
          availability:
            formData.availableDays.length > 0 || formData.sessionDuration || formData.breakDuration
              ? {
                  sessionDurationMinutes: formData.sessionDuration
                    ? Number(formData.sessionDuration)
                    : 60,
                  breakDurationMinutes: formData.breakDuration
                    ? Number(formData.breakDuration)
                    : 15,
                  days: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => ({
                    day,
                    isWorkDay: formData.availableDays.includes(day),
                    startTime: "09:00",
                    endTime: "17:00",
                  })),
                  firstDayOfWeek: "Monday",
                }
              : undefined,
        },
      });

      if (signupResult.requiresEmailVerification) {
        router.push(
          `/verify-account?email=${encodeURIComponent(formData.email)}`,
        );
        return;
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("errors.accountCreatedButSignInFailed"));
        router.push("/login");
      } else {
        router.push("/professional/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("errors.failedToCreateAccount"),
      );
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

  const renderSection = () => {
    switch (currentSection) {
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
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {t("languagesUsed")}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: "french", labelKey: "languagesUsedOptions.french" },
                    { value: "english", labelKey: "languagesUsedOptions.english" },
                    { value: "arabic", labelKey: "languagesUsedOptions.arabic" },
                    { value: "spanish", labelKey: "languagesUsedOptions.spanish" },
                    { value: "mandarin", labelKey: "languagesUsedOptions.mandarin" },
                    { value: "other", labelKey: "languagesUsedOptions.other" },
                  ].map((lang) => (
                    <div key={lang.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-step0-${lang.value}`}
                        checked={formData.languages.includes(lang.value)}
                        onCheckedChange={() =>
                          handleArrayChange("languages", lang.value)
                        }
                      />
                      <label
                        htmlFor={`lang-step0-${lang.value}`}
                        className="text-sm cursor-pointer"
                      >
                        {t(lang.labelKey)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {t("locationLabel")}
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={t("locationPlaceholder")}
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
                {t("passwordHint")}
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

      case 1: // Professional Details (Titres professionnels)
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="specialty">
                {t("professionalTitleLabel")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.specialty}
                onValueChange={(val) => handleSelectChange("specialty", val)}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder={t("professionalTitlePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSIONAL_TITLES.map((title) => (
                    <SelectItem key={title.value} value={title.value}>
                      {title.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="license">
                {t("licenseLabel")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="license"
                name="license"
                value={formData.license}
                onChange={handleChange}
                placeholder={t("licensePlaceholder")}
              />
              <p className="text-xs text-muted-foreground">
                {t("licenseHint")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">{t("yearsOfExperience")}</Label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                {t("professionalBio")}{" "}
                <span className="text-xs text-muted-foreground">
                  {t("optional")}
                </span>
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder={t("professionalBioPlaceholder")}
                className="min-h-[120px] resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {t("bioCharacterCount", {
                  count: formData.bio.length,
                  max: 1000,
                })}
              </p>
            </div>
          </div>
        );

      case 2: // Education & Credentials
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="degree">
                {t("degree")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder={t("degreePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">
                {t("institution")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder={t("institutionPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear">{t("graduationYear")}</Label>
              <Input
                id="graduationYear"
                name="graduationYear"
                type="number"
                min="1950"
                max={new Date().getFullYear()}
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder={t("graduationYearPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("certifications")}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROFESSIONAL_SIGNUP_CERT_OPTIONS.map(({ value, msgKey }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cert-${msgKey}`}
                      checked={formData.certifications.includes(value)}
                      onCheckedChange={() =>
                        handleArrayChange("certifications", value)
                      }
                    />
                    <label
                      htmlFor={`cert-${msgKey}`}
                      className="text-sm cursor-pointer"
                    >
                      {t(`certificationOptions.${msgKey}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Expertise & Approach (Expertises & Approches)
        return (() => {
          const treatsChildren = formData.ageCategories.some(
            (c) => c === "0-12" || c === "13-17",
          );
          const treatsAdults = formData.ageCategories.some(
            (c) => c === "18-64" || c === "65+",
          );
          const problematicsList = (() => {
            let list: string[] = [];
            if (treatsChildren && treatsAdults) list = [...CHILD_PROBLEMATICS, ...ADULT_PROBLEMATICS];
            else if (treatsChildren) list = [...CHILD_PROBLEMATICS];
            else if (treatsAdults) list = [...ADULT_PROBLEMATICS];
            return [...new Set(list)].sort((a, b) => a.localeCompare(b, "fr"));
          })();
          const diagnosticsList = (() => {
            let list: string[] = [];
            if (treatsChildren && treatsAdults) list = [...CHILD_DIAGNOSTICS, ...ADULT_DIAGNOSTICS];
            else if (treatsChildren) list = [...CHILD_DIAGNOSTICS];
            else if (treatsAdults) list = [...ADULT_DIAGNOSTICS];
            return [...new Set(list)].sort((a, b) => a.localeCompare(b, "fr"));
          })();

          return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">{t("approachesTitle")}</h4>
              <Label className="text-muted-foreground">
                {t("expertiseCommonSubtitle")}
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto p-2">
                {APPROACHES_ET_THERAPIES.map((approach) => (
                  <div key={approach} className="flex items-center space-x-2">
                    <Checkbox
                      id={`approach-${approach}`}
                      checked={formData.approaches.includes(approach)}
                      onCheckedChange={() =>
                        handleArrayChange("approaches", approach)
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
              <h4 className="font-medium text-foreground">{t("problematicsTitle")}</h4>
              <Label className="text-muted-foreground">
                {t("expertiseCommonSubtitle")}
              </Label>
              {problematicsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto p-2">
                  {problematicsList.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={`problematic-${item}`}
                        checked={formData.problematics.includes(item)}
                        onCheckedChange={() =>
                          handleArrayChange("problematics", item)
                        }
                      />
                      <label
                        htmlFor={`problematic-${item}`}
                        className="text-sm cursor-pointer"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("selectAgeCategoryFirst")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-foreground">{t("diagnosticsTitle")}</h4>
              <Label className="text-muted-foreground">
                {t("expertiseCommonSubtitle")}
              </Label>
              {diagnosticsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto p-2">
                  {diagnosticsList.map((diag) => (
                    <div key={diag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`diagnosed-${diag}`}
                        checked={formData.diagnosedConditions.includes(diag)}
                        onCheckedChange={() =>
                          handleArrayChange("diagnosedConditions", diag)
                        }
                      />
                      <label
                        htmlFor={`diagnosed-${diag}`}
                        className="text-sm cursor-pointer"
                      >
                        {diag}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("selectAgeCategoryFirst")}
                </p>
              )}
            </div>
          </div>
          );
        })();

      
      case 4: // Session Types & Modalities
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>
                {t("ageCategoryLabel")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("ageCategoryHint")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AGE_CATEGORIES.map((age) => (
                  <div key={age.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`age-${age.value}`}
                      checked={formData.ageCategories.includes(age.value)}
                      onCheckedChange={() =>
                        handleArrayChange("ageCategories", age.value)
                      }
                    />
                    <label
                      htmlFor={`age-${age.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {t(`ageCategories.${age.value}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("sessionTypesLabel")}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROFESSIONAL_SESSION_TYPE_OPTIONS.map(({ value, msgKey }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`session-${msgKey}`}
                      checked={formData.sessionTypes.includes(value)}
                      onCheckedChange={() =>
                        handleArrayChange("sessionTypes", value)
                      }
                    />
                    <label
                      htmlFor={`session-${msgKey}`}
                      className="text-sm cursor-pointer"
                    >
                      {t(`sessionTypeOptions.${msgKey}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("modalitiesLabel")}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROFESSIONAL_MODALITY_OPTIONS.map(({ value, msgKey }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`modality-${msgKey}`}
                      checked={formData.modalities.includes(value)}
                      onCheckedChange={() =>
                        handleArrayChange("modalities", value)
                      }
                    />
                    <label
                      htmlFor={`modality-${msgKey}`}
                      className="text-sm cursor-pointer"
                    >
                      {t(`modalityOptions.${msgKey}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Pricing & Payment (Tarifs & Paiements)
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="individualSessionRate">
                {t("tarifSouhaité")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="individualSessionRate"
                  name="individualSessionRate"
                  type="number"
                  min="0"
                  value={formData.individualSessionRate}
                  onChange={handleChange}
                  placeholder="100"
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coupleSessionRate">{t("couple")}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="coupleSessionRate"
                  name="coupleSessionRate"
                  type="number"
                  min="0"
                  value={formData.coupleSessionRate}
                  onChange={handleChange}
                  placeholder="150"
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupSessionRate">{t("groupe")}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="groupSessionRate"
                  name="groupSessionRate"
                  type="number"
                  min="0"
                  value={formData.groupSessionRate}
                  onChange={handleChange}
                  placeholder="75"
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentFrequency">
                {t("paymentFrequencyLabel")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.paymentFrequency}
                onValueChange={(val) =>
                  handleSelectChange("paymentFrequency", val)
                }
              >
                <SelectTrigger id="paymentFrequency">
                  <SelectValue placeholder={t("paymentFrequencyPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">{t("paymentFrequencyWeekly")}</SelectItem>
                  <SelectItem value="bi-weekly">{t("paymentFrequencyBiWeekly")}</SelectItem>
                  <SelectItem value="monthly">{t("paymentFrequencyMonthly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        );

      case 6: // Availability
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>{t("availableDaysLabel")}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROFESSIONAL_WEEKDAY_OPTIONS.map(({ value, msgKey }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${msgKey}`}
                      checked={formData.availableDays.includes(value)}
                      onCheckedChange={() =>
                        handleArrayChange("availableDays", value)
                      }
                    />
                    <label
                      htmlFor={`day-${msgKey}`}
                      className="text-sm cursor-pointer"
                    >
                      {t(`weekdays.${msgKey}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionDuration">
                {t("sessionDurationLabel")}
              </Label>
              <Select
                value={formData.sessionDuration}
                onValueChange={(val) =>
                  handleSelectChange("sessionDuration", val)
                }
              >
                <SelectTrigger id="sessionDuration">
                  <SelectValue placeholder={t("sessionDurationSelectPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">{t("sessionDurationOptions.minutes30")}</SelectItem>
                  <SelectItem value="45">{t("sessionDurationOptions.minutes45")}</SelectItem>
                  <SelectItem value="50">{t("sessionDurationOptions.minutes50")}</SelectItem>
                  <SelectItem value="60">{t("sessionDurationOptions.minutes60")}</SelectItem>
                  <SelectItem value="90">{t("sessionDurationOptions.minutes90")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakDuration">
                {t("breakDurationLabel")}
              </Label>
              <Select
                value={formData.breakDuration}
                onValueChange={(val) =>
                  handleSelectChange("breakDuration", val)
                }
              >
                <SelectTrigger id="breakDuration">
                  <SelectValue placeholder={t("breakDurationSelectPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{t("noBreak")}</SelectItem>
                  <SelectItem value="5">{t("breakDurationOptions.minutes5")}</SelectItem>
                  <SelectItem value="10">{t("breakDurationOptions.minutes10")}</SelectItem>
                  <SelectItem value="15">{t("breakDurationOptions.minutes15")}</SelectItem>
                  <SelectItem value="30">{t("breakDurationOptions.minutes30")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {t("availabilityHint")}
              </p>
            </div>
          </div>
        );

      case 7: // Review & Confirm
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t("reviewYourInformation")}</h3>

              <div className="space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">{t("basicInformation")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formData.email}
                  </p>
                  {formData.phone && (
                    <p className="text-sm text-muted-foreground">
                      {formData.phone}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">{t("professionalDetailsReview")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.specialty || t("notSpecified")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("licenseLabelShort")} {formData.license || t("notSpecified")}
                  </p>
                  {formData.yearsOfExperience && (
                    <p className="text-sm text-muted-foreground">
                      {formData.yearsOfExperience} {t("yearsExperience")}
                    </p>
                  )}
                </div>

                {formData.degree && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">{t("educationLabel")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.degree}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.institution}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
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
                  className="text-sm cursor-pointer leading-tight"
                >
                  {t("termsAcceptBefore")}
                  <Link
                    href="/terms"
                    className="text-primary underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("termsOfService")}
                  </Link>
                  {t("termsAcceptAfter")}
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptPrivacyPolicy"
                  checked={formData.acceptPrivacyPolicy}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      acceptPrivacyPolicy: checked as boolean,
                    }))
                  }
                />
                <div className="space-y-2">
                  <label
                    htmlFor="acceptPrivacyPolicy"
                    className="text-sm cursor-pointer leading-tight block"
                  >
                    {t("privacyAcceptBefore")}
                    <Link
                      href="/privacy"
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("privacyPolicy")}
                    </Link>
                    {t("privacyAcceptAfter")}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {t("privacyConsentClinicalNote")}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                {t("approvalNotice")}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const CurrentIcon = sections[currentSection].icon;

  return (
    <AuthContainer maxWidth="2xl">
      <AuthHeader
        icon={<Briefcase className="w-8 h-8 text-primary" />}
        title={t("title")}
        description={t("description")}
      />

      <AuthCard>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {t("stepOf", { current: currentSection + 1, total: sections.length })}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(((currentSection + 1) / sections.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentSection + 1) / sections.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Section Title */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <CurrentIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">
              {sections[currentSection].title}
            </h2>
          </div>
          {sections[currentSection].required && (
            <p className="text-sm text-muted-foreground">
              {t("requiredFieldsHint")}
            </p>
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Form Content */}
        <form
          onSubmit={
            currentSection === sections.length - 1
              ? handleSubmit
              : (e) => e.preventDefault()
          }
        >
          <AnimatePresence mode="wait" custom={direction}>
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
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between gap-4">
            {currentSection > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" />
                {t("back")}
              </button>
            ) : (
              <div />
            )}

            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors ml-auto"
                disabled={isLoading}
              >
                {t("next")}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.agreeToTerms ||
                  !formData.acceptPrivacyPolicy
                }
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("creating")}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {t("createAccount")}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </AuthCard>

      <AuthFooter>
        {t("hasAccount")}{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          {t("signIn")}
        </Link>
      </AuthFooter>
    </AuthContainer>
  );
}
