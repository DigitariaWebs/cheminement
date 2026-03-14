"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { User, Users, Stethoscope } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const options = [
  { key: "self" as const, href: "/appointment?for=self", Icon: User },
  { key: "loved-one" as const, href: "/appointment?for=loved-one", Icon: Users },
  { key: "patient" as const, href: "/appointment?for=patient", Icon: Stethoscope },
];

export default function ProfileSelector() {
  const t = useTranslations("HeroSection");

  return (
    <section className="relative py-16 bg-accent/30 overflow-hidden">
      <div className="container mx-auto px-5 sm:px-7 relative z-10 max-w-4xl">
        <ScrollReveal variant="fade-down" duration={700}>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-light text-foreground mb-3">
              {t("bookingTitle")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              {t("bookingSubtitle")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delayMs={200} duration={700}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {options.map(({ key, href, Icon }) => (
              <Link
                key={key}
                href={href}
                className="group flex flex-col items-center justify-center gap-4 p-6 sm:p-8 rounded-xl border border-border/40 bg-card/80 hover:bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-center"
              >
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <span className="text-base font-medium text-foreground">
                  {key === "self" && t("forSelf")}
                  {key === "loved-one" && t("forLovedOne")}
                  {key === "patient" && t("forPatient")}
                </span>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
