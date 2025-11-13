"use client";

import { LifeBuoy, Compass, Laptop2, Wallet } from "lucide-react";

const supportAreas = [
  {
    icon: Compass,
    title: "Compréhension des services",
    description:
      "Nous vous aidons à explorer votre problématique, à clarifier vos besoins et à identifier les ressources adaptées.",
  },
  {
    icon: Laptop2,
    title: "Fonctionnement des consultations",
    description:
      "Explications détaillées sur les rencontres en ligne ou en bureau, la planification et les suivis.",
  },
  {
    icon: Wallet,
    title: "Facturation et paiements",
    description:
      "Support administratif pour les reçus, les assurances, les plans de paiement et les remboursements.",
  },
];

export default function SupportSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute left-0 top-12 h-72 w-72 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[26rem] w-[26rem] translate-x-1/3 translate-y-1/4 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-4xl border border-border/15 bg-card/85 p-10 shadow-xl backdrop-blur lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-muted/40 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              <LifeBuoy className="h-4 w-4" />
              <span>Support clientèle</span>
            </div>
            <h2 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
              Une équipe présente avant, pendant et après votre parcours.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Nous vous accompagnons dans la compréhension de nos services, le
              fonctionnement des consultations et la gestion administrative.
              Notre objectif : vous offrir un cheminement clair, fluide et
              rassurant.
            </p>
          </div>

          <div className="space-y-4">
            {supportAreas.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-border/15 bg-muted/30 p-6 text-sm leading-relaxed text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/12 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10 flex gap-4">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-foreground text-card">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-foreground">
                      {title}
                    </h3>
                    <p className="mt-2">{description}</p>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Nous pouvons aussi vous orienter vers des ressources externes en
              cas de besoin spécifique.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

