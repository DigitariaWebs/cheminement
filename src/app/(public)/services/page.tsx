import {
  ComplementaryServicesSection,
  ModelWorksSection,
  SentiersProgramSection,
  ServicesHeroSection,
  TherapySpectrumSection,
} from "@/components/sections/services";

export default function ServicesPage() {
  return (
    <main className="bg-background">
      <ServicesHeroSection />
      <TherapySpectrumSection />
      <SentiersProgramSection />
      <ComplementaryServicesSection />
      <ModelWorksSection />
    </main>
  );
}
