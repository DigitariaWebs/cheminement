"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { Award } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("HeroSection");
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const [activeHint, setActiveHint] = useState<string>("self");

  return (
    <section className="relative h-screen flex items-center justify-center bg-accent overflow-hidden">
      {/* Background Pattern/Decoration */}
      <div className="absolute inset-0 opacity-5"></div>

      <div className="container mx-auto px-6 pt-20 pb-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          {/* Left Side: Content */}
          {/* Right Side: Content */}
          <div className="flex-1 max-w-5xl">
            {/* Top Tagline */}
            <div className="mb-4 animate-fade-in">
              <p className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground font-light mb-2">
                {t("tagline")}
              </p>
              <div className="w-32 h-0.5 bg-muted-foreground mx-auto lg:mx-0"></div>
            </div>

            {/* Designed by Psychologists Badge */}
            <div className="mb-6 animate-fade-in animation-delay-100">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 border border-primary/20 px-4 py-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary">
                  <Award className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {t("designedByPsychologists")}
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-serif font-light text-foreground mb-8 leading-tight animate-fade-in-up text-left lg:text-left">
              {t("headline")}
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto lg:mx-0 mb-8 leading-relaxed font-light animate-fade-in-up animation-delay-200 text-left lg:text-left">
              {t("description")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 animate-fade-in-up animation-delay-400">
              {/* Main Buttons */}
              <div className="flex flex-col sm:flex-row items-start justify-start gap-4">
                <button
                  onClick={() => setShowBookingOptions(!showBookingOptions)}
                  className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <span className="relative z-10">{t("bookNow")}</span>
                  <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>

                <Link
                  href="/book"
                  className="group flex items-center gap-2 px-10 py-5 text-foreground text-lg font-light tracking-wide transition-all duration-300 hover:gap-3 border border-muted-foreground/20 rounded-full hover:bg-muted/50"
                >
                  <span>{t("learnMore")}</span>
                </Link>
              </div>

              {/* Expandable Booking Options */}
              {showBookingOptions && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start justify-start gap-3">
                    <Link
                      href="/appointment?for=self"
                      className="group relative px-6 py-3 bg-primary/90 text-primary-foreground rounded-full text-sm font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      onMouseEnter={() => setActiveHint("self")}
                    >
                      <span className="relative z-10">{t("forSelf")}</span>
                      <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </Link>

                    <Link
                      href="/appointment?for=patient"
                      className="group relative px-6 py-3 bg-primary/90 text-primary-foreground rounded-full text-sm font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      onMouseEnter={() => setActiveHint("patient")}
                    >
                      <span className="relative z-10">{t("forPatient")}</span>
                      <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </Link>

                    <Link
                      href="/appointment?for=loved-one"
                      className="group relative px-6 py-3 bg-primary/90 text-primary-foreground rounded-full text-sm font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      onMouseEnter={() => setActiveHint("loved-one")}
                    >
                      <span className="relative z-10">{t("forLovedOne")}</span>
                      <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </Link>
                  </div>

                  {/* Hover Context Text */}
                  <div className="h-10">
                    <p className="text-base md:text-lg text-muted-foreground italic transition-opacity duration-300">
                      {activeHint === "self" && t("bookForSelfHint")}
                      {activeHint === "patient" && t("bookForPatientHint")}
                      {activeHint === "loved-one" && t("bookForLovedOneHint")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info Tags */}
            <div className="mt-8 flex flex-wrap items-center justify-start gap-6 text-sm text-muted-foreground animate-fade-in animation-delay-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span>{t("personalizedCare")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span>{t("flexibleScheduling")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span>{t("confidentialSupport")}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="flex-1 max-w-md lg:max-w-lg">
            <div className="relative w-full h-[600px] flex items-center justify-center">
              <Image
                src="/HeroSection.png"
                alt="Mental Health Professional"
                width={600}
                height={600}
                className="max-w-full max-h-full object-contain animate-fade-in-up animation-delay-600"
              />
              {/* Fading effect at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-accent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
