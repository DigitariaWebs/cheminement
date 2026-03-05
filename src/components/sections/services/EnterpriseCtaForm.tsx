"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function EnterpriseCtaForm() {
  const t = useTranslations("Services.enterpriseCta");

  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute left-0 top-20 h-80 w-80 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-104 w-104 translate-x-1/3 translate-y-1/3 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-md">
          <ScrollReveal variant="fade-up" duration={700}>
            <div className="rounded-4xl border border-border/20 bg-card/85 p-8 shadow-xl flex flex-col items-center justify-center text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                <Users className="h-7 w-7" />
              </div>
              <h4 className="text-xl font-serif font-medium text-foreground mb-4">
                {t("parentTitle")}
              </h4>
              <p className="text-sm text-muted-foreground mb-8">
                {t("parentDescription")}
              </p>
              <Link href="/appointment?for=loved-one" className="w-full">
                <Button size="lg" className="w-full">
                  {t("parentButton")}
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
