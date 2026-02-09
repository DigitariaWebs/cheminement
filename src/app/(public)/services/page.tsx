import {
  SentiersProgramSection,
  ServicesHeroSection,
  ServiceProgramsSection,
  WorkplaceSection,
  ComplementaryServicesSection,
} from "@/components/sections/services";
import ColorTransition from "@/components/ui/ColorTransition";

export default function ServicesPage() {
  return (
    <main>
      <ServicesHeroSection />
      <ColorTransition fromColor="accent" toColor="background" />
      <ServiceProgramsSection />
      <ColorTransition fromColor="background" toColor="muted" />
      <WorkplaceSection />
      <ColorTransition fromColor="muted" toColor="muted" />
      <SentiersProgramSection />
      <ColorTransition fromColor="muted" toColor="background" />
      <ComplementaryServicesSection />
    </main>
  );
}
