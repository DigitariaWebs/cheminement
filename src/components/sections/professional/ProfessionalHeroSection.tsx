"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

export default function ProfessionalHeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-linear-to-br from-background via-muted to-accent overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>

      <div className="container mx-auto px-6 pt-20 pb-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Top Tagline */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <p className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground font-light mb-2">
              FOR MENTAL HEALTH PROFESSIONALS
            </p>
            <div className="w-32 h-0.5 bg-muted-foreground mx-auto"></div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-foreground mb-8 leading-tight"
          >
            Focus on What You Do Best: Helping People
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed font-light"
          >
            Join our platform and let us handle the administrative work. Connect
            with clients who match your expertise, optimize your practice, and
            grow your impact.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup/professional"
              className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10">Join Our Platform</span>
              <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>

            <Link
              href="/professional/learn-more"
              className="group flex items-center gap-3 px-8 py-5 text-foreground text-lg font-light tracking-wide transition-all duration-300 hover:gap-4 border border-muted-foreground/20 rounded-full hover:bg-muted/50"
            >
              <span>Learn More</span>
            </Link>
          </motion.div>

          {/* Additional Info Tags */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span>1000+ Active Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span>95% Satisfaction Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span>24/7 Platform Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
