import {
  ApproachesHeroSection,
  ClinicalApproachesSection,
  EthicsSection,
  FlexibilitySection,
  MatchingSection,
  PersonCenteredSection,
} from "@/components/sections/approaches";

export default function ApproachesPage() {
  return (
    <main className="bg-background">
      <ApproachesHeroSection />
      <PersonCenteredSection />
      <ClinicalApproachesSection />
      <EthicsSection />
      <FlexibilitySection />
      <MatchingSection />
    </main>
  );
}

