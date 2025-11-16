"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { IMedicalProfile } from "@/models/MedicalProfile";
import { medicalProfileAPI } from "@/lib/api-client";

interface HealthBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  setMedicalProfile: (data: IMedicalProfile) => void;
  profile?: IMedicalProfile;
}

export interface HealthBackgroundData {
  concernedPerson: string;
  medicalConditions: string[];
  currentMedications: string[];
  allergies: string[];
  substanceUse: string;
}

export default function HealthBackgroundModal({
  isOpen,
  onClose,
  setMedicalProfile,
  profile,
}: HealthBackgroundModalProps) {
  const t = useTranslations("Client.profileModal");
  const [formData, setFormData] = useState<HealthBackgroundData>({
    concernedPerson: profile?.concernedPerson || "",
    medicalConditions: profile?.medicalConditions || [],
    currentMedications: profile?.currentMedications || [],
    allergies: profile?.allergies || [],
    substanceUse: profile?.substanceUse || "",
  });

  const medicalConditions = [
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Heart Disease",
    "Cancer",
    "Thyroid Disorders",
    "Arthritis",
    "Chronic Pain",
    "Migraines",
    "Epilepsy",
    "Other",
  ];

  const handleMultiSelect = (value: string) => {
    const currentValues = formData.medicalConditions;
    if (currentValues.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        medicalConditions: currentValues.filter((v) => v !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        medicalConditions: [...currentValues, value],
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (data: HealthBackgroundData) => {
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
              {t("step1.title")}
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-1">
              {t("step1.subtitle")}
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
              <Label
                htmlFor="concernedPerson"
                className="font-light mb-3 text-base"
              >
                {t("step1.concernedPerson")}
              </Label>
              <Input
                id="concernedPerson"
                name="concernedPerson"
                value={formData.concernedPerson}
                onChange={handleChange}
                placeholder={t("step1.concernedPersonPlaceholder")}
              />
            </div>

            <div>
              <Label className="font-light mb-3 text-base">
                {t("step1.medicalConditions")}
              </Label>
              <p className="text-sm text-muted-foreground font-light mb-4">
                {t("step1.medicalConditionsDesc")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {medicalConditions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect(item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                      formData.medicalConditions.includes(item)
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
                htmlFor="currentMedications"
                className="font-light mb-3 text-base"
              >
                {t("step1.currentMedications")}
              </Label>
              <Input
                id="currentMedications"
                name="currentMedications"
                value={formData.currentMedications.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    currentMedications: e.target.value
                      .split(", ")
                      .filter(Boolean),
                  }))
                }
                placeholder={t("step1.currentMedicationsPlaceholder")}
              />
            </div>

            <div>
              <Label htmlFor="allergies" className="font-light mb-3 text-base">
                {t("step1.allergies")}
              </Label>
              <Input
                id="allergies"
                name="allergies"
                value={formData.allergies.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    allergies: e.target.value.split(", ").filter(Boolean),
                  }))
                }
                placeholder={t("step1.allergiesPlaceholder")}
              />
            </div>

            <div>
              <Label
                htmlFor="substanceUse"
                className="font-light mb-3 text-base"
              >
                {t("step1.substanceUse")}
              </Label>
              <Input
                id="substanceUse"
                name="substanceUse"
                value={formData.substanceUse}
                onChange={handleChange}
                placeholder={t("step1.substanceUsePlaceholder")}
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
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
