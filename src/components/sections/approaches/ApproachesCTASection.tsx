"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Calendar, BookOpen, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ApproachesCTASection() {
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-background via-muted/30 to-background py-24">
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute left-0 top-16 h-80 w-80 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-104 w-104 translate-x-1/4 translate-y-1/3 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal variant="zoom-in" duration={800}>
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal variant="fade-up" delayMs={100} duration={600}>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-foreground mb-6">
                {locale === "fr"
                  ? "Prêt à commencer votre parcours ?"
                  : "Ready to Start Your Journey?"}
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delayMs={200} duration={600}>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-light">
                {locale === "fr"
                  ? "Découvrez nos approches thérapeutiques et trouvez le professionnel qui correspond à vos besoins."
                  : "Discover our therapeutic approaches and find the professional that matches your needs."}
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delayMs={300} duration={600}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/appointment"
                  className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="relative z-10">
                    {locale === "fr"
                      ? "Prendre un rendez-vous"
                      : "Book an Appointment"}
                  </span>
                  <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>

                <Link
                  href="/book"
                  className="group flex items-center gap-3 px-8 py-5 text-foreground text-lg font-light tracking-wide transition-all duration-300 hover:gap-4 border border-muted-foreground/20 rounded-full hover:bg-muted/50"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>
                    {locale === "fr"
                      ? "Explorez les ressources"
                      : "Explore Resources"}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
