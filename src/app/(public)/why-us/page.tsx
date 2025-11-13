import {
  AccessExperienceSection,
  FamilySupportSection,
  ReasonsTimelineSection,
  SupportCommitmentSection,
  WhyHeroSection,
} from "@/components/sections/why";

export default function WhyUsPage() {
  return (
    <main className="bg-background">
      <WhyHeroSection />
      <ReasonsTimelineSection />
      <AccessExperienceSection />
      <FamilySupportSection />
      <SupportCommitmentSection />
    </main>
  );
}

