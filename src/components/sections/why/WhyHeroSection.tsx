"use client";

import { Sparkle, ShieldPlus } from "lucide-react";

export default function WhyHeroSection() {
  return (
    <section className="relative overflow-hidden bg-accent text-foreground">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 left-16 h-64 w-64 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/3 translate-y-1/4 rounded-full bg-primary/40 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-muted-foreground/70">
            <ShieldPlus className="h-5 w-5 text-foreground" />
            <span>Pourquoi nous choisir</span>
          </div>

          <div className="space-y-8 text-left">
            <h1 className="font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
              Choisir Je chemine, c’est choisir une approche humaine,
              professionnelle et structurée pour prendre soin de votre santé
              mentale.
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Notre plateforme a été pensée pour éliminer les obstacles,
              simplifier l’accès à l’aide et vous accompagner à chaque étape de
              votre démarche. Nous avançons avec vous, à votre rythme, pour que
              chaque interaction soit fluide, rassurante et profondément
              humaine.
            </p>
            <div className="flex items-center gap-3 text-base font-medium uppercase tracking-[0.3em] text-muted-foreground">
              <Sparkle className="h-4 w-4" />
              <span>Une expérience bâtie sur la confiance et la bienveillance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

