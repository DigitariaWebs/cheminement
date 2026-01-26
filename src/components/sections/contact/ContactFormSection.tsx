"use client";

import { CalendarCheck, Info, ClipboardPen } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { AnimationVariant } from "@/components/ui/ScrollReveal";

export default function ContactFormSection() {
  const t = useTranslations("Contact.form");
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-muted via-background to-muted py-24">
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute left-0 top-24 h-80 w-80 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-104 w-104 translate-x-1/4 translate-y-1/3 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal variant="zoom-in" duration={800}>
          <div className="mx-auto grid max-w-6xl gap-10 rounded-4xl bg-card/85 p-10 shadow-xl backdrop-blur lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-6">
              <ScrollReveal variant="swing-in" delayMs={150} duration={600}>
                <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-muted/40 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  <ClipboardPen className="h-4 w-4" />
                  <span>{t("badge")}</span>
                </div>
              </ScrollReveal>
              <ScrollReveal variant="blur-in" delayMs={250} duration={700}>
                <h2 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
                  {t("title")}
                </h2>
              </ScrollReveal>
              <ScrollReveal variant="fade-up" delayMs={350} duration={600}>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {t("description")}
                </p>
              </ScrollReveal>
              <ScrollReveal variant="slide-up" delayMs={450} duration={700}>
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    {t("cta.title")}
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/appointment?for=self"
                      className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                    >
                      {t("cta.forSelf")}
                    </Link>
                    <Link
                      href="/appointment?for=loved-one"
                      className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:border-primary hover:text-primary"
                    >
                      {t("cta.forLovedOne")}
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="space-y-5">
              {t.raw("reasons").map((reason: string, index: number) => (
                <ScrollReveal
                  key={reason}
                  variant={index === 0 ? "fade-right" : "fade-left"}
                  delayMs={500 + index * 100}
                  duration={600}
                >
                  <div className="flex items-start gap-4 rounded-3xl bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground">
                    <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-foreground text-card">
                      {index === 0 ? (
                        <CalendarCheck className="h-5 w-5" />
                      ) : (
                        <Info className="h-5 w-5" />
                      )}
                    </div>
                    <span>{reason}</span>
                  </div>
                </ScrollReveal>
              ))}

              <ScrollReveal variant="bounce-in" delayMs={700} duration={600}>
                <div className="rounded-3xl border border-dashed border-primary/30 bg-card/70 p-5 text-sm text-muted-foreground">
                  {t("guidance")}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
