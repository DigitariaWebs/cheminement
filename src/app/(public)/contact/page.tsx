import ColorTransition from "@/components/ui/ColorTransition";
import {
  ContactChannelsSection,
  ContactFormSection,
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
      <ColorTransition fromColor="background" toColor="muted" />
      <ContactFormSection />
      <ColorTransition fromColor="muted" toColor="background" />
      <SupportSection />
      <ColorTransition fromColor="background" toColor="accent" />
      <EmergencySection />
      <ColorTransition fromColor="background" toColor="muted" />
      <JoinUsSection />
    </main>
  );
}
