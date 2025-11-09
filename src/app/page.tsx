import HeroSection from "@/components/sections/HeroSection";
import ValueSection from "@/components/sections/ValueSection";
import ServiceSection from "@/components/sections/ServiceSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ValueSection />
      <ServiceSection />
      <HowItWorksSection />
    </main>
  );
}
