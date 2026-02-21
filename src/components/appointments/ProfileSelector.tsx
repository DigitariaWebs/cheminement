"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { User, Users, Stethoscope } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ProfileSelector() {
  const t = useTranslations("HeroSection");
  const [activeHint, setActiveHint] = useState<string | null>(null);

  return (
    <section className="relative py-16 bg-accent/30 overflow-hidden">
      <div className="container mx-auto px-5 sm:px-7 relative z-10 max-w-6xl">
        <ScrollReveal variant="fade-down" duration={700}>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-light text-foreground mb-3">
              {t("headline")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delayMs={200} duration={700}>
          <div className="flex flex-col gap-4">
            {/* Three Booking Options - Correct Order: self, loved-one, patient */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* For me (Individual) */}
              <Link
                href="/appointment?for=self"
                className="group relative px-6 py-3 bg-primary/90 text-primary-foreground rounded-full text-sm md:text-base font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
                onMouseEnter={() => setActiveHint("self")}
                onMouseLeave={() => setActiveHint(null)}
              >
                <User className="h-4 w-4" />
                <span className="relative z-10">{t("forSelf")}</span>
                <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>

              {/* For a loved one */}
              <Link
                href="/appointment?for=loved-one"
                className="group relative px-6 py-3 bg-primary/90 text-primary-foreground rounded-full text-sm md:text-base font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
                onMouseEnter={() => setActiveHint("loved-one")}
                onMouseLeave={() => setActiveHint(null)}
              >
                <Users className="h-4 w-4" />
                <span className="relative z-10">{t("forLovedOne")}</span>
                <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>

              {/* For a patient */}
              <Link
                href="/appointment?for=patient"
                className="group relative px-6 py-3 bg-primary/90 text-primary-foreground rounded-full text-sm md:text-base font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
                onMouseEnter={() => setActiveHint("patient")}
                onMouseLeave={() => setActiveHint(null)}
              >
                <Stethoscope className="h-4 w-4" />
                <span className="relative z-10">{t("forPatient")}</span>
                <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </div>

            {/* Hover Context Text */}
            {activeHint && (
              <div className="flex items-center justify-center min-h-8 mt-2">
                <p className="text-sm text-muted-foreground italic transition-opacity duration-300 text-center max-w-2xl">
                  {activeHint === "self" && t("bookForSelfHint")}
                  {activeHint === "patient" && t("bookForPatientHint")}
                  {activeHint === "loved-one" && t("bookForLovedOneHint")}
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
