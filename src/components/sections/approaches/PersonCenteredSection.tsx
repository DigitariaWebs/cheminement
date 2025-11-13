"use client";

import { Compass, Feather, HeartHandshake } from "lucide-react";

const focusItems = [
  {
    icon: HeartHandshake,
    title: "Vos objectifs",
    description:
      "Clarifiez ce que vous souhaitez transformer, améliorer ou consolider pour orienter chaque séance.",
  },
  {
    icon: Compass,
    title: "Votre problématique",
    description:
      "Nous analysons finement vos enjeux pour proposer des interventions alignées sur votre réalité.",
  },
  {
    icon: Feather,
    title: "Votre style relationnel",
    description:
      "Nous adaptons notre présence, notre rythme et notre langage à votre manière d’entrer en relation.",
  },
];

export default function PersonCenteredSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute left-12 top-0 h-72 w-72 rounded-full bg-accent blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[26rem] w-[26rem] translate-x-1/3 translate-y-1/4 rounded-full bg-primary/40 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
              1 · Une approche centrée sur la personne
            </p>
            <h2 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
              Nous adaptons notre soutien à vos besoins, pas l’inverse.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Chaque individu a une histoire, un rythme, une sensibilité.
              Construire un parcours thérapeutique sur mesure signifie permettre
              à votre voix d’être entendue, vos préférences d’être respectées et
              votre rythme d’être suivi, sans modèle préfabriqué.
            </p>
            <div className="rounded-3xl bg-muted/40 p-6 text-sm leading-relaxed text-muted-foreground">
              Inspiré de notre concept de parcours personnalisé : une démarche
              unique, des ajustements continus, un accompagnement évolutif.
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {focusItems.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-4xl border border-border/10 bg-card/85 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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

            <div className="rounded-4xl border border-dashed border-primary/40 bg-card/60 p-6 shadow-inner sm:col-span-2">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Vos préférences thérapeutiques
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Nous ajustons les méthodes, les outils et la structure des
                rencontres afin que vous vous sentiez reconnu et respecté à
                chaque étape.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

