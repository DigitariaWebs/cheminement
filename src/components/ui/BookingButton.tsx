"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingButtonProps {
  className?: string;
  showIcon?: boolean;
  variant?: "primary" | "dark";
  size?: "default" | "large" | "small";
  label?: string;
}

export default function BookingButton({
  className,
  showIcon = false,
  variant = "primary",
  size = "default",
  label,
}: BookingButtonProps) {
  const t = useTranslations("HeroSection");
  const [showOptions, setShowOptions] = useState(false);
  const [activeHint, setActiveHint] = useState<string>("self");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  const baseButtonStyles =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-foreground text-background";

  const sizeStyles =
    size === "large"
      ? "px-10 py-5 text-lg"
      : size === "small"
      ? "px-4 py-2 text-sm"
      : "px-7 py-3.5 text-base";

  const optionSizeStyles =
    size === "large"
      ? "px-6 py-3 text-base"
      : size === "small"
      ? "px-3 py-1.5 text-xs"
      : "px-5 py-2.5 text-sm";

  return (
    <div ref={containerRef} className="relative inline-block">
      {!showOptions ? (
        <button
          onClick={() => setShowOptions(true)}
          className={cn(
            "group relative rounded-full font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2",
            baseButtonStyles,
            sizeStyles,
            className
          )}
        >
          {showIcon && <Calendar className="h-5 w-5" />}
          <span className="relative z-10">{label || t("bookNow")}</span>
          <div
            className={cn(
              "absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
              variant === "primary" ? "bg-primary/80" : "bg-foreground/80"
            )}
          />
        </button>
      ) : (
        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start justify-start gap-2.5">
            <Link
              href="/appointment?for=self"
              className={cn(
                "group relative rounded-full font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl",
                variant === "primary"
                  ? "bg-primary/90 text-primary-foreground"
                  : "bg-foreground/90 text-background",
                optionSizeStyles
              )}
              onMouseEnter={() => setActiveHint("self")}
            >
              <span className="relative z-10">{t("forSelf")}</span>
              <div
                className={cn(
                  "absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
                  variant === "primary" ? "bg-primary/80" : "bg-foreground/80"
                )}
              />
            </Link>

            <Link
              href="/appointment?for=patient"
              className={cn(
                "group relative rounded-full font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl",
                variant === "primary"
                  ? "bg-primary/90 text-primary-foreground"
                  : "bg-foreground/90 text-background",
                optionSizeStyles
              )}
              onMouseEnter={() => setActiveHint("patient")}
            >
              <span className="relative z-10">{t("forPatient")}</span>
              <div
                className={cn(
                  "absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
                  variant === "primary" ? "bg-primary/80" : "bg-foreground/80"
                )}
              />
            </Link>

            <Link
              href="/appointment?for=loved-one"
              className={cn(
                "group relative rounded-full font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl",
                variant === "primary"
                  ? "bg-primary/90 text-primary-foreground"
                  : "bg-foreground/90 text-background",
                optionSizeStyles
              )}
              onMouseEnter={() => setActiveHint("loved-one")}
            >
              <span className="relative z-10">{t("forLovedOne")}</span>
              <div
                className={cn(
                  "absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
                  variant === "primary" ? "bg-primary/80" : "bg-foreground/80"
                )}
              />
            </Link>
          </div>

          {/* Hover Context Text with Back button */}
          <div className="flex items-center justify-between gap-4 min-h-8">
            <p className="text-sm text-muted-foreground italic transition-opacity duration-300 flex-1">
              {activeHint === "self" && t("bookForSelfHint")}
              {activeHint === "patient" && t("bookForPatientHint")}
              {activeHint === "loved-one" && t("bookForLovedOneHint")}
            </p>
            <button
              onClick={() => setShowOptions(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline whitespace-nowrap"
            >
              {t("back")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
