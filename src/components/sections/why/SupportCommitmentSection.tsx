"use client";

import { Heart } from "lucide-react";

export default function SupportCommitmentSection() {
  return (
    <section className="relative overflow-hidden bg-accent py-24 text-foreground">
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 translate-y-1/3 rounded-full bg-primary/60 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-4xl rounded-[3rem] bg-card/70 p-12 text-center shadow-xl backdrop-blur">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-card">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-3xl font-medium leading-tight md:text-4xl">
            Vous n’êtes plus seul.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Avec Je chemine, vous bénéficiez d’un appui constant pour avancer
            vers une vie plus sereine et équilibrée. Nous marchons avec vous —
            à votre rythme — vers ce qui est important pour vous.
          </p>
        </div>
      </div>
    </section>
  );
}

