"use client";

import { PlayCircle } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-linear-to-br from-background via-muted to-accent overflow-hidden">
      {/* Background Pattern/Decoration */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>

      <div className="container mx-auto px-6 pt-20 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Top Tagline */}
          <div className="mb-4 animate-fade-in">
            <p className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground font-light mb-2">
              MENTAL HEALTH IS EVERYTHING
            </p>
            <div className="w-32 h-0.5 bg-muted-foreground mx-auto"></div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-foreground mb-8 leading-tight animate-fade-in-up">
            Find the right professional
            <br />
            <span className="font-normal">at the right time</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed font-light animate-fade-in-up animation-delay-200">
            Connect with mental health professionals who match your needs.
            Navigate your mental health journey with guidance, reduce wait
            times, and find the support you deserve—seamlessly and
            compassionately.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
            <Link
              href="/discover"
              className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10">Discover Our Platform</span>
              <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>

            <button
              className="group flex items-center gap-3 px-8 py-5 text-foreground text-lg font-light tracking-wide transition-all duration-300 hover:gap-4"
              onClick={() => {
                // Add video modal logic here
                console.log("Watch video clicked");
              }}
            >
              <span>Watch the video</span>
              <PlayCircle
                className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* Additional Info Tags */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in animation-delay-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span>Reduce Wait Times</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span>Personalized Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span>Professional Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
