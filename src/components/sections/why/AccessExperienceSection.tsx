"use client";

import { Video, Building2, LayoutDashboard, Compass, Headset } from "lucide-react";

const modes = [
  {
    icon: Video,
    title: "À distance",
    description:
      "Accédez à un soutien professionnel via des appels vidéo sécurisés, peu importe où vous vous trouvez — à la maison, au travail, en déplacement ou en région éloignée.",
    highlight: "Souplesse totale et continuité des suivis.",
  },
  {
    icon: Building2,
    title: "En bureau",
    description:
      "Profitez d’un environnement chaleureux et professionnel pour un contact direct, si vous préférez une approche en personne.",
    highlight: "Un espace accueillant, confidentiel et serein.",
  },
];

const experienceHighlights = [
  {
    icon: LayoutDashboard,
    title: "Navigation intuitive",
    description:
      "Une interface claire qui simplifie chaque action et vous guide sans effort.",
  },
  {
    icon: Compass,
    title: "Accès rapide",
    description:
      "Retrouvez immédiatement les services pertinents et adaptez votre parcours à vos besoins.",
  },
  {
    icon: Headset,
    title: "Accompagnement continu",
    description:
      "Notre équipe est disponible pour vous épauler, répondre à vos questions et vous rassurer.",
  },
];

export default function AccessExperienceSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-muted via-background to-muted py-24">
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute left-0 top-24 h-80 w-80 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/3 translate-y-1/4 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-6xl space-y-16">
          <header className="text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
              Accessible où que vous soyez, quand vous en avez besoin
            </p>
            <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
              Vous choisissez la modalité qui vous convient, nous assurons la
              qualité de l’expérience.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Nous éliminons les barrières qui empêchent de consulter et
              simplifions votre cheminement grâce à une plateforme pensée pour
              vous. Vous choisissez l’option qui vous convient le mieux, nous
              vous accompagnons avec la même qualité de soins.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-6 md:grid-cols-2">
              {modes.map(({ icon: Icon, title, description, highlight }) => (
                <div
                  key={title}
                  className="relative overflow-hidden rounded-4xl border border-border/20 bg-card/90 p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />
                  <div className="relative z-10 flex h-full flex-col gap-5">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-card shadow-md">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-xl font-medium text-foreground">
                      {title}
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                    <div className="mt-auto rounded-2xl bg-muted/40 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                      {highlight}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex h-full flex-col justify-between gap-6 rounded-4xl bg-card/80 p-8 shadow-xl backdrop-blur">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground/70">
                  Une plateforme simple, humaine et conçue pour vous
                </p>
                <h3 className="mt-4 font-serif text-2xl font-medium text-foreground">
                  Votre démarche est fluide, rassurante et soutenue en continu.
                </h3>
              </div>
              <div className="space-y-6">
                {experienceHighlights.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-4 rounded-3xl bg-muted/30 p-5">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground/90 text-card">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-serif text-lg font-medium text-foreground">
                        {title}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

