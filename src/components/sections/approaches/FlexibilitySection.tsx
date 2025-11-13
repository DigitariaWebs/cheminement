"use client";

import { Video, Building2, Clock, MapPin } from "lucide-react";

const modalities = [
  {
    icon: Video,
    title: "Consultations en ligne",
    bullets: [
      "Appels vidéo sécurisés, cryptés et simples à rejoindre",
      "Aucun déplacement requis, idéal pour les horaires chargés",
      "Accessibles partout, même en région éloignée",
    ],
  },
  {
    icon: Building2,
    title: "Consultations en bureau",
    bullets: [
      "Rencontres en personne dans un cadre chaleureux",
      "Pour ceux qui préfèrent un contact direct",
      "Des espaces pensés pour la confidentialité et le confort",
    ],
  },
];

export default function FlexibilitySection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-muted via-background to-muted py-24">
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute left-0 top-24 h-80 w-80 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[26rem] w-[26rem] translate-x-1/4 translate-y-1/3 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
            4 · Flexibilité : où et quand vous le souhaitez
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
            Choisissez le mode d’accompagnement qui correspond à votre réalité.
          </h2>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1fr]">
          {modalities.map(({ icon: Icon, title, bullets }) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-4xl border border-border/15 bg-card/85 p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />
              <div className="relative z-10 space-y-5 text-left">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-card">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground">
                  {title}
                </h3>
                <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-4xl border border-dashed border-primary/30 bg-card/70 p-8 shadow-inner sm:grid-cols-3">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Souplesse horaire</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Accessibilité partout</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nous ajustons la planification et la logistique selon vos besoins
            pour vous offrir une expérience fluide et rassurante.
          </p>
        </div>
      </div>
    </section>
  );
}

