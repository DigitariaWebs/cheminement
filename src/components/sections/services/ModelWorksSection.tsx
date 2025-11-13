"use client";

import { CheckCircle2 } from "lucide-react";

const reasons = [
  "Des experts qualifiés et encadrés",
  "Une approche profondément humaine",
  "Un jumelage intelligent qui fait gagner du temps",
  "Un accès rapide aux services pertinents",
  "Des offres variées pour chaque besoin",
  "Une flexibilité totale (en ligne et en personne)",
  "Un accompagnement éducatif pour soutenir la thérapie",
  "Une plateforme simple, rassurante et sécurisée",
];

export default function ModelWorksSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-accent via-muted to-background py-24">
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-10 bottom-0 h-72 w-72 translate-y-1/4 rounded-full bg-primary/60 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-4xl rounded-[3rem] bg-card/80 p-12 text-center shadow-xl backdrop-blur">
          <h2 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
            Pourquoi notre modèle fonctionne
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Que vous amorciez un premier pas ou poursuiviez un suivi déjà
            entamé, Je chemine vous offre un espace fiable pour avancer.
          </p>
          <div className="mt-10 grid gap-4 text-left text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
            {reasons.map((reason) => (
              <div
                key={reason}
                className="flex items-start gap-3 rounded-3xl bg-muted/40 p-4"
              >
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

