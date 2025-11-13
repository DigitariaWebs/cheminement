"use client";

import {
  HeartPulse,
  Baby,
  Users,
  HeartHandshake,
  Compass,
} from "lucide-react";

const services = [
  {
    icon: HeartPulse,
    title: "Psychothérapie adulte",
    description:
      "Accompagnement pour la dépression, l’anxiété, le stress post-traumatique, les troubles obsessionnels-compulsifs, le trouble panique, le TDAH (évaluation & suivi), la gestion des émotions, l’estime de soi, les défis relationnels et l’adaptation aux transitions de vie.",
  },
  {
    icon: Baby,
    title: "Psychothérapie enfant & adolescent",
    description:
      "Interventions ciblées pour les difficultés d’apprentissage, les troubles du comportement, le TDAH, l’anxiété, le trouble oppositionnel avec provocation, la gestion des émotions, les relations sociales et l’estime de soi.",
  },
  {
    icon: Users,
    title: "Thérapie familiale",
    description:
      "Comprendre les dynamiques, restaurer la communication et construire un climat plus harmonieux pour avancer ensemble.",
  },
  {
    icon: HeartHandshake,
    title: "Thérapie de couple",
    description:
      "Naviguer les conflits, renforcer la connexion, mieux communiquer et bâtir une relation respectueuse et stable.",
  },
  {
    icon: Compass,
    title: "Coaching parental",
    description:
      "Un accompagnement pour mieux comprendre le développement de votre enfant, gérer les défis comportementaux, les émotions, l’encadrement positif et la continuité entre école et maison.",
  },
];

export default function TherapySpectrumSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute left-10 top-0 h-72 w-72 rounded-full bg-accent blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[26rem] w-[26rem] translate-x-1/3 translate-y-1/4 rounded-full bg-primary/40 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
            1 · Une couverture complète des besoins thérapeutiques
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
            Des services dédiés aux adultes, enfants, couples et familles.
          </h2>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {services.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-4xl border border-border/15 bg-card/85 p-8 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/12 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-card">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

