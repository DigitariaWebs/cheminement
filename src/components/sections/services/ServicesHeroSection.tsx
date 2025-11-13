"use client";

import { Layers3, Sparkle } from "lucide-react";

export default function ServicesHeroSection() {
  return (
    <section className="relative overflow-hidden bg-accent text-foreground">
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute left-0 top-10 h-80 w-80 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] translate-x-1/3 translate-y-1/4 rounded-full bg-primary/45 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-10">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
              <Layers3 className="h-5 w-5 text-foreground" />
              <span>Nos services</span>
            </div>
            <h1 className="font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
              Un écosystème complet de services en santé mentale pour les
              adultes, les enfants, les familles et les écoles.
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Nous réunissons des professionnels qualifiés et des programmes
              spécialisés pour soutenir chaque personne, à toutes les étapes de
              son parcours. Découvrez comment nous pouvons vous accompagner,
              vous et votre famille.
            </p>
          </div>

          <div className="rounded-4xl bg-card/70 p-8 shadow-xl backdrop-blur">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              <Sparkle className="h-4 w-4" />
              <span>Nos fondations</span>
            </div>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                <span>Des experts qualifiés pour chaque problématique.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                <span>Un jumelage intelligent pour un accompagnement rapide.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                <span>Une plateforme simple et rassurante pour suivre votre parcours.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

