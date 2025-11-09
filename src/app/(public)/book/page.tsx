"use client";

import { motion } from "framer-motion";
import ClientHeroSection from "@/components/sections/client/ClientHeroSection";
import QuickAccessSection from "@/components/sections/client/QuickAccessSection";
import ResourcesSection from "@/components/sections/client/ResourcesSection";
import ClientCTASection from "@/components/sections/client/ClientCTASection";

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

export default function BookPage() {
  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="overflow-hidden"
    >
      <ClientHeroSection />
      <QuickAccessSection />
      <ResourcesSection />
      <ClientCTASection />
    </motion.main>
  );
}
