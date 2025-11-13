"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Heart,
  HelpCircle,
  Inbox,
  Link as LinkIcon,
  Mail,
  MapPin,
  Pencil,
  Phone,
  PlayCircle,
  ShieldAlert,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const changeHistory = [
  { date: "12 février 2025", change: "Mise à jour des disponibilités (soir ajouté)", by: "Vous" },
  { date: "04 février 2025", change: "Précision de la problématique : anxiété et sommeil", by: "Vous" },
  { date: "29 janvier 2025", change: "Dossier analysé par l’équipe jumelage", by: "Équipe Je chemine" },
];

const upcomingOptions = [
  "Continuer avec le même professionnel",
  "Être jumelé à un nouveau professionnel",
  "Je ne suis pas certain, aidez-moi à décider",
];

const freeSelfCare = [
  {
    title: "Comprendre l’anxiété",
    description: "Capsule psychoéducative sur les mécanismes et signes de l’anxiété.",
    format: "Article · 8 min",
    icon: BookOpen,
  },
  {
    title: "Respiration 4-7-8",
    description: "Exercice guidé pour vous détendre en moins de cinq minutes.",
    format: "Audio · 6 min",
    icon: Heart,
  },
  {
    title: "Les approches thérapeutiques",
    description: "Comparatif des approches offertes (TCC, humaniste, systémique…).",
    format: "Article · 10 min",
    icon: Sparkles,
  },
  {
    title: "Routine de pleine conscience",
    description: "Mini-programme quotidien pour prendre soin de vous avant la thérapie.",
    format: "PDF · 4 pages",
    icon: Calendar,
  },
];

const paidPrograms = [
  {
    title: "Programme « Anxiété sereine »",
    progress: "40 % complété",
    description: "Parcours guidé de 4 semaines avec vidéos, exercices et journal de suivi.",
    includes: ["4 modules", "8 vidéos", "Journal numérique"],
  },
  {
    title: "Capsules « Apaiser le sommeil »",
    progress: "À commencer",
    description: "Série de capsules audio pour instaurer une routine de sommeil stable.",
    includes: ["6 audios", "1 plan d’action"],
  },
];

const educationalResources = [
  {
    title: "Mieux comprendre le TDAH adulte",
    type: "Article thérapeute",
    link: "#",
  },
  {
    title: "Comment préparer son premier rendez-vous",
    type: "Guide pratique",
    link: "#",
  },
  {
    title: "Prendre soin de soi en période de stress",
    type: "Psychoéducation",
    link: "#",
  },
];

const supportCards = [
  {
    icon: Mail,
    title: "Courriel",
    description: "Écrivez-nous pour toute question ou ajustement.",
    actionLabel: "contact@monimpression.com",
    href: "mailto:contact@monimpression.com",
  },
  {
    icon: HelpCircle,
    title: "FAQ et aide",
    description: "Retrouvez les réponses aux questions fréquentes.",
    actionLabel: "Ouvrir la FAQ",
    href: "#",
  },
  {
    icon: Wallet,
    title: "Facturation & paiements",
    description: "Suivi des factures, reçus et assurances.",
    actionLabel: "Centre de facturation",
    href: "#",
  },
];

const accountSettings = [
  {
    title: "Modifier mon mot de passe",
    description: "Mettre à jour votre mot de passe en toute sécurité.",
    actionLabel: "Mettre à jour",
  },
  {
    title: "Gérer mes notifications",
    description: "Choisir les rappels de rendez-vous et suivis à recevoir.",
    actionLabel: "Configurer",
  },
  {
    title: "Préférences infolettre",
    description: "Choisir les thématiques et la fréquence de nos envois.",
    actionLabel: "Gérer",
  },
  {
    title: "Me désinscrire de la plateforme",
    description: "Mettre fin à votre compte de manière sécurisée.",
    actionLabel: "Commencer la démarche",
  },
  {
    title: "Voir nos conditions & politiques",
    description: "CGV, Politique de confidentialité, RGPD.",
    actionLabel: "Consulter",
  },
];

export default function ClientDashboardPage() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="space-y-10">
      {/* 1. Welcome */}
      <section className="rounded-3xl border border-border/20 bg-linear-to-r from-primary/10 via-card to-card/80 p-8 shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
              Votre espace bien-être
            </p>
            <h1 className="font-serif text-3xl font-light text-foreground lg:text-4xl">
              Bienvenue Jean Pierre !
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              Je chemine est là pour vous accompagner, pas à pas. Nous mettons tout en place pour que
              votre démarche soit humaine, bienveillante et alignée sur vos besoins. Chaque action ici
              est pensée pour soutenir votre cheminement vers une vie plus sereine.
            </p>
            <p className="text-sm font-medium text-primary">
              « Vous avancez déjà. Continuez à votre rythme, nous sommes avec vous. »
            </p>
          </div>
          <div className="rounded-3xl bg-card/70 p-6 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">Votre mission aujourd’hui</p>
            <p className="mt-3">
              Prenez un moment pour respirer profondément, notez votre état d’esprit et explorez un
              outil d’auto-soins ci-dessous.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-10 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          {/* 2. Request Status */}
          <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-light text-foreground">Statut de ma demande</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nous analysons votre profil pour identifier le professionnel le mieux adapté.
                </p>
              </div>
              <span className="rounded-full bg-primary/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                En analyse
              </span>
            </div>

            <div className="mt-6 grid gap-4 rounded-3xl bg-card/70 p-6 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Jumelage pris en charge par l’équipe Je chemine
              </p>
              <p>
                Dernière mise à jour : <span className="font-medium text-foreground">12 février 2025</span>
              </p>
              <p>
                Prochaine étape :{" "}
                <span className="font-medium text-foreground">
                  Confirmation de votre professionnel et proposition de rendez-vous
                </span>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="gap-2 rounded-full px-5 py-5 text-sm font-medium">
                <Pencil className="h-4 w-4" />
                Modifier mon profil
              </Button>
              <Button variant="outline" className="gap-2 rounded-full px-5 py-5 text-sm font-medium">
                <Inbox className="h-4 w-4" />
                Contacter l’équipe jumelage
              </Button>
            </div>

            <div className="mt-6 border-t border-border/40 pt-4">
              <button
                onClick={() => setIsHistoryOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-2xl bg-muted/30 px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted/50"
              >
                <span className="font-medium text-foreground">Historique des changements</span>
                {isHistoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {isHistoryOpen && (
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {changeHistory.map((entry) => (
                    <li key={entry.date} className="rounded-2xl border border-border/30 px-4 py-3">
                      <p className="font-medium text-foreground">{entry.date}</p>
                      <p>{entry.change}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                        {entry.by}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* 3. My Information */}
          <section className="space-y-6 rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-light text-foreground">Mes informations</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Gardez vos données à jour pour faciliter le jumelage et la prise de rendez-vous.
                </p>
              </div>
              <Button variant="outline" className="gap-2 rounded-full px-5 py-5 text-sm font-medium">
                <Pencil className="h-4 w-4" />
                Modifier
              </Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-border/20 bg-card/70 p-5">
                <h3 className="font-serif text-lg text-foreground">Informations personnelles</h3>
                <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <dt>Nom</dt>
                    <dd className="text-foreground">Jean</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Prénom</dt>
                    <dd className="text-foreground">Pierre</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Courriel</dt>
                    <dd className="text-foreground">jean.pierre@email.com</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Langue</dt>
                    <dd className="text-foreground">Français</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Genre</dt>
                    <dd className="text-foreground">Homme</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Âge</dt>
                    <dd className="text-foreground">37 ans</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Qui est concerné ?</dt>
                    <dd className="text-foreground">Moi-même</dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-border/20 bg-card/70 p-5">
                  <h3 className="font-serif text-lg text-foreground">Informations de rendez-vous</h3>
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <p>Disponibilités : <span className="text-foreground">Matin, Soir, Week-end</span></p>
                    <p>Modalité souhaitée : <span className="text-foreground">En ligne</span></p>
                    <p>Localisation : <span className="text-foreground">Montréal, QC</span></p>
                    <p>Note : <span className="text-foreground">Préférence pour un suivi bilingue</span></p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/20 bg-card/70 p-5">
                  <h3 className="font-serif text-lg text-foreground">Données bancaires</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Ajoutez une carte pour confirmer votre premier rendez-vous (aucun paiement ne sera
                    effectué tant que le rendez-vous n’est pas confirmé).
                  </p>
                  <Button className="mt-4 gap-2 rounded-full px-5 py-5 text-sm font-medium">
                    <Wallet className="h-4 w-4" />
                    Gérer mes informations de paiement
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/20 bg-muted/30 p-5">
              <h3 className="font-serif text-lg text-foreground">Mandat / Situation particulière</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
                <span className="rounded-full border border-border/30 px-3 py-1">CNESST</span>
                <span className="rounded-full border border-border/30 px-3 py-1">Revenu Québec</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Vous pouvez modifier cette information si votre situation change (IVAC, SAAQ, MSP…). Cela
                nous aide à vous orienter vers un professionnel qualifié pour ce type de mandat.
              </p>
              <Button variant="outline" className="mt-4 gap-2 rounded-full px-5 py-5 text-sm font-medium">
                <Pencil className="h-4 w-4" />
                Changer le type de mandat
              </Button>
            </div>
          </section>

          {/* 4. Book Appointment */}
          <section className="rounded-3xl border border-border/20 bg-linear-to-br from-primary/10 via-card to-card/70 p-7 shadow-lg">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-light text-foreground">Prendre un rendez-vous</h2>
                <p className="max-w-xl text-sm text-muted-foreground">
                  Lorsque votre jumelage sera confirmé, vous pourrez réserver directement dans notre
                  système. Si vous avez déjà un professionnel attitré, il vous suffit de choisir « continuer
                  avec le même professionnel ».
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-primary">
                  {upcomingOptions.map((option) => (
                    <span key={option} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 uppercase tracking-[0.3em]">
                      {option}
                    </span>
                  ))}
                </div>
              </div>
              <Button className="gap-2 self-start rounded-full px-6 py-5 text-base font-medium">
                <Calendar className="h-4 w-4" />
                Lancer la prise de rendez-vous
              </Button>
            </div>
          </section>

          {/* 5. History & receipts */}
          <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <h2 className="font-serif text-2xl font-light text-foreground">
                  Historique des rendez-vous & reçus
                </h2>
                <p className="text-sm text-muted-foreground">
                  L’agenda, les reçus, la facturation et les dossiers sont gérés via OWL Practice.
                </p>
              </div>
              <Button variant="outline" className="gap-2 rounded-full px-6 py-5 text-base font-medium">
                <LinkIcon className="h-4 w-4" />
                Accéder à OWL Practice
              </Button>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Reçus, paiements et factures
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Historique de présence et d’absences
              </p>
              <p className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Tenue de dossier sécurisée
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* 6. Self care */}
          <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <h2 className="font-serif text-2xl font-light text-foreground">Outils d’auto-soins</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Accédez gratuitement à des ressources pour amorcer votre démarche.
            </p>
            <div className="mt-5 grid gap-4">
              {freeSelfCare.map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-border/20 bg-card/70 p-4 text-sm text-muted-foreground">
                  <item.icon className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p>{item.description}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.3em]">{item.format}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Pour aller plus loin</p>
              <p className="mt-2">
                Explorez nos programmes payants créés par des professionnels de la plateforme.
              </p>
              <Button variant="outline" className="mt-4 gap-2 rounded-full px-4 py-4 text-sm font-medium">
                <PlayCircle className="h-4 w-4" />
                Parcourir les programmes spécialisés
              </Button>
            </div>
          </section>

          {/* 7. Purchased programs */}
          <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <h2 className="font-serif text-2xl font-light text-foreground">Mes programmes</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Retrouvez les contenus que vous avez achetés et suivez votre progression.
            </p>
            <div className="mt-5 space-y-4">
              {paidPrograms.map((program) => (
                <div key={program.title} className="rounded-2xl border border-border/20 bg-card/70 p-5 text-sm text-muted-foreground">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-foreground">{program.title}</p>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                      {program.progress}
                    </span>
                  </div>
                  <p className="mt-2">{program.description}</p>
                  <ul className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
                    {program.includes.map((item) => (
                      <li key={item} className="rounded-full border border-border/30 px-3 py-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-4 gap-2 rounded-full px-4 py-4 text-sm font-medium">
                    <PlayCircle className="h-4 w-4" />
                    Continuer
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Resources */}
          <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <h2 className="font-serif text-2xl font-light text-foreground">Ressources & informations</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Articles, outils et psychoéducation pour mieux comprendre votre parcours.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {educationalResources.map((resource) => (
                <li key={resource.title} className="flex items-center justify-between rounded-2xl border border-border/20 bg-card/70 px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{resource.title}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                      {resource.type}
                    </p>
                  </div>
                  <Button variant="ghost" className="gap-1 text-sm font-medium">
                    Lire <ArrowRight className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </section>

          {/* 9. Support */}
          <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <h2 className="font-serif text-2xl font-light text-foreground">Support & aide</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Une question ? Notre équipe est disponible pour vous guider à chaque étape.
            </p>
            <div className="mt-5 grid gap-4">
              {supportCards.map((card) => (
                <div key={card.title} className="flex items-start gap-4 rounded-2xl border border-border/20 bg-card/70 p-4 text-sm text-muted-foreground">
                  <card.icon className="mt-1 h-5 w-5 text-primary" />
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">{card.title}</p>
                    <p>{card.description}</p>
                    <Link href={card.href} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                      {card.actionLabel} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 10. Emergency */}
          <section className="rounded-3xl border border-border/20 bg-linear-to-br from-accent/20 via-card to-card/80 p-7 text-center shadow-lg">
            <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-sm text-muted-foreground">
              <ShieldAlert className="h-8 w-8 text-primary" />
              <h2 className="font-serif text-xl font-light text-foreground">En cas d’urgence</h2>
              <p>
                Veuillez vous rendre immédiatement au centre médical le plus proche ou contacter les
                services d’urgence (911).
              </p>
            </div>
          </section>

          {/* 11. Account settings */}
          <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <h2 className="font-serif text-2xl font-light text-foreground">Réglages du compte</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Gérez votre compte, vos préférences et vos abonnements.
            </p>
            <div className="mt-5 space-y-3">
              {accountSettings.map((setting) => (
                <div key={setting.title} className="flex items-center justify-between gap-4 rounded-2xl border border-border/20 bg-card/70 px-4 py-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">{setting.title}</p>
                    <p>{setting.description}</p>
                  </div>
                  <Button variant="ghost" className="gap-1 text-sm font-medium">
                    {setting.actionLabel} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* 12. Newsletter */}
          <section className="rounded-3xl border border-border/20 bg-linear-to-r from-primary/10 via-card to-card/80 p-7 shadow-lg">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-muted/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                <Bell className="h-4 w-4" />
                Restez dans la boucle
              </div>
              <h2 className="font-serif text-2xl font-light text-foreground">Infolettre Je chemine</h2>
              <p>
                Recevez des conseils, des ressources exclusives et des nouvelles sur les services qui
                pourraient vous intéresser.
              </p>
              <div className="rounded-2xl border border-border/20 bg-card/70 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                    <Mail className="h-4 w-4" />
                    Saisir mon courriel
                  </div>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full rounded-full border border-border/30 bg-card/80 px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <Button className="gap-2 rounded-full px-5 py-4 text-sm font-medium">
                    S’inscrire
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Vous pouvez modifier vos préférences d’abonnement à tout moment dans les réglages du
                  compte.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

