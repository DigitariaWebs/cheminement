"use client";

import { Sparkle, Workflow } from "lucide-react";

export default function ApproachesHeroSection() {
  return (
    <section className="relative overflow-hidden bg-accent text-foreground">
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute left-0 top-10 h-80 w-80 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/3 translate-y-1/4 rounded-full bg-primary/50 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-12">
          <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
            <Workflow className="h-5 w-5 text-foreground" />
            <span>Nos approches</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <h1 className="font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
                Une démarche construite autour de vous, par des experts qui vous
                écoutent et s’adaptent à votre réalité.
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                Chaque accompagnement est singulier. Nous combinons une approche
                profondément humaine à des pratiques cliniques reconnues pour
                bâtir un parcours sur mesure, respectueux de votre histoire, de
                vos objectifs et de votre rythme.
              </p>
            </div>

            <div className="rounded-4xl bg-card/70 p-8 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                <Sparkle className="h-4 w-4" />
                <span>Ce que nous défendons</span>
              </div>
              <dl className="mt-6 space-y-5 text-muted-foreground">
                <div>
                  <dt className="font-serif text-lg text-foreground">
                    Respect de la personne
                  </dt>
                  <dd className="text-sm leading-relaxed">
                    Vous êtes au cœur de la démarche, jamais dans un modèle
                    imposé.
                  </dd>
                </div>
                <div>
                  <dt className="font-serif text-lg text-foreground">
                    Rigueur clinique
                  </dt>
                  <dd className="text-sm leading-relaxed">
                    Des approches validées, encadrées et actualisées en continu.
                  </dd>
                </div>
                <div>
                  <dt className="font-serif text-lg text-foreground">
                    Confiance et sécurité
                  </dt>
                  <dd className="text-sm leading-relaxed">
                    Un cadre éthique, confidentiel et rassurant pour avancer.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

