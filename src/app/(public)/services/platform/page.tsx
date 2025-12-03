import {
  PlatformHeroSection,
  ServiceCardsSection,
  ServiceDetailsSection,
  IntegrationBenefitsSection,
  PlatformCTASection,
} from "@/components/sections/platform";

export default function PlatformPage() {
  return (
    <main className="bg-background">
      <PlatformHeroSection />
      <ServiceCardsSection />
      <ServiceDetailsSection />
      <IntegrationBenefitsSection />
      <PlatformCTASection />
    </main>
  );
}
