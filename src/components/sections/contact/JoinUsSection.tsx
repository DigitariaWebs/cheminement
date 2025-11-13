"use client";

import { Briefcase, ShieldPlus, ClipboardCheck, Workflow, Sparkles } from "lucide-react";

const highlights = [
  {
    icon: ShieldPlus,
    title: "Jumelage intelligent",
    description:
      "Rencontrez des clients qui correspondent à votre expertise et à votre style d’intervention.",
  },
  {
    icon: ClipboardCheck,
    title: "Support administratif",
    description:
      "Planification, facturation et suivi : concentrez-vous sur la clinique, nous gérons le reste.",
  },
  {
    icon: Workflow,
    title: "Outils de pratique & mentorat",
    description:
      "Accès à des outils de gestion, à du mentorat, de la supervision et au programme Je Diversifie.",
  },
  {
    icon: Sparkles,
    title: "Modèle flexible",
    description:
      "Travaillez selon votre disponibilité, en ligne ou en bureau, avec un soutien constant de l’équipe.",
  },
];

export default function JoinUsSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute left-0 top-12 h-72 w-72 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[26rem] w-[26rem] translate-x-1/3 translate-y-1/4 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-6xl space-y-12 rounded-4xl border border-border/15 bg-card/85 p-10 shadow-xl backdrop-blur">
          <header className="flex flex-col gap-4 text-center">
            <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-primary/30 bg-muted/40 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>Professionnels – joignez-vous à nous</span>
            </div>
            <h2 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
              Psychologue, psychothérapeute, psychoéducateur, TES ou spécialiste
              scolaire ?
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Écrivez-nous à{" "}
              <span className="font-medium text-foreground">
                contact@monimpression.com
              </span>{" "}
              pour découvrir comment notre plateforme peut soutenir votre
              pratique.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-border/15 bg-muted/30 p-6 text-left text-sm leading-relaxed text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/12 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-card">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-foreground">
                    {title}
                  </h3>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

