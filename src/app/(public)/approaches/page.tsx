import {
  ApproachesHeroSection,
  ApproachesCTASection,
  ClinicalApproachesSection,
  FlexibilitySection,
  MatchingSection,
  PersonCenteredSection,
} from "@/components/sections/approaches";
import ColorTransition from "@/components/ui/ColorTransition";
import BookingButtonsGroup from "@/components/appointments/BookingButtonsGroup";

export default function ApproachesPage() {
  return (
    <main>
      <ApproachesHeroSection />
      <ColorTransition fromColor="accent" toColor="background" />
      <PersonCenteredSection />
      {/* Booking buttons after Bloc A (PersonCenteredSection) */}
      <BookingButtonsGroup />
      <ColorTransition fromColor="background" toColor="muted" />
      <ClinicalApproachesSection />
      {/* Booking buttons after Bloc B (ClinicalApproachesSection) */}
      <ColorTransition fromColor="muted" toColor="background" />
      <BookingButtonsGroup />
      <ColorTransition fromColor="background" toColor="muted" />
      <FlexibilitySection />
      <ColorTransition fromColor="muted" toColor="background" />
      <MatchingSection />
      <ColorTransition fromColor="background" toColor="muted" />
      <ApproachesCTASection />
    </main>
  );
}
