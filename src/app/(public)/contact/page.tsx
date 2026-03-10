import ColorTransition from "@/components/ui/ColorTransition";
import ProfileSelector from "@/components/appointments/ProfileSelector";
import {
  ContactChannelsSection,
  ContactHeroSection,
  EmergencySection,
  JoinUsSection,
  SupportSection,
} from "@/components/sections/contact";

export default function ContactPage() {
  return (
    <main className="bg-background">
      <ContactHeroSection />
      <ColorTransition fromColor="accent" toColor="background" />
      <ContactChannelsSection />
      <ColorTransition fromColor="background" toColor="accent" />
      <ProfileSelector />
      <ColorTransition fromColor="accent" toColor="background" />
      <SupportSection />
      <ColorTransition fromColor="background" toColor="accent" />
      <EmergencySection />
      <ColorTransition fromColor="background" toColor="muted" />
      <JoinUsSection />
    </main>
  );
}
