"use client";

import { useState } from "react";
import {
  Scale,
  Brain,
  Heart,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Calendar,
  Users,
  BookOpen,
  Target,
  AlertCircle,
} from "lucide-react";

const services = [
  {
    id: "eap",
    icon: Scale,
    title: "Employee Assistance Program",
    highlighted: true,
    description:
      "Outdated, fragmented, slow. This should not describe your EAP. Reimagined to answer the needs of today's organizations, our EAP gives you peace of mind knowing that your employees have easy access to the right support, at a time that works for them.",
  },
  {
    id: "mental-health",
    icon: Brain,
    title: "Mental Health+",
    highlighted: false,
    description:
      "Outdated, fragmented, slow. This should not describe your mental health support. Reimagined to answer the needs of today's organizations, our Mental Health+ programs give you peace of mind knowing that your employees have easy access to comprehensive support connecting them with qualified professionals for assessments, therapy, and ongoing care, at a time that works for them.",
  },
  {
    id: "primary-care",
    icon: Heart,
    title: "Primary Care",
    highlighted: false,
    description:
      "Outdated, fragmented, slow. This should not describe your primary care access. Reimagined to answer the needs of today's organizations, our primary care services give you peace of mind knowing that your employees have easy access to physicians for general health concerns, preventive care, and medical consultations, at a time that works for them.",
  },
  {
    id: "wellness",
    icon: Sparkles,
    title: "Wellness",
    highlighted: false,
    description:
      "Outdated, fragmented, slow. This should not describe your wellness programs. Reimagined to answer the needs of today's organizations, our wellness programs give you peace of mind knowing that your employees have easy access to holistic support for nutrition, fitness, and lifestyle coaching, at a time that works for them.",
  },
];

const pathwaysFeatures = [
  {
    icon: Target,
    title: "Evaluations",
    description: "Comprehensive assessments for children and teens",
  },
  {
    icon: Users,
    title: "Support & follow-up",
    description: "Ongoing care and progress monitoring",
  },
  {
    icon: BookOpen,
    title: "Parental coaching",
    description: "Guidance and support for parents",
  },
  {
    icon: AlertCircle,
    title: "Learning support",
    description: "Help for learning difficulties, ADHD, anxiety, etc.",
  },
];

export default function ServiceSection() {
  const [selectedService, setSelectedService] = useState(services[0]);

  return (
    <section className="relative pt-12 bg-linear-to-b from-muted via-card to-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Our Integrated Health Platform™
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Multiple health and wellness programs to support your organization.
            <br />
            They work great on their own, but are even stronger together.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-32">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              isSelected={selectedService.id === service.id}
              onClick={() => setSelectedService(service)}
            />
          ))}
        </div>

        {/* Selected Service Detail Section */}
        <div className="max-w-7xl mx-auto mb-20">
          <div
            key={selectedService.id}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center animate-fade-in-up"
          >
            {/* Visual Design */}
            <div className="relative order-2 lg:order-1">
              {selectedService.id === "eap" && <EAPDesign />}
              {selectedService.id === "mental-health" && <MentalHealthDesign />}
              {selectedService.id === "primary-care" && <PrimaryCareDesign />}
              {selectedService.id === "wellness" && <WellnessDesign />}
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-foreground rounded-lg">
                  <selectedService.icon
                    className="w-8 h-8 text-background"
                    strokeWidth={2}
                  />
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">
                {selectedService.title}
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {selectedService.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// EAP Design - Floating Cards Interface (inspired by consultation cards)
function EAPDesign() {
  return (
    <div className="relative w-full max-w-md mx-auto min-h-[500px] flex items-center justify-center">
      {/* Background gradient blob */}
      <div className="absolute inset-0 bg-linear-to-br from-[#f5e6d3] via-[#fad4d4] to-[#f5ebe0] rounded-3xl opacity-40 blur-3xl"></div>

      <div className="relative z-10 w-full space-y-6">
        {/* Start Consultation Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ml-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900">
                Start a consultation
              </h4>
              <p className="text-sm text-gray-600">
                Speak with a professional.
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Confirmation Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mr-12">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">
                Perfect! Your virtual appointment today at 8:45 AM is confirmed.
              </h4>
            </div>
          </div>
          <button className="w-full bg-gray-900 text-white text-sm font-semibold py-3 rounded-full hover:bg-gray-800 transition-colors">
            GO TO CHAT
          </button>
        </div>

        {/* Care Plans Card */}
        <div className="bg-linear-to-br from-[#fff5f0] to-[#ffe8e0] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-base text-gray-900 mb-1">
                Care Plans
              </h4>
              <p className="text-xs text-gray-600">
                You don't have any care plans yet
              </p>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#d4a574]" />
            </div>
          </div>
          <button className="bg-[#d4a574] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#c09564] transition-colors">
            GET CARE
          </button>
        </div>
      </div>
    </div>
  );
}

// Mental Health Design - Floating Cards Interface
function MentalHealthDesign() {
  return (
    <div className="relative w-full max-w-md mx-auto min-h-[500px] flex items-center justify-center">
      {/* Background gradient blob */}
      <div className="absolute inset-0 bg-linear-to-br from-[#d4e8f0] via-[#e8f4f8] to-[#bde3f0] rounded-3xl opacity-40 blur-3xl"></div>

      <div className="relative z-10 w-full space-y-6">
        {/* Therapist Session Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mr-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900 mb-2">
                Video Session Available
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Dr. Sarah Johnson is ready for your scheduled therapy session.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span>Online now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracking Card */}
        <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ml-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-900">
                Your Progress
              </h4>
              <p className="text-xs text-gray-600">Week 6 of treatment</p>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Mood tracking</span>
              <span className="font-bold text-blue-600">85%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>
          <button className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold py-2.5 rounded-lg hover:shadow-lg transition-shadow">
            View Full Report
          </button>
        </div>

        {/* Resources Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">
                  Self-Help Resources
                </h4>
                <p className="text-xs text-gray-600">12 new guides available</p>
              </div>
            </div>
          </div>
          <button className="bg-blue-100 text-blue-700 text-xs font-semibold px-5 py-2 rounded-full hover:bg-blue-200 transition-colors">
            Browse Library
          </button>
        </div>
      </div>
    </div>
  );
}

// Old Mental Health Design (backup)
function MentalHealthDesignOld() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative bg-linear-to-br from-[#e8f4f8] to-[#bde3f0] rounded-3xl p-8 shadow-2xl min-h-[500px]">
        <div className="bg-white rounded-2xl p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Mental Health+</h4>
                <p className="text-xs text-gray-500">Personalized support</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Current Session Card */}
          <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-5 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    Dr. Sarah Johnson
                  </p>
                  <p className="text-xs text-gray-600">Clinical Psychologist</p>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Calendar className="w-4 h-4" />
              <span>Next session: Tomorrow, 2:00 PM</span>
            </div>
            <button className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold py-2.5 rounded-lg hover:shadow-lg transition-shadow">
              Join Video Session
            </button>
          </div>

          {/* Progress Tracker */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">
                Your Progress
              </p>
              <span className="text-xs text-blue-600 font-semibold">
                Week 6
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Mood tracking</span>
                  <span className="text-gray-900 font-semibold">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Session attendance</span>
                  <span className="text-gray-900 font-semibold">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <button className="bg-white border-2 border-gray-200 text-gray-700 text-xs font-semibold py-3 rounded-lg flex flex-col items-center gap-1 hover:border-blue-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </button>
            <button className="bg-white border-2 border-gray-200 text-gray-700 text-xs font-semibold py-3 rounded-lg flex flex-col items-center gap-1 hover:border-blue-400 transition-colors">
              <Target className="w-4 h-4" />
              <span>Resources</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Primary Care Design - Floating Cards Interface
function PrimaryCareDesign() {
  return (
    <div className="relative w-full max-w-md mx-auto min-h-[500px] flex items-center justify-center">
      {/* Background gradient blob */}
      <div className="absolute inset-0 bg-linear-to-br from-[#fef5f5] via-[#ffe8e8] to-[#ffd4d4] rounded-3xl opacity-40 blur-3xl"></div>

      <div className="relative z-10 w-full space-y-6">
        {/* Doctor Availability Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ml-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <Heart className="w-7 h-7 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900 mb-2">
                Doctor Available Now
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Dr. Michael Chen is ready to discuss your health concerns and
                medical questions.
              </p>
              <div className="flex items-center gap-2 text-xs text-red-600 font-semibold">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                <span>Available for consultation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Confirmed Card */}
        <div className="bg-linear-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mr-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-900">
                Appointment Scheduled
              </h4>
              <p className="text-xs text-gray-600">Tomorrow at 10:30 AM</p>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Dr. Emily Roberts</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                In-person
              </span>
            </div>
            <p className="text-xs text-gray-600">
              General checkup and health assessment
            </p>
          </div>
          <button className="w-full bg-red-600 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-red-700 transition-colors">
            View Details
          </button>
        </div>

        {/* Prescription Ready Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">
                  Prescription Ready
                </h4>
                <p className="text-xs text-gray-600">
                  Available at your pharmacy
                </p>
              </div>
            </div>
          </div>
          <button className="bg-red-100 text-red-700 text-xs font-semibold px-5 py-2 rounded-full hover:bg-red-200 transition-colors">
            View Prescription
          </button>
        </div>
      </div>
    </div>
  );
}

// Old design backup
function OldDesignBackup() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative bg-linear-to-br from-[#e8f4f8] to-[#d4e8f0] rounded-3xl p-12 shadow-2xl min-h-[500px] flex items-center justify-center">
        <div className="relative w-full">
          {/* Central Brain Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-white rounded-full p-8 shadow-xl">
              <Brain className="w-16 h-16 text-blue-600" strokeWidth={1.5} />
            </div>
          </div>

          {/* Orbiting Service Icons */}
          <div className="relative w-full h-[400px]">
            {/* Top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-4 shadow-lg">
              <Users className="w-8 h-8 text-gray-700" />
              <p className="text-xs mt-2 font-semibold text-center">Therapy</p>
            </div>

            {/* Right */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-lg">
              <Target className="w-8 h-8 text-gray-700" />
              <p className="text-xs mt-2 font-semibold text-center">
                Assessment
              </p>
            </div>

            {/* Bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-4 shadow-lg">
              <Heart className="w-8 h-8 text-gray-700" />
              <p className="text-xs mt-2 font-semibold text-center">Care</p>
            </div>

            {/* Left */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-lg">
              <MessageCircle className="w-8 h-8 text-gray-700" />
              <p className="text-xs mt-2 font-semibold text-center">Support</p>
            </div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <line
                x1="50%"
                y1="20%"
                x2="50%"
                y2="50%"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <line
                x1="80%"
                y1="50%"
                x2="50%"
                y2="50%"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <line
                x1="50%"
                y1="80%"
                x2="50%"
                y2="50%"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <line
                x1="20%"
                y1="50%"
                x2="50%"
                y2="50%"
                stroke="#3b82f6"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Old Primary Care Design (backup)
function OldPrimaryCareDesign() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative bg-linear-to-br from-[#fef5f5] to-[#fee5e5] rounded-3xl p-8 shadow-2xl min-h-[500px]">
        <div className="bg-white rounded-2xl p-6 h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Health Dashboard</h4>
              <p className="text-xs text-gray-500">Your care overview</p>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="space-y-4 mb-6">
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Blood Pressure
                </span>
                <span className="text-xs text-green-600 font-semibold">
                  Normal
                </span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Heart Rate
                </span>
                <span className="text-xs text-green-600 font-semibold">
                  Healthy
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Sleep Quality
                </span>
                <span className="text-xs text-yellow-600 font-semibold">
                  Good
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-900 text-white text-xs font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Book Visit
            </button>
            <button className="bg-gray-100 text-gray-900 text-xs font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wellness Design - Floating Cards Interface
function WellnessDesign() {
  return (
    <div className="relative w-full max-w-md mx-auto min-h-[500px] flex items-center justify-center">
      {/* Background gradient blob */}
      <div className="absolute inset-0 bg-linear-to-br from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0] rounded-3xl opacity-40 blur-3xl"></div>

      <div className="relative z-10 w-full space-y-6">
        {/* Wellness Challenge Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mr-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-base text-gray-900">
                  Daily Wellness Goals
                </h4>
                <span className="text-base">🔥</span>
              </div>
              <p className="text-sm text-gray-600">
                Track nutrition, fitness, and mindfulness activities.
              </p>
            </div>
          </div>
        </div>

        {/* Coaching Card */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ml-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-900">
                Lifestyle Coaching
              </h4>
              <p className="text-xs text-gray-600">
                Personalized guidance available
              </p>
            </div>
          </div>
          <button className="w-full bg-green-600 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-colors">
            Book Coach Session
          </button>
        </div>

        {/* Activity Tracker Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">
                  Activity Programs
                </h4>
                <p className="text-xs text-gray-600">Yoga, fitness & more</p>
              </div>
            </div>
          </div>
          <button className="bg-green-100 text-green-700 text-xs font-semibold px-5 py-2 rounded-full hover:bg-green-200 transition-colors">
            View Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// Old Wellness Design (backup)
function OldWellnessDesign() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative bg-linear-to-br from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0] rounded-3xl p-8 shadow-2xl min-h-[500px] overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-400 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-32 h-32 bg-emerald-400 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-20 w-24 h-24 bg-lime-400 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 h-full relative z-10 flex flex-col">
          {/* Header with sparkle effect */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-linear-to-br from-green-400 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center rotate-12 transform hover:rotate-0 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Wellness Journey</h4>
                <p className="text-xs text-gray-500">Your path to balance</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-2xl">🔥</div>
              <span className="text-sm font-bold text-orange-600">7</span>
            </div>
          </div>

          {/* Daily Wellness Wheel */}
          <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-5 mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-3">
              TODAY'S WELLNESS
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                <div className="text-2xl mb-1">🥗</div>
                <p className="text-xs text-gray-600 mb-1">Nutrition</p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                <div className="text-2xl mb-1">💪</div>
                <p className="text-xs text-gray-600 mb-1">Fitness</p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                <div className="text-2xl mb-1">🧘</div>
                <p className="text-xs text-gray-600 mb-1">Mindful</p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Overall Score</span>
              <span className="text-lg font-bold text-green-600">8.5/10</span>
            </div>
          </div>

          {/* Upcoming Activities */}
          <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg">🏃</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Morning Yoga Session
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  Starting in 45 minutes
                </p>
                <div className="flex gap-2">
                  <button className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Join Now
                  </button>
                  <button className="text-xs bg-white text-gray-700 px-3 py-1.5 rounded-lg font-semibold border border-gray-200 hover:border-orange-300 transition-colors">
                    Remind Me
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="bg-gray-50 rounded-xl p-4 mt-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-600">
                WEEKLY PROGRESS
              </p>
              <span className="text-xs text-green-600 font-bold">+15%</span>
            </div>
            <div className="flex items-end gap-1 h-16">
              <div
                className="flex-1 bg-green-200 rounded-t"
                style={{ height: "45%" }}
              ></div>
              <div
                className="flex-1 bg-green-300 rounded-t"
                style={{ height: "60%" }}
              ></div>
              <div
                className="flex-1 bg-green-300 rounded-t"
                style={{ height: "55%" }}
              ></div>
              <div
                className="flex-1 bg-green-400 rounded-t"
                style={{ height: "75%" }}
              ></div>
              <div
                className="flex-1 bg-green-400 rounded-t"
                style={{ height: "85%" }}
              ></div>
              <div
                className="flex-1 bg-green-500 rounded-t"
                style={{ height: "90%" }}
              ></div>
              <div
                className="flex-1 bg-linear-to-t from-green-500 to-emerald-500 rounded-t shadow-lg"
                style={{ height: "100%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span className="font-bold text-green-600">Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  index,
  isSelected,
  onClick,
}: {
  service: (typeof services)[0];
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = service.icon;

  return (
    <button
      onClick={onClick}
      className={`
        relative p-6 rounded-2xl transition-all duration-300 text-center
        ${
          isSelected
            ? "bg-foreground text-primary-foreground shadow-xl scale-105"
            : "bg-card border-2 border-border hover:border-foreground hover:shadow-lg"
        }
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="mb-4 flex justify-center">
        <Icon
          className={`w-8 h-8 ${isSelected ? "text-primary-foreground" : "text-foreground"}`}
          strokeWidth={2}
        />
      </div>
      <h3
        className={`text-base md:text-lg font-serif font-bold leading-snug ${isSelected ? "text-primary-foreground" : "text-foreground"}`}
      >
        {service.title}
      </h3>
    </button>
  );
}
