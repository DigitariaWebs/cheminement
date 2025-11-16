"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { IMedicalProfile } from "@/models/MedicalProfile";
import { medicalProfileAPI } from "@/lib/api-client";

interface GoalsPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  setMedicalProfile: (data: IMedicalProfile) => void;
  profile?: IMedicalProfile;
}

export interface GoalsPreferencesData {
  treatmentGoals: string[];
  therapyApproach: string[];
  concernsAboutTherapy: string;
}

export default function GoalsPreferencesModal({
  isOpen,
  onClose,
  setMedicalProfile,
  profile,
}: GoalsPreferencesModalProps) {
  const t = useTranslations("Client.profileModal");
  const [formData, setFormData] = useState<GoalsPreferencesData>({
    treatmentGoals: profile?.treatmentGoals || [],
    therapyApproach: profile?.therapyApproach || [],
    concernsAboutTherapy: profile?.concernsAboutTherapy || "",
  });

  const treatmentGoals = [
    "Reduce Anxiety",
    "Improve Mood",
    "Better Sleep",
    "Increase Self-Esteem",
    "Manage Stress",
    "Improve Relationships",
    "Overcome Trauma",
    "Develop Coping Skills",
    "Address Addiction",
    "Weight Management",
    "Other",
  ];

  const therapyApproaches = [
    "Cognitive Behavioral Therapy (CBT)",
    "Psychodynamic Therapy",
    "Humanistic Therapy",
    "Dialectical Behavior Therapy (DBT)",
    "EMDR",
    "Solution-Focused Therapy",
    "Mindfulness-Based Therapy",
    "Family Systems Therapy",
    "Acceptance and Commitment Therapy (ACT)",
    "No Preference",
  ];

  const handleMultiSelect = (
    field: keyof GoalsPreferencesData,
    value: string,
  ) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (data: GoalsPreferencesData) => {
    try {
      const updatedProfile = { ...profile, ...data };
      const newProfile = (await medicalProfileAPI.update(
        updatedProfile,
      )) as IMedicalProfile;
      setMedicalProfile(newProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-light text-foreground">
              {t("step5.title")}
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-1">
              {t("step5.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="space-y-6">
            <div>
              <Label className="font-light mb-3 text-base">
                {t("step5.treatmentGoals")}
                <span className="text-primary ml-1">*</span>
              </Label>
              <p className="text-sm text-muted-foreground font-light mb-4">
                {t("step5.treatmentGoalsDesc")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {treatmentGoals.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect("treatmentGoals", item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                      formData.treatmentGoals.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="font-light mb-3 text-base">
                {t("step5.therapyApproach")}
              </Label>
              <p className="text-sm text-muted-foreground font-light mb-4">
                {t("step5.therapyApproachDesc")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {therapyApproaches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect("therapyApproach", item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                      formData.therapyApproach.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="concernsAboutTherapy"
                className="font-light mb-3 text-base"
              >
                {t("step5.concernsAboutTherapy")}
              </Label>
              <textarea
                id="concernsAboutTherapy"
                name="concernsAboutTherapy"
                value={formData.concernsAboutTherapy}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                placeholder={t("step5.concernsAboutTherapyPlaceholder")}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border/40 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-foreground font-light transition-colors hover:text-muted-foreground"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(formData)}
            disabled={formData.treatmentGoals.length === 0}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
