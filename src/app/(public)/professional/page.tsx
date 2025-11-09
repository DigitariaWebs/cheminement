"use client";

import { motion } from "framer-motion";
import ProfessionalHeroSection from "@/components/sections/professional/ProfessionalHeroSection";
import MatchingSystemSection from "@/components/sections/professional/MatchingSystemSection";
import PlatformBenefitsSection from "@/components/sections/professional/PlatformBenefitsSection";
import ProfessionalCTASection from "@/components/sections/professional/ProfessionalCTASection";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export default function ProfessionalPage() {
  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="overflow-hidden"
    >
      <ProfessionalHeroSection />
      <MatchingSystemSection />
      <PlatformBenefitsSection />
      <ProfessionalCTASection />
    </motion.main>
  );
}
