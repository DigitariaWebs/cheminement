"use client";

import Link from "next/link";
import {
  UserCircle,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
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

const STEPS = [
  { title: "Personal Info", description: "Basic information" },
  { title: "Security", description: "Create password" },
  { title: "Confirm", description: "Terms & conditions" },
];

export default function MemberSignupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
  };

  return (
    <AuthContainer maxWidth="xl">
      <AuthHeader
        icon={<UserCircle className="w-8 h-8 text-primary" />}
        title="Join as a Member"
        description="Start your journey to better mental health"
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
                    First Name
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
                      placeholder="John"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastName" className="font-light mb-2">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="h-10"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="font-light mb-2">
                  Email Address
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
                    placeholder="you@example.com"
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
                  Password
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
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  At least 8 characters with a mix of letters and numbers
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="font-light mb-2">
                  Confirm Password
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
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Terms & Conditions */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-muted/50 p-6 space-y-4">
                <h3 className="font-serif font-light text-lg">
                  Review Your Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
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
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Privacy Policy
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
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-base font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <span>
                {currentStep === STEPS.length - 1
                  ? "Create Account"
                  : "Continue"}
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {currentStep === 0 && <SocialLogin mode="signup" />}
      </AuthCard>

      <AuthFooter>
        <p className="text-sm text-muted-foreground font-light">
          Already have an account?{" "}
          <Link
            href="/login/member"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </AuthFooter>

      <AuthFooter>
        <Link
          href="/"
          className="text-sm text-muted-foreground font-light hover:text-foreground transition-colors"
        >
          ← Back to Home
        </Link>
      </AuthFooter>
    </AuthContainer>
  );
}
