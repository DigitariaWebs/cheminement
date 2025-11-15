"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { authAPI } from "@/lib/api-client";
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AuthContainer,
  AuthHeader,
  AuthCard,
  AuthFooter,
} from "@/components/auth";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { Stepper } from "@/components/ui/stepper";

export default function MemberSignupPage() {
  const t = useTranslations("Auth.memberSignup");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const STEPS = [
    {
      title: t("steps.personalInfo"),
      description: t("steps.personalInfoDesc"),
    },
    { title: t("steps.security"), description: t("steps.securityDesc") },
    { title: t("steps.confirm"), description: t("steps.confirmDesc") },
  ];
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isCurrentStepValid = () => {
    if (currentStep === 0) {
      // Step 1: Personal Information validation
      return (
        formData.firstName.trim() &&
        formData.lastName.trim() &&
        formData.email.trim() &&
        validateEmail(formData.email)
      );
    } else if (currentStep === 1) {
      // Step 2: Security validation
      return (
        formData.password &&
        validatePassword(formData.password) &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword
      );
    } else if (currentStep === 2) {
      // Step 3: Terms validation
      return formData.agreeToTerms;
    }
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate current step before proceeding
    if (currentStep === 0) {
      // Step 1: Personal Information validation
      if (!formData.firstName.trim()) {
        setError("First name is required");
        return;
      }
      if (!formData.lastName.trim()) {
        setError("Last name is required");
        return;
      }
      if (!formData.email.trim()) {
        setError("Email is required");
        return;
      }
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }
    } else if (currentStep === 1) {
      // Step 2: Security validation
      if (!formData.password) {
        setError("Password is required");
        return;
      }
      if (!validatePassword(formData.password)) {
        setError("Password must be at least 8 characters long");
        return;
      }
      if (!formData.confirmPassword) {
        setError("Please confirm your password");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Final validation before submission
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      // Create account
      await authAPI.signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "client",
      });

      // Sign in automatically
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign in failed. Please try logging in.");
        router.push("/login/member");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer maxWidth="xl">
      <AuthHeader
        icon={<UserCircle className="w-8 h-8 text-primary" />}
        title={t("title")}
        description={t("description")}
      />

      <AuthCard>
        {/* Stepper */}
        <div className="mb-8">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
            {error}
          </div>
        )}

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
            </div>
          )}

          {/* Step 2: Password */}
          {currentStep === 1 && (
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
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-9 pr-9 h-10"
                    placeholder={t("passwordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
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
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-9 pr-9 h-10"
                    placeholder={t("passwordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Terms & Conditions */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-muted/50 p-6 space-y-4">
                <h3 className="font-serif font-light text-lg">
                  {t("reviewTitle")}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("name")}</span>
                    <span className="font-medium">
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("email")}</span>
                    <span className="font-medium">{formData.email}</span>
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
              disabled={isLoading || !isCurrentStepValid()}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-base font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("creating") || "Creating account..."}</span>
                </>
              ) : (
                <>
                  <span>
                    {currentStep === STEPS.length - 1
                      ? t("createAccount")
                      : t("continue")}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {currentStep === 0 && <SocialLogin mode="signup" />}
      </AuthCard>

      <AuthFooter>
        <p className="text-sm text-muted-foreground font-light">
          {t("hasAccount")}{" "}
          <Link
            href="/login/member"
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
