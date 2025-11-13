"use client";

import { HeartHandshake, Users, Baby, Brain } from "lucide-react";

const supports = [
  {
    icon: HeartHandshake,
    title: "Psychothérapie adulte",
    description:
      "Un accompagnement individualisé pour traverser vos défis personnels et émotionnels.",
  },
  {
    icon: Users,
    title: "Thérapie familiale",
    description:
      "Des espaces de dialogue pour renforcer les liens, apaiser les tensions et avancer ensemble.",
  },
  {
    icon: Brain,
    title: "Évaluation scolaire et TDAH",
    description:
      "Des évaluations complètes et un plan d’action adapté aux besoins spécifiques de chaque enfant.",
  },
  {
    icon: Baby,
    title: "Soutien parental et psychoéducation",
    description:
      "Des outils concrets pour soutenir le développement de votre enfant et votre rôle de parent.",
  },
];

export default function FamilySupportSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-accent/25 via-muted to-background py-24">
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute left-0 top-16 h-80 w-80 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[26rem] w-[26rem] translate-x-1/4 translate-y-1/3 rounded-full bg-primary/60 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6 rounded-4xl bg-card/70 p-10 shadow-xl backdrop-blur">
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
              Un soutien pour toute la famille
            </p>
            <h2 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
              Peu importe votre défi, nous avons un professionnel pour vous
              aider.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Psychothérapie adulte, thérapie familiale, évaluation scolaire,
              accompagnement pour le TDAH, soutien parental ou psychoéducation :
              chaque membre de votre famille peut trouver sa place et recevoir
              l’aide nécessaire.
            </p>
            <div className="rounded-3xl bg-muted/30 p-6 text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Une approche coordonnée pour toute la famille.
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {supports.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl border border-border/10 bg-card/85 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-card">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

