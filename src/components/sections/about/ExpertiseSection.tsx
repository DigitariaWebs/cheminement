"use client";

import { ShieldCheck, LibraryBig } from "lucide-react";
import type { ReactNode } from "react";

export default function ExpertiseSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-muted via-background to-muted py-24">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-0 top-20 h-48 w-48 -translate-x-1/2 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-10 top-1/3 h-80 w-80 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
              <ShieldCheck className="h-5 w-5 text-foreground" />
              <span>Une expertise encadrée et reconnue</span>
            </div>
            <h2 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
              Éthique, rigueur et confidentialité au cœur de chaque échange.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Nous nous engageons à protéger votre vie privée et vos
              informations personnelles conformément aux règles en vigueur,
              notamment la Loi&nbsp;25. Chaque intervention repose sur des
              standards rigoureux et un profond respect de votre dignité.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Que vous consultiez un psychologue, un psychothérapeute ou un
              autre professionnel, vous avez la certitude d&apos;être accompagné
              par un expert qualifié, reconnu par son ordre professionnel.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <ExpertiseCard
              icon={<ShieldCheck className="h-6 w-6 text-card" />}
              title="Respect de la confidentialité"
              description="Protection stricte de vos informations sensibles et respect des normes déontologiques."
            />
            <ExpertiseCard
              icon={<LibraryBig className="h-6 w-6 text-card" />}
              title="Qualité professionnelle"
              description="Pratiques encadrées, supervision rigoureuse et formation continue pour chaque intervenant."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpertiseCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl bg-card/80 p-6 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-foreground p-3">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-medium text-foreground">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

