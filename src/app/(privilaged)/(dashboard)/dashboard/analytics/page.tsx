"use client";

import { BarChart3, CalendarClock, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AnalyticsComingSoonPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border/20 bg-linear-to-br from-card via-card/85 to-card/60 p-10 shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-muted/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </div>
            <h1 className="font-serif text-3xl font-light text-foreground lg:text-4xl">
              Les analytics arrivent bientôt.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Nous finalisons un espace analytique pour suivre vos indicateurs clés : taux
              d’engagement, rétention des clients, progression clinique et performances de vos
              ressources marketplace. Notre équipe travaille activement à la mise en place des
              tableaux et exports personnalisés.
            </p>
          </div>

          <div className="rounded-3xl bg-muted/40 p-6 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">Ce qui arrive :</p>
            <ul className="mt-3 space-y-2">
              <li>• Tableaux de bord interactifs</li>
              <li>• Rapports téléchargeables</li>
              <li>• Statistiques par type d’intervention</li>
              <li>• Analyse de la satisfaction clients</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-border/20 bg-card/70 p-8 shadow-inner md:grid-cols-2">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/25 bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            Phase actuelle
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            La collecte des données est prête et nous terminons les interfaces de visualisation. Vous
            verrez progressivement apparaître les premiers rapports au fur et à mesure des itérations
            produit.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-3xl border border-dashed border-primary/30 bg-card/80 px-5 py-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Vous avez des besoins précis ?</p>
            <p className="mt-1">
              Dites-nous quels indicateurs vous souhaitez prioriser et nous les intégrerons dans la
              feuille de route.
            </p>
          </div>
          <Button asChild className="gap-2 rounded-full px-5 py-5 text-base font-medium">
            <Link href="mailto:contact@monimpression.com">
              <Mail className="h-4 w-4" />
              Écrire à l’équipe produit
            </Link>
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-border/30 bg-card/70 p-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          <Sparkles className="mx-auto h-6 w-6 text-primary" />
          <p>
            Merci de votre patience — cette fonctionnalité sera activée dès le lancement de la
            plateforme complète. Nous vous avertirons via courriel et dans le tableau de bord.
          </p>
        </div>
      </section>
    </div>
  );
}

