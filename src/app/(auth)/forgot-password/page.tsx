"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KeyRound, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AuthContainer,
  AuthHeader,
  AuthCard,
  AuthFooter,
} from "@/components/auth";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email"));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset request for:", email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <AuthContainer>
        <AuthHeader
          icon={<Mail className="w-8 h-8 text-primary" />}
          title="Check Your Email"
          description="We've sent you a password reset link"
        />

        <AuthCard>
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground font-light">
              If an account exists for{" "}
              <strong className="text-foreground">{email}</strong>, you will
              receive a password reset link shortly.
            </p>
            <p className="text-sm text-muted-foreground font-light">
              Please check your inbox and spam folder.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/login"
              className="group w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-base font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Login</span>
            </Link>
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full px-6 py-3 text-primary hover:text-primary/80 rounded-full text-base font-light tracking-wide transition-colors"
            >
              Resend Email
            </button>
          </div>
        </AuthCard>

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

  return (
    <AuthContainer>
      <AuthHeader
        icon={<KeyRound className="w-8 h-8 text-primary" />}
        title="Reset Your Password"
        description="Enter your email address and we'll send you a reset link"
      />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
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
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-10"
                placeholder="you@example.com"
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground font-light">
              We&apos;ll send a password reset link to this email address
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="group w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-base font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span>Send Reset Link</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6">
          <Link
            href="/login"
            className="group w-full flex items-center justify-center gap-2 px-6 py-3 border border-border/20 text-foreground rounded-full text-base font-light tracking-wide transition-all duration-300 hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Login</span>
          </Link>
        </div>
      </AuthCard>

      <AuthFooter>
        <p className="text-sm text-muted-foreground font-light">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Sign up
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
