import {
  ApproachesHeroSection,
  ClinicalApproachesSection,
  FlexibilitySection,
  MatchingSection,
  PersonCenteredSection,
} from "@/components/sections/approaches";
import ColorTransition from "@/components/ui/ColorTransition";

export default function ApproachesPage() {
  return (
    <main>
      <ApproachesHeroSection />
      <ColorTransition fromColor="accent" toColor="background" />
      <PersonCenteredSection />
      <ColorTransition fromColor="background" toColor="muted" />
      <ClinicalApproachesSection />
      <ColorTransition fromColor="muted" toColor="muted" />
      <FlexibilitySection />
      <ColorTransition fromColor="muted" toColor="background" />
      <MatchingSection />
    </main>
  );
}
