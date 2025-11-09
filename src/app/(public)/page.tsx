import HeroSection from "@/components/sections/HeroSection";
import ColorTransition from "@/components/ui/ColorTransition";
import ValueSection from "@/components/sections/ValueSection";
import ServiceSection from "@/components/sections/ServiceSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ColorTransition fromColor="accent" toColor="background" />
      <ValueSection />
      <ColorTransition fromColor="accent" toColor="muted" />
      <ServiceSection />
      <HowItWorksSection />
    </main>
  );
}
