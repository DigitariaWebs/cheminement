import ProfileSelector from "@/components/appointments/ProfileSelector";
import {
  SentiersProgramSection,
  ServicesHeroSection,
  ServiceProgramsSection,
  WorkplaceSection,
  ComplementaryServicesSection,
} from "@/components/sections/services";
import EnterpriseCtaForm from "@/components/sections/services/EnterpriseCtaForm";
import ColorTransition from "@/components/ui/ColorTransition";

export default function ServicesPage() {
  return (
    <main>
      <ServicesHeroSection />
      <ColorTransition fromColor="accent" toColor="background" />
      <ProfileSelector />
      <ColorTransition fromColor="accent" toColor="background" />
      <ServiceProgramsSection />
      <ColorTransition fromColor="background" toColor="muted" />
      <WorkplaceSection />
      <ColorTransition fromColor="muted" toColor="background" />
      <EnterpriseCtaForm />
      <ColorTransition fromColor="background" toColor="muted" />
      <SentiersProgramSection />
      <ColorTransition fromColor="muted" toColor="background" />
      <ComplementaryServicesSection />
    </main>
  );
}
