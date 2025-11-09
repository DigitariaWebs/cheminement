"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Briefcase } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Choose Your Login Type
        </h1>
        <p className="text-muted-foreground text-lg">
          Select the option that best describes you
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full"
      >
        {/* Member Card */}
        <motion.div variants={item}>
          <Link href="/login/member" className="block group h-full">
            <div className="h-full rounded-lg border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary hover:-translate-y-1">
              <div className="flex flex-col items-center text-center h-full">
                <div className="mb-6 rounded-full bg-primary/10 p-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Users className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                  Member
                </h2>
                <p className="text-muted-foreground leading-relaxed grow">
                  Access your personal account to manage appointments, view your
                  mental health journey, and connect with professionals.
                </p>
                <div className="mt-6 text-primary font-medium group-hover:underline">
                  Sign in as Member →
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Professional Card */}
        <motion.div variants={item}>
          <Link href="/login/professional" className="block group h-full">
            <div className="h-full rounded-lg border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary hover:-translate-y-1">
              <div className="flex flex-col items-center text-center h-full">
                <div className="mb-6 rounded-full bg-primary/10 p-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                  Professional
                </h2>
                <p className="text-muted-foreground leading-relaxed grow">
                  Log in to manage your practice, schedule appointments, and
                  provide quality mental health services to your clients.
                </p>
                <div className="mt-6 text-primary font-medium group-hover:underline">
                  Sign in as Professional →
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
