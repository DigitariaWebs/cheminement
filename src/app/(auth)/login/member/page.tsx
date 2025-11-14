"use client";

import Link from "next/link";
import { UserCircle, Mail, Lock, ArrowRight } from "lucide-react";
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
import { SocialLogin } from "@/components/auth/SocialLogin";
import { redirect } from "next/navigation";

export default function MemberLoginPage() {
  const t = useTranslations("Auth.memberLogin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    redirect("/client/dashboard");
  };

  return (
    <AuthContainer>
      <AuthHeader
        icon={<UserCircle className="w-8 h-8 text-primary" />}
        title={t("title")}
        description={t("description")}
      />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-10"
                placeholder={t("emailPlaceholder")}
              />
            </div>
          </div>

          {/* Password Field */}
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-10"
                placeholder={t("passwordPlaceholder")}
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-border/20 rounded"
              />
              <Label htmlFor="remember-me" className="ml-2 font-light">
                {t("rememberMe")}
              </Label>
            </div>

            <div className="text-sm">
              <Link
                href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                className="font-light text-primary hover:text-primary/80 transition-colors"
              >
                {t("forgotPassword")}
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="group w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-base font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span>{t("signIn")}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <SocialLogin mode="login" />
      </AuthCard>

      <AuthFooter>
        <p className="text-sm text-muted-foreground font-light">
          {t("noAccount")}{" "}
          <Link
            href="/signup/member"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            {t("createAccount")}
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
