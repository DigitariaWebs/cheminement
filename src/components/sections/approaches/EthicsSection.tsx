"use client";

import { ShieldCheck, LockKeyhole, ClipboardCheck, Scale } from "lucide-react";

const commitments = [
  {
    icon: ShieldCheck,
    title: "Respect des règles déontologiques",
    description:
      "Nos intervenants respectent les codes éthiques de leurs ordres professionnels et s’assurent de protéger votre dignité.",
  },
  {
    icon: ClipboardCheck,
    title: "Conformité à la Loi 25",
    description:
      "Nous appliquons des politiques strictes pour la protection de vos données personnelles et sensibles.",
  },
  {
    icon: LockKeyhole,
    title: "Gestion sécurisée des informations",
    description:
      "Des systèmes technologiques robustes et des processus internes rigoureux pour garantir la confidentialité.",
  },
  {
    icon: Scale,
    title: "Confidentialité absolue",
    description:
      "Votre démarche est protégée : échanges, documents et suivis sont strictement confidentiels.",
  },
];

export default function EthicsSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute left-0 top-10 h-72 w-72 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] translate-x-1/4 translate-y-1/3 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
              3 · Éthique et confidentialité
            </p>
            <h2 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
              Nous protégeons votre confiance, à chaque instant.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              La confidentialité n’est pas une option, c’est notre fondation.
              Nous avons conçu notre plateforme et nos processus pour assurer
              une protection maximale de votre vie privée, du premier contact à
              la clôture de votre dossier.
            </p>
            <div className="rounded-3xl bg-muted/40 p-6 text-sm leading-relaxed text-muted-foreground">
              Chaque professionnel est signataire d’engagements précis en matière
              de protection des données et bénéficie d’une formation continue sur
              la confidentialité.
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {commitments.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-4xl border border-border/15 bg-card/85 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-card">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-medium text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

