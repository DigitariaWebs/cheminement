"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { IMedicalProfile } from "@/models/MedicalProfile";
import { medicalProfileAPI } from "@/lib/api-client";

interface MatchingPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  setMedicalProfile: (data: IMedicalProfile) => void;
  profile?: IMedicalProfile;
}

export interface MatchingPreferencesData {
  preferredGender: string;
  preferredAge: string;
  languagePreference: string;
  culturalConsiderations: string;
}

export default function MatchingPreferencesModal({
  isOpen,
  onClose,
  setMedicalProfile,
  profile,
}: MatchingPreferencesModalProps) {
  const t = useTranslations("Client.profileModal");
  const [formData, setFormData] = useState<MatchingPreferencesData>({
    preferredGender: profile?.preferredGender || "",
    preferredAge: profile?.preferredAge || "",
    languagePreference: profile?.languagePreference || "",
    culturalConsiderations: profile?.culturalConsiderations || "",
  });

  const preferredGenderOptions = [
    { value: "noPreference", label: "No preference" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const preferredAgeOptions = [
    { value: "any", label: "Any Age" },
    { value: "younger", label: "Younger (20-35)" },
    { value: "middle", label: "Middle-aged (36-55)" },
    { value: "older", label: "Older (56+)" },
  ];

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

  const handleSubmit = async (data: MatchingPreferencesData) => {
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
              {t("step8.title")}
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-1">
              {t("step8.subtitle")}
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
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label className="font-light mb-3 text-base">
                  {t("step8.preferredGender")}
                </Label>
                <select
                  name="preferredGender"
                  value={formData.preferredGender}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {t("step8.preferredGenderPlaceholder")}
                  </option>
                  {preferredGenderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="font-light mb-3 text-base">
                  {t("step8.preferredAge")}
                </Label>
                <select
                  name="preferredAge"
                  value={formData.preferredAge}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{t("step8.preferredAgePlaceholder")}</option>
                  {preferredAgeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label
                htmlFor="languagePreference"
                className="font-light mb-3 text-base"
              >
                {t("step8.languagePreference")}
              </Label>
              <Input
                id="languagePreference"
                name="languagePreference"
                value={formData.languagePreference}
                onChange={handleChange}
                placeholder={t("step8.languagePreferencePlaceholder")}
              />
            </div>

            <div>
              <Label
                htmlFor="culturalConsiderations"
                className="font-light mb-3 text-base"
              >
                {t("step8.culturalConsiderations")}
              </Label>
              <textarea
                id="culturalConsiderations"
                name="culturalConsiderations"
                value={formData.culturalConsiderations}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                placeholder={t("step8.culturalConsiderationsPlaceholder")}
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
