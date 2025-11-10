"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, BookOpen } from "lucide-react";

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

export default function QuickAccessSection() {
  const benefits = [
    {
      icon: Clock,
      title: "Find Help Quickly",
      description:
        "No more endless waiting lists. Connect with qualified mental health professionals who are available to help you now.",
    },
    {
      icon: MapPin,
      title: "Access from Anywhere",
      description:
        "Whether you're in a remote region or a major city, find the right professional who matches your needs, no matter the distance.",
    },
    {
      icon: BookOpen,
      title: "Start Your Journey Today",
      description:
        "Begin with educational resources, self-learning materials, and readings while you prepare for your first session with a professional.",
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
                YOUR BENEFITS
              </p>
              <div className="w-32 h-0.5 bg-muted-foreground mx-auto"></div>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground mb-6"
            >
              Get the Support You Need, When You Need It
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed"
            >
              We make mental health care accessible, convenient, and
              personalized to your unique situation.
            </motion.p>
          </div>

          {/* Benefits Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-8 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-light text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Highlight Box */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-linear-to-br from-muted/30 to-accent/10 rounded-2xl p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl font-serif font-light text-foreground mb-3">
              Don&apos;t Wait to Feel Better
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
              Every journey begins with a single step. Whether you&apos;re
              seeking immediate support or wanting to learn more about mental
              wellness, we&apos;re here to guide you every step of the way.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
