"use client";

import {
  Brain,
  Flower2,
  Layers,
  Orbit,
  Sparkles,
  UsersRound,
  Waves,
  Workflow,
} from "lucide-react";

const approaches = [
  {
    icon: Layers,
    title: "Thérapies cognitivo-comportementales (TCC)",
    description:
      "Des outils éprouvés pour agir sur les pensées, comportements et émotions qui vous freinent.",
  },
  {
    icon: Orbit,
    title: "Approches psychodynamiques",
    description:
      "Comprendre vos dynamiques profondes et vos schémas relationnels pour transformer durablement.",
  },
  {
    icon: UsersRound,
    title: "Approches systémiques",
    description:
      "Famille, couple, groupes : intervenir sur les interactions pour rétablir un équilibre collectif.",
  },
  {
    icon: Flower2,
    title: "Approches humanistes",
    description:
      "Une présence authentique, empathique et non jugeante pour favoriser votre autonomie.",
  },
  {
    icon: Waves,
    title: "Mindfulness / Pleine conscience",
    description:
      "Renforcer l’attention, la régulation émotionnelle et la connexion à soi par des pratiques guidées.",
  },
  {
    icon: Workflow,
    title: "Psychoéducation",
    description:
      "Un accompagnement structuré pour comprendre, s’outiller et mettre en place des stratégies adaptées.",
  },
  {
    icon: Brain,
    title: "Interventions scolaires et neuropsychologiques",
    description:
      "Évaluations, plans d’intervention et suivis spécialisés pour soutenir la réussite éducative.",
  },
  {
    icon: Sparkles,
    title: "Coaching parental & Guidance spécialisée",
    description:
      "Un soutien concret pour le TDAH, l’anxiété, la gestion des émotions, les comportements opposants, etc.",
  },
];

export default function ClinicalApproachesSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-muted via-background to-muted py-24">
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute left-0 top-24 h-72 w-72 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[26rem] w-[26rem] translate-x-1/3 translate-y-1/3 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
            2 · Approches reconnues et encadrées
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
            Des modèles cliniques validés, portés par des experts reconnus.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Nos professionnels pratiquent selon des approches scientifiquement
            reconnues et encadrées par leurs ordres professionnels. Chaque
            méthode est choisie spécifiquement pour votre situation.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {approaches.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-4xl border border-border/15 bg-card/85 p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-primary/15 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 space-y-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-card">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

