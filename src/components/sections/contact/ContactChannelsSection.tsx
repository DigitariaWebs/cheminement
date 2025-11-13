"use client";

import { Mail, Info, Users, ClipboardList, Wallet } from "lucide-react";

const inquiries = [
  {
    icon: Info,
    title: "Services et approches",
    description:
      "Comprendre nos services, nos approches cliniques et les modalités disponibles.",
  },
  {
    icon: Users,
    title: "Jumelage avec un professionnel",
    description:
      "Identifier la personne la mieux adaptée à votre problématique et à vos préférences.",
  },
  {
    icon: ClipboardList,
    title: "Programme Sentiers",
    description:
      "Obtenir des informations sur l’accompagnement dédié aux enfants, adolescents et écoles.",
  },
  {
    icon: Wallet,
    title: "Profil, facturation et support",
    description:
      "Créer ou mettre à jour votre profil, recevoir de l’aide administrative ou des précisions sur la facturation.",
  },
];

export default function ContactChannelsSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute left-10 top-0 h-72 w-72 rounded-full bg-accent blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[26rem] w-[26rem] translate-x-1/3 translate-y-1/3 rounded-full bg-primary/40 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-6xl space-y-12">
          <header className="grid gap-6 rounded-4xl bg-card/80 px-8 py-10 shadow-xl backdrop-blur md:grid-cols-[1fr_1fr] md:items-center">
            <div className="space-y-3 text-left">
              <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
                Contactez-nous
              </p>
              <h2 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
                Un courriel suffit pour amorcer la conversation.
              </h2>
            </div>
            <div className="flex items-center gap-4 rounded-3xl border border-primary/30 bg-muted/40 px-6 py-4 text-sm font-medium text-muted-foreground">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Écrivez-nous
                </p>
                <p className="text-base text-foreground">contact@monimpression.com</p>
              </div>
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {inquiries.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-4xl border border-border/15 bg-card/85 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-card">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            Nous répondons à chaque message dans les meilleurs délais et
            planifions, au besoin, un appel d’exploration pour préciser vos
            attentes.
          </p>
        </div>
      </div>
    </section>
  );
}

