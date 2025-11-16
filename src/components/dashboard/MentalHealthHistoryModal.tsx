"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { IMedicalProfile } from "@/models/MedicalProfile";
import { medicalProfileAPI } from "@/lib/api-client";

interface MentalHealthHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  setMedicalProfile: (data: IMedicalProfile) => void;
  profile?: IMedicalProfile;
}

export interface MentalHealthHistoryData {
  previousTherapy: boolean;
  previousTherapyDetails: string;
  psychiatricHospitalization: boolean;
  currentTreatment: string;
  diagnosedConditions: string[];
}

export default function MentalHealthHistoryModal({
  isOpen,
  onClose,
  setMedicalProfile,
  profile,
}: MentalHealthHistoryModalProps) {
  const t = useTranslations("Client.profileModal");
  const [formData, setFormData] = useState<MentalHealthHistoryData>({
    previousTherapy: profile?.previousTherapy || false,
    previousTherapyDetails: profile?.previousTherapyDetails || "",
    psychiatricHospitalization: profile?.psychiatricHospitalization || false,
    currentTreatment: profile?.currentTreatment || "",
    diagnosedConditions: profile?.diagnosedConditions || [],
  });

  const diagnosedConditions = [
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
    "ADHD",
    "Autism Spectrum",
    "Personality Disorders",
  ];

  const handleMultiSelect = (value: string) => {
    const currentValues = formData.diagnosedConditions;
    if (currentValues.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        diagnosedConditions: currentValues.filter((v) => v !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        diagnosedConditions: [...currentValues, value],
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (data: MentalHealthHistoryData) => {
    try {
      const updatedProfile = { ...profile, ...data };
      const newProfile = (await medicalProfileAPI.update(updatedProfile)) as IMedicalProfile;
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
              {t("step2.title")}
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-1">
              {t("step2.subtitle")}
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
                  {t("step2.previousTherapy")}
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="previousTherapy"
                      value="true"
                      checked={formData.previousTherapy === true}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          previousTherapy: true,
                        }))
                      }
                    />
                    <span className="text-sm font-light">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="previousTherapy"
                      value="false"
                      checked={formData.previousTherapy === false}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          previousTherapy: false,
                        }))
                      }
                    />
                    <span className="text-sm font-light">No</span>
                  </label>
                </div>
              </div>

              <div>
                <Label className="font-light mb-3 text-base">
                  {t("step2.psychiatricHospitalization")}
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="psychiatricHospitalization"
                      value="true"
                      checked={formData.psychiatricHospitalization === true}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          psychiatricHospitalization: true,
                        }))
                      }
                    />
                    <span className="text-sm font-light">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="psychiatricHospitalization"
                      value="false"
                      checked={formData.psychiatricHospitalization === false}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          psychiatricHospitalization: false,
                        }))
                      }
                    />
                    <span className="text-sm font-light">No</span>
                  </label>
                </div>
              </div>
            </div>

            {formData.previousTherapy && (
              <div>
                <Label htmlFor="previousTherapyDetails" className="font-light mb-3 text-base">
                  {t("step2.previousTherapyDetails")}
                </Label>
                <textarea
                  id="previousTherapyDetails"
                  name="previousTherapyDetails"
                  value={formData.previousTherapyDetails}
                  onChange={handleChange}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                  placeholder={t("step2.previousTherapyDetailsPlaceholder")}
                />
              </div>
            )}

            <div>
              <Label htmlFor="currentTreatment" className="font-light mb-3 text-base">
                {t("step2.currentTreatment")}
              </Label>
              <Input
                id="currentTreatment"
                name="currentTreatment"
                value={formData.currentTreatment}
                onChange={handleChange}
                placeholder={t("step2.currentTreatmentPlaceholder")}
              />
            </div>

            <div>
              <Label className="font-light mb-3 text-base">
                {t("step2.diagnosedConditions")}
              </Label>
              <p className="text-sm text-muted-foreground font-light mb-4">
                {t("step2.diagnosedConditionsDesc")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {diagnosedConditions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect(item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                      formData.diagnosedConditions.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
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
