"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-accent overflow-hidden">
      {/* Background Pattern/Decoration */}
      <div className="absolute inset-0 opacity-5"></div>

      <div className="container mx-auto px-6 pt-20 pb-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          {/* Left Side: Content */}
          {/* Right Side: Content */}
          <div className="flex-1 max-w-5xl">
            {/* Top Tagline */}
            <div className="mb-4 animate-fade-in">
              <p className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground font-light mb-2">
                YOUR JOURNEY TO WELLNESS STARTS HERE
              </p>
              <div className="w-32 h-0.5 bg-muted-foreground mx-auto lg:mx-0"></div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-serif font-light text-foreground mb-8 leading-tight animate-fade-in-up text-left lg:text-left">
              Find Your Perfect Mental Health Professional
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto lg:mx-0 mb-8 leading-relaxed font-light animate-fade-in-up animation-delay-200 text-left lg:text-left">
              Take the first step towards better mental health. Our platform
              connects you with qualified professionals who understand your
              unique journey and provide the support you need, when you need it
              most.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start justify-start gap-4 animate-fade-in-up animation-delay-400">
              <Link
                href="/book"
                className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg font-light tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">Book an Appointment</span>
                <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>

              <Link
                href="/professional"
                className="group flex items-center gap-3 px-8 py-5 text-foreground text-lg font-light tracking-wide transition-all duration-300 hover:gap-4 border border-muted-foreground/20 rounded-full hover:bg-muted/50"
              >
                <span>I am a Professional</span>
              </Link>
            </div>

            {/* Additional Info Tags */}
            <div className="mt-8 flex flex-wrap items-center justify-start gap-6 text-sm text-muted-foreground animate-fade-in animation-delay-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span>Personalized Care</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span>Flexible Scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span>Confidential Support</span>
              </div>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="flex-1 max-w-md lg:max-w-lg">
            <div className="relative w-full h-[600px] flex items-center justify-center">
              <img
                src="/HeroSection.png"
                alt="Mental Health Professional"
                className="max-w-full max-h-full object-contain animate-fade-in-up animation-delay-600"
              />
              {/* Fading effect at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-accent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
