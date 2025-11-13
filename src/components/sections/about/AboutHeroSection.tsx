"use client";

import { HeartHandshake } from "lucide-react";

export default function AboutHeroSection() {
  return (
    <section className="relative overflow-hidden bg-accent text-foreground">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-[32rem] -translate-x-1/3 translate-y-1/3 rounded-full bg-primary/30 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-muted-foreground/70">
            <HeartHandshake className="h-5 w-5 text-foreground" />
            <span>Qui nous sommes</span>
          </div>

          <div className="space-y-8 text-left">
            <h1 className="font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
              Chez Je chemine, nous croyons que chaque personne mérite un
              accompagnement humain, sécuritaire et adapté à sa réalité.
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Notre mission est de vous soutenir dans votre bien-être émotionnel
              et psychologique grâce à un parcours personnalisé, conçu pour
              répondre à vos besoins uniques et à votre rythme. Nous offrons un
              accès simple et bienveillant à une équipe d&apos;experts dont la
              pratique est encadrée, reconnue et conforme aux exigences de leur
              ordre professionnel.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Quelle que soit votre situation, vous êtes accompagné par un
              professionnel qualifié, prêt à cheminer avec vous vers une vie
              plus sereine, équilibrée et épanouie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

