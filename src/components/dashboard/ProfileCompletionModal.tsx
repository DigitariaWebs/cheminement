"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Stepper } from "@/components/ui/stepper";

const STEPS = [
  { title: "Issue Types", description: "Specializations" },
  { title: "Approaches", description: "Methods" },
  { title: "Age Groups", description: "Categories" },
  { title: "Additional Info", description: "Skills & Bio" },
];

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: ProfileData) => void;
}

export interface ProfileData {
  problematics: string[];
  approaches: string[];
  ageCategories: string[];
  skills: string[];
  bio: string;
  yearsOfExperience: string;
}

export default function ProfileCompletionModal({
  isOpen,
  onClose,
  onComplete,
}: ProfileCompletionModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProfileData>({
    problematics: [],
    approaches: [],
    ageCategories: [],
    skills: [],
    bio: "",
    yearsOfExperience: "",
  });

  const problematics = [
    "Anxiety Disorders",
    "Depression",
    "Trauma & PTSD",
    "Relationship Issues",
    "Stress Management",
    "Grief & Loss",
    "Self-Esteem",
    "Addiction",
    "Eating Disorders",
    "Sleep Disorders",
    "Bipolar Disorder",
    "OCD",
  ];

  const therapeuticApproaches = [
    "Cognitive Behavioral Therapy (CBT)",
    "Psychodynamic Therapy",
    "Humanistic Therapy",
    "Dialectical Behavior Therapy (DBT)",
    "EMDR",
    "Solution-Focused Therapy",
    "Mindfulness-Based Therapy",
    "Family Systems Therapy",
    "Acceptance and Commitment Therapy (ACT)",
  ];

  const ageCategories = [
    "Children (0-12)",
    "Adolescents (13-17)",
    "Young Adults (18-25)",
    "Adults (26-64)",
    "Seniors (65+)",
  ];

  const skills = [
    "Crisis Intervention",
    "Group Therapy",
    "Couples Counseling",
    "Family Therapy",
    "Neuropsychological Assessment",
    "Psychometric Testing",
    "Bilingual Services (French/English)",
    "Cultural Competency",
    "LGBTQ+ Affirmative Therapy",
  ];

  const handleMultiSelect = (field: keyof ProfileData, value: string) => {
    const currentValues = formData[field] as string[];
    if (currentValues.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: currentValues.filter((v) => v !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: [...currentValues, value],
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(formData);
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.problematics.length > 0;
      case 1:
        return formData.approaches.length > 0;
      case 2:
        return formData.ageCategories.length > 0;
      case 3:
        return formData.bio.trim() !== "" && formData.yearsOfExperience !== "";
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-light text-foreground">
              Complete Your Profile
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-1">
              Help us match you with the right clients
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-6 border-b border-border/40">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Step 1: Issue Types */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-light text-foreground mb-2">
                  Issue Types You Specialize In
                  <span className="text-primary ml-1">*</span>
                </h3>
                <p className="text-sm text-muted-foreground font-light">
                  Select the mental health challenges you are qualified to treat
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {problematics.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect("problematics", item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                      formData.problematics.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Therapeutic Approaches */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-light text-foreground mb-2">
                  Therapeutic Approaches
                  <span className="text-primary ml-1">*</span>
                </h3>
                <p className="text-sm text-muted-foreground font-light">
                  Select your preferred therapeutic methods and techniques
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {therapeuticApproaches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect("approaches", item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                      formData.approaches.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Age Categories */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-light text-foreground mb-2">
                  Age Categories
                  <span className="text-primary ml-1">*</span>
                </h3>
                <p className="text-sm text-muted-foreground font-light">
                  Select the age groups you are experienced and comfortable
                  working with
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ageCategories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect("ageCategories", item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                      formData.ageCategories.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-light text-foreground mb-2">
                  Additional Skills & Information
                </h3>
                <p className="text-sm text-muted-foreground font-light">
                  Complete your profile with additional details
                </p>
              </div>

              {/* Skills */}
              <div>
                <Label className="font-light mb-3 text-base">
                  Additional Skills & Competencies
                </Label>
                <p className="text-sm text-muted-foreground font-light mb-4">
                  Highlight your unique expertise and qualifications
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skills.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleMultiSelect("skills", item)}
                      className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                        formData.skills.includes(item)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground hover:bg-muted"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Professional Bio */}
              <div>
                <Label htmlFor="bio" className="font-light mb-3 text-base">
                  Professional Bio
                  <span className="text-primary ml-1">*</span>
                </Label>
                <p className="text-sm text-muted-foreground font-light mb-4">
                  Share your background, philosophy, and what clients can expect
                  from working with you
                </p>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={6}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                  placeholder="Tell potential clients about your approach, experience, and what makes you unique..."
                />
              </div>

              {/* Years of Experience */}
              <div>
                <Label
                  htmlFor="yearsOfExperience"
                  className="font-light mb-3 text-base"
                >
                  Years of Experience
                  <span className="text-primary ml-1">*</span>
                </Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="max-w-xs"
                  placeholder="5"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border/40 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 text-foreground font-light transition-opacity disabled:opacity-0 disabled:pointer-events-none hover:text-muted-foreground"
          >
            Back
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-foreground font-light transition-colors hover:text-muted-foreground"
            >
              Save for Later
            </button>
            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Complete Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
