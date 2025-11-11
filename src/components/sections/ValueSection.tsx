"use client";

import { Users, Shield, Heart } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function ValueSection() {
  const t = useTranslations("ValueSection");
  const locale = useLocale();

  const values = [
    {
      icon: Shield,
      titleEn: "Evidence-based care quality",
      titleFr: "Qualité des soins fondée sur des données probantes",
      descriptionEn:
        "Our mental health professionals deliver evidence-based care, avoiding unnecessary and ineffective treatments that delay recovery and drive up benefit costs.",
      descriptionFr:
        "Nos professionnels de la santé mentale fournissent des soins fondés sur des données probantes, évitant les traitements inutiles et inefficaces qui retardent la guérison et augmentent les coûts des prestations.",
      featuresEn: [
        "Accredited and vetted care",
        "Regular clinical audits",
        "Improved health outcomes",
      ],
      featuresFr: [
        "Soins accrédités et vérifiés",
        "Audits cliniques réguliers",
        "Amélioration des résultats de santé",
      ],
    },
    {
      icon: Users,
      titleEn: "Personalized experience",
      titleFr: "Expérience personnalisée",
      descriptionEn:
        "Our in-house primary care, mental health, and EAP practitioners work together to deliver a seamless experience, tailored to each member's unique needs.",
      descriptionFr:
        "Nos praticiens internes en soins primaires, santé mentale et PAE travaillent ensemble pour offrir une expérience fluide, adaptée aux besoins uniques de chaque membre.",
      featuresEn: [
        "Speed up return to function",
        "Guide the member throughout their care journey",
        "Promote proactive, ongoing well-being",
      ],
      featuresFr: [
        "Accélérer le retour aux fonctions",
        "Guider le membre tout au long de son parcours de soins",
        "Promouvoir un bien-être proactif et continu",
      ],
    },
    {
      icon: Heart,
      titleEn: "Integrated Health Platform",
      titleFr: "Plateforme de santé intégrée",
      descriptionEn:
        "Tear down the walls between benefits. Improve team well-being with our integrated platform that centralizes care programs in a single application.",
      descriptionFr:
        "Abattez les murs entre les avantages. Améliorez le bien-être de l'équipe avec notre plateforme intégrée qui centralise les programmes de soins dans une seule application.",
      featuresEn: [
        "24/7/365 access to services",
        "Coordinated care approach",
        "Seamless provider collaboration",
      ],
      featuresFr: [
        "Accès aux services 24h/24, 7j/7, 365j/an",
        "Approche de soins coordonnés",
        "Collaboration transparente entre fournisseurs",
      ],
    },
  ];
  return (
    <section className="relative py-24 bg-linear-to-b from-background via-muted to-accent overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#8b7355] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4a574] rounded-full blur-3xl"></div>
      </div>
      <div
        className="absolute top-0 left-1/3 w-[1200px] h-[1200px] rounded-full animate-fade-in"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.015 75) 0%, oklch(0.92 0.015 75 / 0) 70%)",
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Staggered Grid Layout - Stairs Pattern */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {/* First Column - Starts at top with card */}
          <div className="lg:mt-0">
            <ValueCard value={values[0]} index={0} locale={locale} />
            <div className="-mt-1 relative ">
              <img
                src="/ValueSection.png"
                alt="Inner Child Healing"
                className="w-full h-auto transform scale-x-[-1] scale-110"
              />
              {/* Fading effect at bottom */}
              <div className="absolute -bottom-8 left-0 right-0 h-40 bg-linear-to-t from-accent to-transparent z-10"></div>
            </div>
          </div>

          {/* Second and Third Columns with Header Text on top */}
          <div className="lg:col-span-2">
            {/* Section Header - aligned to start */}
            <div className="text-left mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
                {t("title")}
              </h2>
              <p className="text-xl md:text-2xl text-foreground font-semibold mb-6">
                {t("subtitle")}
              </p>
              <p className="text-base md:text-lg text-muted-foreground font-normal leading-relaxed pb-27">
                {t("description", {
                  integratedPlatform: t("integratedPlatform"),
                })}
              </p>
            </div>

            {/* Nested grid for second and third columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Second Column */}
              <div>
                <ValueCard value={values[1]} index={1} locale={locale} />
              </div>

              {/* Third Column - Starts at half height */}
              <div className="lg:mt-64">
                <ValueCard value={values[2]} index={2} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueCard({
  value,
  index,
  locale,
}: {
  value: {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    titleEn: string;
    titleFr: string;
    descriptionEn: string;
    descriptionFr: string;
    featuresEn: string[];
    featuresFr: string[];
  };
  index: number;
  locale: string;
}) {
  const Icon = value.icon;
  const title = locale === "fr" ? value.titleFr : value.titleEn;
  const description =
    locale === "fr" ? value.descriptionFr : value.descriptionEn;
  const features = locale === "fr" ? value.featuresFr : value.featuresEn;

  return (
    <div
      className="bg-card rounded-3xl p-10 lg:p-12 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-foreground rounded-2xl shrink-0">
          <Icon className="w-8 h-8 text-card" strokeWidth={2} />
        </div>
        <h3 className="text-xl md:text-2xl font-serif font-medium text-foreground leading-tight">
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-xl text-muted-foreground mb-10 leading-relaxed text-justify">
        {description}
      </p>

      {/* Features List - Simple bullets */}
      <ul className="space-y-6">
        {features.map((feature, i) => (
          <li
            key={i}
            className="flex items-center gap-3 text-lg text-card-foreground"
          >
            <span className="w-2 h-2 bg-foreground rounded-full"></span>
            <span className="leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
