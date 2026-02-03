"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import {
  Brain,
  CheckCircle,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Shield,
  Stethoscope,
  UserRound,
  Users,
  Video,
  AlertCircle,
  Flame,
  Zap,
  Heart,
  Sparkles,
  BookOpen,
  Baby,
  Smile,
  MoreHorizontal,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { AnimationVariant } from "@/components/ui/ScrollReveal";

export default function ClientAdvantagesSection() {
  const t = useTranslations("ClientAdvantagesSection");
  const locale = useLocale();

  // Mapping des topics aux icônes
  const topicIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    // Français
    "Anxiété": AlertCircle,
    "Épuisement": Flame,
    "Stress": Zap,
    "Dépression": Heart,
    "Estime de soi": Sparkles,
    "TDAH": Brain,
    "HPI": Sparkles,
    "rôle parental": Baby,
    "difficultés d'apprentissage": BookOpen,
    "gestion des émotions": Smile,
    "autres problématiques": MoreHorizontal,
    // Anglais
    "Anxiety": AlertCircle,
    "Burnout": Flame,
    "Depression": Heart,
    "Self-esteem": Sparkles,
    "ADHD": Brain,
    "High Intellectual Potential": Sparkles,
    "parenting role": Baby,
    "learning difficulties": BookOpen,
    "emotion management": Smile,
    "other issues": MoreHorizontal,
  };

  const advantages = [
    {
      icon: Shield,
      titleKey: "confidentiality.title",
      descriptionKey: "confidentiality.description",
    },
  ];

  const professionals = [
    {
      titleKey: "professionals.psychologist",
      icon: UserRound,
      image: "/professionals/psychologist.jpg",
    },
    {
      titleKey: "professionals.neuropsychologist",
      icon: Brain,
      image: "/professionals/neuropsychologist.jpg",
    },
    {
      titleKey: "professionals.psychotherapist",
      icon: HeartPulse,
      image: "/professionals/psychotherapist.jpg",
    },
    {
      titleKey: "professionals.psychoeducator",
      icon: GraduationCap,
      image: "/professionals/psychoeducator.jpg",
    },
    {
      titleKey: "professionals.occupationalTherapistMentalHealth",
      icon: HandHeart,
      image: "/professionals/occupational-therapist.jpg",
    },
    {
      titleKey: "professionals.psychiatrist",
      icon: Stethoscope,
      image: "/professionals/psychiatrist.jpg",
    },
    {
      titleKey: "professionals.otherProfessionals",
      icon: Users,
      image: "/professionals/other-professionals.jpg",
    },
  ];

  const cardAnimations: AnimationVariant[] = [
    "fade-right",
    "zoom-in",
    "fade-left",
    "slide-up",
    "rotate-in",
    "blur-in",
    "swing-in",
  ];

  return (
    <section className="relative py-24 bg-linear-to-b from-muted via-card to-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-down" duration={700}>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold text-primary uppercase tracking-widest mb-4">
              {t("badge")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
              {t("title")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Hero Image */}
        <ScrollReveal variant="zoom-in" delayMs={200} duration={800}>
          <div className="mb-16 mx-auto max-w-4xl">
            <div className="relative aspect-21/9 rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/PatientTestimonialHappy.jpg"
                alt="Happy patient using health platform"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8 max-w-6xl mx-auto mb-24">
          {advantages.map((advantage, index) => (
            <ScrollReveal
              key={index}
              variant={cardAnimations[index % cardAnimations.length]}
              delayMs={300 + index * 100}
              duration={700}
            >
              <div className="bg-card rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border">
                <div className="mb-6">
                  <div className="p-4 bg-foreground rounded-2xl inline-block">
                    <advantage.icon
                      className="w-8 h-8 text-background"
                      strokeWidth={2}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-4">
                  {t(advantage.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(advantage.descriptionKey)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Educational Content Highlight */}
        <ScrollReveal variant="slide-left" delayMs={400} duration={800}>
          <div className="bg-linear-to-br from-accent/20 via-accent/10 to-transparent rounded-3xl p-8 md:p-12 mb-24 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                <div className="p-6 bg-foreground rounded-3xl">
                  <Video
                    className="w-12 h-12 text-background"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                  {t("educationalHighlight.title")}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  {t("educationalHighlight.description")}
                </p>
                {/* Topics List with Icons */}
                <div className="mb-4">
                  <ul className="flex flex-wrap gap-3 mb-2">
                    {t("educationalHighlight.topics")
                      .split(",")
                      .map((topic: string) => topic.trim())
                      .filter((topic: string) => topic.length > 0)
                      .map((topic: string, index: number) => {
                        const IconComponent =
                          topicIcons[topic] || MoreHorizontal;
                        return (
                          <li
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-200"
                          >
                            <div className="p-1 bg-primary/10 rounded-full">
                              <IconComponent className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            </div>
                            <span className="text-sm text-foreground/80 font-medium">
                              {topic}
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t("educationalHighlight.note")}
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {t("educationalHighlight.programDescription")}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Professionals Section */}
        <ScrollReveal variant="fade-up" delayMs={500} duration={700}>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
              {t("professionalsSection.title")}
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("professionalsSection.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Professionals Grid with Photos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6 max-w-6xl mx-auto">
          {professionals.map((professional, index) => (
            <ScrollReveal
              key={index}
              variant="zoom-in"
              delayMs={600 + index * 80}
              duration={500}
            >
              <div className="group relative">
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-muted shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  {/* Placeholder image - replace with actual professional photos */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-accent/40 to-primary/10 flex items-center justify-center">
                    <div className="p-4 bg-primary/10 rounded-2xl backdrop-blur-sm border border-primary/20">
                      <professional.icon
                        className="w-10 h-10 text-primary"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-primary/95 via-primary/80 to-transparent"></div>
                  {/* Title */}
                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                    <h4 className="text-xs md:text-sm font-semibold text-white text-center leading-tight drop-shadow-lg">
                      {t(professional.titleKey)}
                    </h4>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust Indicators */}
        <ScrollReveal variant="bounce-in" delayMs={900} duration={700}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm">{t("trustIndicators.licensed")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm">{t("trustIndicators.supervised")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm">
                {t("trustIndicators.confidential")}
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
