"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Video,
  FileText,
  Headphones,
  Lock,
  Unlock,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

export default function ResourcesSection() {
  const freeResources = [
    {
      icon: BookOpen,
      title: "Educational Articles",
      description:
        "Access a comprehensive library of articles about mental health, self-care strategies, and wellness tips.",
    },
    {
      icon: Video,
      title: "Video Guides",
      description:
        "Watch educational videos on managing stress, anxiety, and building healthy habits to prepare for your journey.",
    },
    {
      icon: FileText,
      title: "Self-Assessment Tools",
      description:
        "Use our guided questionnaires to better understand your needs and communicate effectively with professionals.",
    },
    {
      icon: Headphones,
      title: "Guided Meditations",
      description:
        "Begin your self-care practice with free guided meditation and mindfulness exercises.",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <p className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground font-light mb-2">
                EMPOWER YOURSELF
              </p>
              <div className="w-32 h-0.5 bg-muted-foreground mx-auto"></div>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground mb-6"
            >
              Take Charge of Your Mental Wellness
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed"
            >
              Increase your knowledge, practice self-care, and prepare for your
              journey with our comprehensive educational resources.
            </motion.p>
          </div>

          {/* Free Resources */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-8">
              <Unlock className="w-5 h-5 text-primary" />
              <h3 className="text-2xl font-serif font-light text-foreground">
                Free Access Resources
              </h3>
            </div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {freeResources.map((resource, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="p-6 rounded-xl border border-border/20 bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300"
                >
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <resource.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h4 className="text-lg font-light text-foreground mb-3">
                    {resource.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed font-light">
                    {resource.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Premium Resources CTA */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-linear-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 border border-primary/20"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-serif font-light text-foreground mb-3">
                  Ready to Go Further?
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light mb-6">
                  Unlock premium resources including personalized learning
                  paths, advanced self-care techniques, exclusive workshops, and
                  one-on-one guidance to accelerate your mental wellness
                  journey.
                </p>
                <Link
                  href="/resources/premium"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full text-base font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Explore Premium Resources
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Benefits Note */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground font-light max-w-2xl mx-auto">
              Start with free resources to build your foundation, then explore
              premium options when you&apos;re ready to deepen your practice and
              accelerate your growth.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
