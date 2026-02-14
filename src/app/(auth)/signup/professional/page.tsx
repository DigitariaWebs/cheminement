"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  paymentAgreement: string;

  // Availability
  availableDays: string[];
  sessionDuration: string;
  breakDuration: string;

  agreeToTerms: boolean;
}

export default function ProfessionalSignupPage() {
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
    paymentAgreement: "",
    availableDays: [],
    sessionDuration: "",
    breakDuration: "",
    agreeToTerms: false,
  });

  const sections = [
    { title: "Basic Information", icon: User, required: true },
    { title: "Professional Details", icon: Briefcase, required: true },
    { title: "Education & Credentials", icon: GraduationCap, required: true },
    { title: "Expertise & Approach", icon: Target, required: false },
    { title: "Session Types & Modalities", icon: Users, required: false },
    { title: "Pricing & Payment", icon: DollarSign, required: false },
    { title: "Availability", icon: Clock, required: false },
    { title: "Review & Confirm", icon: CheckCircle2, required: true },
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
        if (!formData.firstName.trim()) return "First name is required";
        if (!formData.lastName.trim()) return "Last name is required";
        if (!formData.email.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
          return "Invalid email address";
        if (!formData.password) return "Password is required";
        if (formData.password.length < 8)
          return "Password must be at least 8 characters";
        if (formData.password !== formData.confirmPassword)
          return "Passwords do not match";
        break;
      case 1: // Professional Details
        if (!formData.specialty) return "Specialty is required";
        if (!formData.license.trim())
          return "License/Practice number is required";
        break;
      case 2: // Education
        if (!formData.degree.trim()) return "Degree is required";
        if (!formData.institution.trim()) return "Institution is required";
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
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authAPI.signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "professional",
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        language: formData.language,
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
          paymentAgreement: formData.paymentAgreement || undefined,
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

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign in failed. Please try logging in.");
        router.push("/login");
      } else {
        router.push("/professional/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again.",
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
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Date of Birth
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
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => handleSelectChange("gender", val)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="preferNotToSay">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Preferred Language
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(val) => handleSelectChange("language", val)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location / Postal Code
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Province or A1A 1A1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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
                At least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
        );

      case 1: // Professional Details
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="specialty">
                Profession / Specialty <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.specialty}
                onValueChange={(val) => handleSelectChange("specialty", val)}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="psychologist">Psychologist</SelectItem>
                  <SelectItem value="psychotherapist">
                    Psychotherapist
                  </SelectItem>
                  <SelectItem value="counselor">Counselor</SelectItem>
                  <SelectItem value="socialWorker">Social Worker</SelectItem>
                  <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="license">
                Practice Number / License{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="license"
                name="license"
                value={formData.license}
                onChange={handleChange}
                placeholder="Enter your practice number or license"
              />
              <p className="text-xs text-muted-foreground">
                Professional license, doctoral student status, or permit by
                equivalency in progress
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
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
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about your professional background and approach..."
                className="min-h-[120px] resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/1000 characters
              </p>
            </div>
          </div>
        );

      case 2: // Education & Credentials
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="degree">
                Degree <span className="text-red-500">*</span>
              </Label>
              <Input
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g., Ph.D. in Clinical Psychology"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">
                Institution <span className="text-red-500">*</span>
              </Label>
              <Input
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="University name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                name="graduationYear"
                type="number"
                min="1950"
                max={new Date().getFullYear()}
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="2020"
              />
            </div>

            <div className="space-y-2">
              <Label>Certifications (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "CBT Certified",
                  "DBT Certified",
                  "EMDR Certified",
                  "Family Therapy",
                  "Trauma-Informed",
                  "Substance Abuse",
                  "Child & Adolescent",
                  "Couples Therapy",
                ].map((cert) => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cert-${cert}`}
                      checked={formData.certifications.includes(cert)}
                      onCheckedChange={() =>
                        handleArrayChange("certifications", cert)
                      }
                    />
                    <label
                      htmlFor={`cert-${cert}`}
                      className="text-sm cursor-pointer"
                    >
                      {cert}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Expertise & Approach
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Issues Handled (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto p-2">
                {[
                  "Intervention auprès des employés des services d'urgence (ambulanciers, policiers, pompiers…)",
                  "Estime/affirmation de soi",
                  "Oncologie",
                  "Accident de la route",
                  "Accident de travail",
                  "Adaptation à l'école",
                  "Adoption internationale",
                  "Alcoolisme / toxicomanies",
                  "Aliénation mentale",
                  "Abus sexuel",
                  "Anxiété",
                  "Anxiété de performance",
                  "Arrêt de travail",
                  "Retour progressif au travail",
                  "Approche intégrative",
                  "Approche humaniste",
                  "Approche TCC",
                  "ACT",
                  "Psychodynamique",
                  "Pleine conscience",
                  "Changement organisationnel",
                  "Changements sociaux",
                  "Charge mentale",
                  "Climat de travail",
                  "Conflits interpersonnels",
                  "Communication",
                  "Curatelle publique",
                  "Déficit de l'attention/hyperactivité",
                  "Déficience intellectuelle",
                  "Dépendance affective",
                  "Dépendance aux jeux de hasard et d'argent (en ligne)",
                  "Dépendance aux jeux vidéo",
                  "Dépendance aux contenus pornographiques",
                  "Difficultés académiques",
                  "Recherche de sens",
                  "Relations amoureuses",
                  "Relations au travail",
                  "Intervention en milieu de travail",
                  "Santé psychologique au travail",
                  "Deuil",
                  "Diversité culturelle",
                  "Douance",
                  "Douleur chronique / fibromyalgie",
                  "Dynamique organisationnelle",
                  "EMDR",
                  "Épuisement professionnel/burnout",
                  "Estime de soi",
                  "Étape de la vie",
                  "Évaluation neuropsychologique",
                  "Évaluation psychologique",
                  "Évaluation psychologique milieu scolaire",
                  "Fertilité / Procréation assistée",
                  "Garde d'enfants (expertise psychosociale)",
                  "Gestion de carrière",
                  "Gestion du stress",
                  "Gestion de la colère",
                  "Gestion des émotions",
                  "Guerre / conflits armés (vétérans)",
                  "Guerre / conflits armés (victimes)",
                  "Habiletés de gestion",
                  "Harcèlement au travail",
                  "HPI-adulte",
                  "TSA",
                  "TSA adulte évaluation",
                  "TSA adulte intervention",
                  "Hypnose thérapeutique",
                  "IMO",
                  "Immigration",
                  "Vieillissement",
                  "Intérêts / Aptitudes au travail",
                  "Intimidation",
                  "Violence (agresseurs)",
                  "Violence (victimes)",
                  "Maladie dégénératives / sida",
                  "Maladies physiques / handicaps",
                  "Médiation familiale",
                  "Monoparentalité / famille recomposée",
                  "Orientation scolaire et professionnelle",
                  "Orientation sexuelle",
                  "Peur de vomir",
                  "Peur d'avoir peur",
                  "Peur de mourir",
                  "Périnatalité",
                  "Problématiques propres aux autochtones",
                  "Problématiques propres aux agriculteurs",
                  "Problématiques propres aux réfugiés",
                  "Problèmes relationnels",
                  "Proche aidant",
                  "Psychosomatique",
                  "Psychologie du sport",
                  "La psychologie gériatrique",
                  "Relations familiales",
                  "Sectes",
                  "Sélection de personnel/réaffectation",
                  "Séparation/divorce",
                  "Situations de crise",
                  "Soins palliatifs",
                  "Spiritualité",
                  "Stress post-traumatique",
                  "Stress financier",
                  "Transexualité",
                  "Troubles alimentaires",
                  "Troubles anxieux, phobies, panique",
                  "Troubles d'apprentissages",
                  "Troubles de la personnalité",
                  "TPL",
                  "Troubles de l'humeur",
                  "Troubles du langage",
                  "Troubles du sommeil",
                  "Troubles mentaux sévères et persistants",
                  "Troubles neuropsychologiques",
                  "Troubles obsessifs-compulsifs",
                  "Identité de genre / LGBTQ+",
                  "Addiction sexuelle et hypersexualité",
                  "Affirmation de soi",
                  "Anxiété de séparation",
                  "Anxiété post-partum",
                  "Asexualité et aromantisme",
                  "Attachement chez les adultes",
                  "Autosabotage",
                  "Blessure morale",
                  "Boulimie",
                  "Leadership",
                  "Gestion d'équipe",
                  "Rôle de gestionnaire",
                  "Compétences en matière de résolution de problèmes",
                  "Compétences parentales",
                  "Étape ou transition de vie",
                  "Difficultés masculines",
                  "Famille recomposée",
                  "Fugue",
                  "Gestion de la colère ordonnée par le tribunal",
                  "Gestion de la douleur chronique",
                  "Gestion du temps et organisation",
                  "Grossesse et maternité",
                  "Identité de genre",
                  "Insomnie",
                  "Le mensonge",
                  "Motivation",
                  "Perfectionnisme",
                  "Procrastination",
                  "Racisme, soutien à la discrimination",
                  "Relations interpersonnelles",
                  "Séparation ou divorce",
                  "Problèmes professionnels",
                  "Soutien aux réfugiés et aux immigrants",
                  "Survivre à la maltraitance",
                  "Fatigue chronique",
                  "L'agoraphobie",
                  "L'anxiété liée à la santé",
                  "Dysrégulation émotionnelle",
                  "Phobie",
                  "Colère",
                  "Personnalité dépendante",
                  "Traitement du jeu pathologique",
                  "Interventions/moyens TDAH",
                  "Accumulation compulsive",
                  "Traitement du trouble obsessionnel compulsif (TOC)",
                  "Traitement du trouble panique",
                  "Traitement pour l'anxiété sociale",
                  "Trouble affectif saisonnier (TAS)",
                  "Trouble de l'adaptation",
                  "Trouble de la dépersonnalisation-déréalisation",
                  "Troubles de l'attachement",
                  "Psychose",
                  "État dépressif",
                  "Bipolarité",
                  "Peur de vieillir",
                  "Exposition mentale",
                  "Anxiété chez les personnes âgées",
                  "Fatigabilité",
                  "Irritabilité",
                  "Problèmes de sommeil",
                  "Difficultés de concentration",
                  "Difficultés à prendre des décisions",
                  "Déficits des fonctions exécutives",
                  "Médiation en milieu de travail lorsqu'une personne a un problème de santé mentale",
                ].map((issue) => (
                  <div key={issue} className="flex items-center space-x-2">
                    <Checkbox
                      id={`issue-${issue}`}
                      checked={formData.problematics.includes(issue)}
                      onCheckedChange={() =>
                        handleArrayChange("problematics", issue)
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
              <Label>
                Approches et mandats potentiels (sélectionnez tous ceux qui
                s&apos;appliquent)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-2">
                {[
                  "Thérapie individuelle",
                  "Thérapie de couple",
                  "Thérapie familiale",
                  "Thérapie de l'enfant",
                  "Coaching des parents",
                  "Thérapie des adolescents",
                  "Thérapie individuelle pour les personnes âgées",
                  "Hypnothérapie",
                  "Coaching pour gestionnaires/cadres",
                  "Évaluation du TDAH chez l'adulte",
                  "Zoothérapie",
                  "Accompagnement des employés avec un HPI,TSA",
                  "Développement des compétences professionnelles",
                  "Évaluation des troubles d'apprentissage chez les adultes",
                  "Orientation professionnelle",
                  "Évaluation du TDAH chez l'enfant",
                  "Psychologie en réadaptation",
                  "Évaluations des troubles d'apprentissage chez les enfants",
                  "Évaluation psychologique",
                  "Évaluation psychiatrique",
                  "L'art-thérapie",
                  "Supervision clinique en psychologie",
                  "Supervision clinique pour internat",
                  "Supervision clinique pour permis par équivalence",
                  "Évaluations neuropsychologiques pour les enfants",
                  "Évaluations neuropsychologiques pour les adultes",
                  "La thérapie d'acceptation et d'engagement (ACT)",
                  "La thérapie cognitivo-comportementale (TCC)",
                  "La thérapie comportementale dialectique (TCD)",
                  "La thérapie psychodynamique",
                  "La thérapie centrée sur les émotions",
                  "La thérapie sensorimotrice",
                  "La psychothérapie analytique fonctionnelle",
                  "La thérapie basée sur la mentalisation",
                  "La pleine conscience",
                  "L'entretien motivationnel (EM)",
                  "La psychologie positive",
                  "La schémathérapie",
                  "La Psychothérapie interpersonnelle",
                  "La Psychothérapie psychanalytique",
                  "La thérapie existentielle",
                  "La thérapie humaniste centrée sur la personne",
                  "La thérapie narrative",
                  "La Thérapie par le jeu",
                  "Thérapie brève centrée sur les solutions",
                  "Thérapie cognitivo-comportementale pour l'insomnie (TCC-I)",
                  "Thérapie du rêve",
                  "Thérapie intégrative",
                  "Thérapie somatique",
                  "Thérapie systémique familiale TCC",
                  "Thérapie du processus cognitif",
                  "Thérapie de la cohérence",
                  "Thérapie de schémas",
                  "Thérapie relationnelle",
                  "Thérapie systémique-interactionnelle",
                  "ACT thérapie pour les enfants et adolescents",
                ].map((approach) => (
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
              <Label>Age Categories (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Children (0-12)",
                  "Adolescents (13-17)",
                  "Adults (18-64)",
                  "Seniors (65+)",
                ].map((age) => (
                  <div key={age} className="flex items-center space-x-2">
                    <Checkbox
                      id={`age-${age}`}
                      checked={formData.ageCategories.includes(age)}
                      onCheckedChange={() =>
                        handleArrayChange("ageCategories", age)
                      }
                    />
                    <label
                      htmlFor={`age-${age}`}
                      className="text-sm cursor-pointer"
                    >
                      {age}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Diagnostics traités (sélectionnez tous ceux qui
                s&apos;appliquent)
              </Label>
              <p className="text-xs text-muted-foreground">
                Sélectionnez les diagnostics que vous traitez selon les
                catégories d&apos;âge choisies
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {(() => {
                  // Determine if professional treats children or adults based on ageCategories
                  const treatsChildren = formData.ageCategories.some(
                    (cat) =>
                      cat.toLowerCase().includes("child") ||
                      cat.toLowerCase().includes("adolescent"),
                  );
                  const treatsAdults = formData.ageCategories.some(
                    (cat) =>
                      cat.toLowerCase().includes("adult") ||
                      cat.toLowerCase().includes("senior"),
                  );

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

                  // Combine lists based on what the professional treats
                  let conditionsList: string[] = [];
                  if (treatsChildren && treatsAdults) {
                    // If treats both, show both lists
                    conditionsList = [
                      ...childDiagnosedConditions,
                      ...adultDiagnosedConditions,
                    ];
                  } else if (treatsChildren) {
                    conditionsList = childDiagnosedConditions;
                  } else if (treatsAdults) {
                    conditionsList = adultDiagnosedConditions;
                  }
                  // If no age categories selected, show empty list

                  return conditionsList.length > 0 ? (
                    conditionsList.map((condition) => (
                      <div
                        key={condition}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`diagnosed-${condition}`}
                          checked={formData.diagnosedConditions.includes(
                            condition,
                          )}
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
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground col-span-2">
                      Veuillez d&apos;abord sélectionner au moins une catégorie
                      d&apos;âge ci-dessus
                    </p>
                  );
                })()}
              </div>
            </div>
          </div>
        );

      case 4: // Session Types & Modalities
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Session Types (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Individual", "Couple", "Family", "Group", "Coaching"].map(
                  (type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`session-${type}`}
                        checked={formData.sessionTypes.includes(type)}
                        onCheckedChange={() =>
                          handleArrayChange("sessionTypes", type)
                        }
                      />
                      <label
                        htmlFor={`session-${type}`}
                        className="text-sm cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Modalities (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "In-Person (Office)",
                  "Video Call",
                  "Phone Call",
                  "Chat/Messaging",
                ].map((modality) => (
                  <div key={modality} className="flex items-center space-x-2">
                    <Checkbox
                      id={`modality-${modality}`}
                      checked={formData.modalities.includes(modality)}
                      onCheckedChange={() =>
                        handleArrayChange("modalities", modality)
                      }
                    />
                    <label
                      htmlFor={`modality-${modality}`}
                      className="text-sm cursor-pointer"
                    >
                      {modality}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Languages Spoken (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "English",
                  "French",
                  "Spanish",
                  "Mandarin",
                  "Arabic",
                  "Other",
                ].map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${lang}`}
                      checked={formData.languages.includes(lang)}
                      onCheckedChange={() =>
                        handleArrayChange("languages", lang)
                      }
                    />
                    <label
                      htmlFor={`lang-${lang}`}
                      className="text-sm cursor-pointer"
                    >
                      {lang}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Pricing & Payment
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="individualSessionRate">
                Individual Session Rate (per session)
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
              <Label htmlFor="coupleSessionRate">
                Couple Session Rate (per session)
              </Label>
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
              <Label htmlFor="groupSessionRate">
                Group Session Rate (per session)
              </Label>
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
              <Label htmlFor="paymentAgreement">Payment Agreement</Label>
              <Select
                value={formData.paymentAgreement}
                onValueChange={(val) =>
                  handleSelectChange("paymentAgreement", val)
                }
              >
                <SelectTrigger id="paymentAgreement">
                  <SelectValue placeholder="Select payment frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per-session">Per Session</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Every 2 Weeks</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 6: // Availability
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Available Days (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day}`}
                      checked={formData.availableDays.includes(day)}
                      onCheckedChange={() =>
                        handleArrayChange("availableDays", day)
                      }
                    />
                    <label
                      htmlFor={`day-${day}`}
                      className="text-sm cursor-pointer"
                    >
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionDuration">
                Session Duration (minutes)
              </Label>
              <Select
                value={formData.sessionDuration}
                onValueChange={(val) =>
                  handleSelectChange("sessionDuration", val)
                }
              >
                <SelectTrigger id="sessionDuration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="50">50 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakDuration">
                Break Between Sessions (minutes)
              </Label>
              <Select
                value={formData.breakDuration}
                onValueChange={(val) =>
                  handleSelectChange("breakDuration", val)
                }
              >
                <SelectTrigger id="breakDuration">
                  <SelectValue placeholder="Select break duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No break</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                You can set detailed availability hours and specific time slots
                after registration in your dashboard.
              </p>
            </div>
          </div>
        );

      case 7: // Review & Confirm
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Review Your Information</h3>

              <div className="space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Basic Information</h4>
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
                  <h4 className="font-medium mb-2">Professional Details</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.specialty || "Not specified"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    License: {formData.license || "Not specified"}
                  </p>
                  {formData.yearsOfExperience && (
                    <p className="text-sm text-muted-foreground">
                      {formData.yearsOfExperience} years of experience
                    </p>
                  )}
                </div>

                {formData.degree && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Education</h4>
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
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary underline"
                  target="_blank"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
                <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Your account will be pending approval. Once approved by our
                team, you&apos;ll be able to access your professional dashboard
                and start accepting clients.
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
        title="Professional Registration"
        description="Create your professional account and profile"
      />

      <AuthCard>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentSection + 1} of {sections.length}
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
              * Required fields must be completed
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
                Back
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
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !formData.agreeToTerms}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </AuthCard>

      <AuthFooter>
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign In
        </Link>
      </AuthFooter>
    </AuthContainer>
  );
}
