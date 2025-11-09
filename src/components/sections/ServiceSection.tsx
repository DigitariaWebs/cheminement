"use client";

import { useState } from "react";
import {
  Scale,
  Brain,
  Heart,
  Sparkles,
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
                You don&apos;t have any care plans yet
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
