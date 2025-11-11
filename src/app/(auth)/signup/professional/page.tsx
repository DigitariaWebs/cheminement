"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AuthContainer,
  AuthHeader,
  AuthCard,
  AuthFooter,
} from "@/components/auth";
import { Stepper } from "@/components/ui/stepper";

export default function ProfessionalSignupPage() {
  const t = useTranslations("Auth.professionalSignup");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const STEPS = [
    {
      title: t("steps.personalInfo"),
      description: t("steps.personalInfoDesc"),
    },
    {
      title: t("steps.professional"),
      description: t("steps.professionalDesc"),
    },
    { title: t("steps.security"), description: t("steps.securityDesc") },
    { title: t("steps.confirm"), description: t("steps.confirmDesc") },
  ];
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    license: "",
    specialty: "",
    location: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup attempt:", formData);
    // Redirect to dashboard after successful signup
    router.push("/dashboard");
  };

  return (
    <AuthContainer maxWidth="2xl">
      <AuthHeader
        icon={<Briefcase className="w-8 h-8 text-primary" />}
        title={t("title")}
        description={t("description")}
      />

      <AuthCard>
        {/* Stepper */}
        <div className="mb-8">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        <form
          onSubmit={
            currentStep === STEPS.length - 1 ? handleSubmit : handleNext
          }
        >
          {/* Step 1: Personal Information */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="font-light mb-2">
                    {t("firstName")}
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-9 h-10"
                      placeholder={t("firstNamePlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastName" className="font-light mb-2">
                    {t("lastName")}
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="h-10"
                    placeholder={t("lastNamePlaceholder")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="font-light mb-2">
                  {t("email")}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-9 h-10"
                    placeholder={t("emailPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="font-light mb-2">
                  {t("phone")}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-9 h-10"
                    placeholder={t("phonePlaceholder")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="license" className="font-light mb-2">
                    {t("license")}
                  </Label>
                  <Input
                    id="license"
                    name="license"
                    type="text"
                    required
                    value={formData.license}
                    onChange={handleChange}
                    className="h-10"
                    placeholder={t("licensePlaceholder")}
                  />
                </div>

                <div>
                  <Label htmlFor="specialty" className="font-light mb-2">
                    {t("specialty")}
                  </Label>
                  <select
                    id="specialty"
                    name="specialty"
                    required
                    value={formData.specialty}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="">{t("specialtyPlaceholder")}</option>
                    <option value="psychologist">
                      {t("specialtyOptions.psychologist")}
                    </option>
                    <option value="psychiatrist">
                      {t("specialtyOptions.psychiatrist")}
                    </option>
                    <option value="therapist">
                      {t("specialtyOptions.therapist")}
                    </option>
                    <option value="counselor">
                      {t("specialtyOptions.counselor")}
                    </option>
                    <option value="social-worker">
                      {t("specialtyOptions.socialWorker")}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="font-light mb-2">
                  {t("location")}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-9 h-10"
                    placeholder={t("locationPlaceholder")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Password */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="password" className="font-light mb-2">
                  {t("password")}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-9 h-10"
                    placeholder={t("passwordPlaceholder")}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("passwordHint")}
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="font-light mb-2">
                  {t("confirmPassword")}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-9 h-10"
                    placeholder={t("passwordPlaceholder")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Terms & Conditions */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-muted/50 p-6 space-y-4">
                <h3 className="font-serif font-light text-lg">
                  {t("reviewTitle")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-2">
                      {t("personalInformation")}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("name")}
                        </span>
                        <span className="font-medium">
                          {formData.firstName} {formData.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("email")}
                        </span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("phone")}
                        </span>
                        <span className="font-medium">{formData.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">
                      {t("professionalDetails")}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("license")}
                        </span>
                        <span className="font-medium">{formData.license}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("specialty")}
                        </span>
                        <span className="font-medium capitalize">
                          {formData.specialty.replace("-", " ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("location")}
                        </span>
                        <span className="font-medium">{formData.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 mt-1 text-primary focus:ring-primary border-border/20 rounded"
                />
                <Label htmlFor="agreeToTerms" className="ml-2 font-light">
                  {t("agreeToTerms")}{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {t("termsOfService")}
                  </Link>{" "}
                  {t("and")}{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {t("privacyPolicy")}
                  </Link>
                </Label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 text-foreground font-light transition-opacity disabled:opacity-0 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t("back")}</span>
            </button>

            <button
              type="submit"
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-base font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <span>
                {currentStep === STEPS.length - 1
                  ? t("createAccount")
                  : t("continue")}
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </AuthCard>

      <AuthFooter>
        <p className="text-sm text-muted-foreground font-light">
          {t("hasAccount")}{" "}
          <Link
            href="/login/professional"
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
