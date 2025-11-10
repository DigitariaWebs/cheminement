"use client";

import { motion } from "framer-motion";
import {
  Clock,
  TrendingUp,
  BookOpen,
  Award,
  Video,
  Users,
  DollarSign,
  Shield,
  Heart,
  Lightbulb,
  Calendar,
  FileText,
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
      staggerChildren: 0.1,
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

export default function PlatformBenefitsSection() {
  const benefits = [
    {
      icon: Clock,
      title: "Simple & Efficient Management",
      description:
        "Provide us with your available time slots, meet your clients, and we handle the rest—scheduling, billing, and administrative tasks.",
    },
    {
      icon: TrendingUp,
      title: "Stabilize Your Practice",
      description:
        "Maintain a consistent client base and steady revenue stream. Focus on growth without worrying about fluctuating income.",
    },
    {
      icon: BookOpen,
      title: "Optimize Your Time",
      description:
        "Concentrate on clinical aspects of your practice and free up time for your personal life. We handle the business side.",
    },
    {
      icon: Calendar,
      title: "Practice Management Tools",
      description:
        "Access OWL Practice-style features including record keeping, scheduling, billing, and payroll management—all in one place.",
    },
    {
      icon: FileText,
      title: "Virtual Library Access",
      description:
        "Unlimited access to PDF books, research articles, psychological tests, and test correction platforms when needed.",
    },
    {
      icon: Video,
      title: "Content Development Support",
      description:
        "Get help creating podcasts, videos, and articles to expand your reach and generate additional revenue streams.",
    },
    {
      icon: Award,
      title: "Professional Development",
      description:
        "Free training programs and receive a note-taking tablet after completing a certain number of sessions.",
    },
    {
      icon: Lightbulb,
      title: "Startup Kit & Mentorship",
      description:
        "New psychologists receive comprehensive startup assistance and mentorship from experienced professionals.",
    },
    {
      icon: Users,
      title: "Free Supervision Access",
      description:
        "Get access to professional supervision when you need it, included in your membership at no extra cost.",
    },
    {
      icon: Heart,
      title: "Support Community",
      description:
        "Join support groups for mutual aid, reflection, clinical discussions, and professional community building.",
    },
    {
      icon: Shield,
      title: "Psychiatry Collaboration",
      description:
        "Access discussions with psychiatrists through our partnership with Averroes for comprehensive patient care.",
    },
    {
      icon: DollarSign,
      title: "Financial Benefits",
      description:
        "Preferential rates with accountants, OPQ membership fee support based on sessions, and investment fund opportunities.",
    },
  ];

  const additionalPerks = [
    "Become a shareholder and collectively benefit from our success",
    "Social mission: Priority support for clients in remote regions",
    "Reduced rates for family/child cases with joint platform support",
    "$1 per session contribution to an investment fund",
  ];

  return (
    <section className="py-20 bg-muted">
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
                WHY CHOOSE US
              </p>
              <div className="w-32 h-0.5 bg-muted-foreground mx-auto"></div>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground mb-6"
            >
              Platform Benefits for Professionals
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed"
            >
              We provide comprehensive support so you can focus on what matters
              most—delivering exceptional mental health care to your clients.
            </motion.p>
          </div>

          {/* Benefits Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-6 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-lg font-light text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-light">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Perks */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-linear-to-br from-muted/30 to-accent/10 rounded-2xl p-8 md:p-12"
          >
            <h3 className="text-2xl font-serif font-light text-foreground mb-6 text-center">
              Additional Perks & Opportunities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {additionalPerks.map((perk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                    <svg
                      className="w-4 h-4 text-primary-foreground"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-foreground leading-relaxed font-light">
                    {perk}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
