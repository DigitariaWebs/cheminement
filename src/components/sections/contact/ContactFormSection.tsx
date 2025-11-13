"use client";

import { CalendarCheck, Info, ClipboardPen } from "lucide-react";

const reasons = [
  "Demander un rendez-vous ou planifier une première rencontre.",
  "Obtenir des informations détaillées sur nos approches et services.",
  "Préciser vos besoins, vos objectifs et le contexte de votre démarche.",
  "Recevoir de l’aide pour préparer votre premier rendez-vous.",
];

export default function ContactFormSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-muted via-background to-muted py-24">
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute left-0 top-24 h-80 w-80 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[26rem] w-[26rem] translate-x-1/4 translate-y-1/3 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-4xl bg-card/85 p-10 shadow-xl backdrop-blur lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-muted/40 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              <ClipboardPen className="h-4 w-4" />
              <span>Formulaire de contact</span>
            </div>
            <h2 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
              Vous préférez nous écrire autrement ? Remplissez notre formulaire.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Partagez vos besoins, vos questions et votre disponibilité. Un
              gestionnaire vous contactera dès que possible pour assurer un
              suivi personnalisé.
            </p>
          </div>

          <div className="space-y-5">
            {reasons.map((reason, index) => (
              <div
                key={reason}
                className="flex items-start gap-4 rounded-3xl bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground"
              >
                <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-foreground text-card">
                  {index === 0 ? (
                    <CalendarCheck className="h-5 w-5" />
                  ) : (
                    <Info className="h-5 w-5" />
                  )}
                </div>
                <span>{reason}</span>
              </div>
            ))}

            <div className="rounded-3xl border border-dashed border-primary/30 bg-card/70 p-5 text-sm text-muted-foreground">
              Nous vous orienterons vers le bon professionnel et vous guiderons
              pour bien préparer votre première rencontre.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

