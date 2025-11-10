"use client";

import { motion } from "framer-motion";
import { Target, Users, Briefcase, Calendar } from "lucide-react";

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
      staggerChildren: 0.2,
      delayChildren: 0.3,
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

export default function MatchingSystemSection() {
  const matchingCriteria = [
    {
      icon: Target,
      title: "Issue Type",
      description:
        "Match with clients based on the specific mental health challenges you specialize in treating",
    },
    {
      icon: Briefcase,
      title: "Therapeutic Approach",
      description:
        "Connect with clients who prefer your therapeutic methods and techniques",
    },
    {
      icon: Users,
      title: "Age Category",
      description:
        "Work with the age groups you're most experienced and comfortable with",
    },
    {
      icon: Calendar,
      title: "Expertise & Skills",
      description:
        "Leverage your unique competencies to help those who need them most",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <p className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground font-light mb-2">
                SMART MATCHING SYSTEM
              </p>
              <div className="w-32 h-0.5 bg-muted-foreground mx-auto"></div>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground mb-6"
            >
              Find Clients Who Are Right for You
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed"
            >
              Save time and energy with our intelligent matching system. Focus
              on the clinical aspects of your practice while we connect you with
              clients who align perfectly with your expertise and preferences.
            </motion.p>
          </div>

          {/* Matching Criteria Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            {matchingCriteria.map((criterion, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="p-8 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <criterion.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-foreground mb-2">
                      {criterion.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-light">
                      {criterion.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Benefits Highlight */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-linear-to-br from-muted/30 to-accent/10 rounded-2xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-serif font-light text-foreground mb-3">
                  Work Smarter, Not Harder
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light">
                  Our precision matching means you spend less time on
                  administrative tasks and more time doing what you
                  love—providing quality mental health care. Every client
                  connection is tailored to your professional strengths and
                  preferences.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
