"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { IMedicalProfile } from "@/models/MedicalProfile";
import { medicalProfileAPI } from "@/lib/api-client";

interface SymptomsImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  setMedicalProfile: (data: IMedicalProfile) => void;
  profile?: IMedicalProfile;
}

export interface SymptomsImpactData {
  symptoms: string[];
  dailyLifeImpact: string;
  sleepQuality: string;
  appetiteChanges: string;
}

export default function SymptomsImpactModal({
  isOpen,
  onClose,
  setMedicalProfile,
  profile,
}: SymptomsImpactModalProps) {
  const t = useTranslations("Client.profileModal");
  const [formData, setFormData] = useState<SymptomsImpactData>({
    symptoms: profile?.symptoms || [],
    dailyLifeImpact: profile?.dailyLifeImpact || "",
    sleepQuality: profile?.sleepQuality || "",
    appetiteChanges: profile?.appetiteChanges || "",
  });

  const symptoms = [
    "Persistent Sadness",
    "Anxiety Attacks",
    "Sleep Problems",
    "Loss of Interest",
    "Irritability",
    "Fatigue",
    "Concentration Issues",
    "Appetite Changes",
    "Social Withdrawal",
    "Panic Attacks",
    "Mood Swings",
    "Suicidal Thoughts",
    "Hallucinations",
    "Delusions",
    "Other",
  ];

  const sleepQualityOptions = [
    { value: "normal", label: "Normal" },
    { value: "poor", label: "Poor" },
    { value: "insomnia", label: "Insomnia" },
    { value: "excessive", label: "Excessive" },
  ];

  const handleMultiSelect = (value: string) => {
    const currentValues = formData.symptoms;
    if (currentValues.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        symptoms: currentValues.filter((v) => v !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        symptoms: [...currentValues, value],
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (data: SymptomsImpactData) => {
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
              {t("step4.title")}
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-1">
              {t("step4.subtitle")}
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
                {t("step4.symptoms")}
              </Label>
              <p className="text-sm text-muted-foreground font-light mb-4">
                {t("step4.symptomsDesc")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {symptoms.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect(item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                      formData.symptoms.includes(item)
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
                htmlFor="dailyLifeImpact"
                className="font-light mb-3 text-base"
              >
                {t("step4.dailyLifeImpact")}
              </Label>
              <textarea
                id="dailyLifeImpact"
                name="dailyLifeImpact"
                value={formData.dailyLifeImpact}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                placeholder={t("step4.dailyLifeImpactPlaceholder")}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label className="font-light mb-3 text-base">
                  {t("step4.sleepQuality")}
                </Label>
                <select
                  name="sleepQuality"
                  value={formData.sleepQuality}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{t("step4.sleepQualityPlaceholder")}</option>
                  {sleepQualityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label
                  htmlFor="appetiteChanges"
                  className="font-light mb-3 text-base"
                >
                  {t("step4.appetiteChanges")}
                </Label>
                <Input
                  id="appetiteChanges"
                  name="appetiteChanges"
                  value={formData.appetiteChanges}
                  onChange={handleChange}
                  placeholder={t("step4.appetiteChangesPlaceholder")}
                />
              </div>
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
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
