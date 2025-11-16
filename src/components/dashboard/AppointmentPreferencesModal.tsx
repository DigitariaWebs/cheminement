"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { IMedicalProfile } from "@/models/MedicalProfile";
import { medicalProfileAPI } from "@/lib/api-client";

interface AppointmentPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  setMedicalProfile: (data: IMedicalProfile) => void;
  profile?: IMedicalProfile;
}

export interface AppointmentPreferencesData {
  availability: string[];
  modality: string;
  location: string;
  sessionFrequency: string;
  notes: string;
}

export default function AppointmentPreferencesModal({
  isOpen,
  onClose,
  setMedicalProfile,
  profile,
}: AppointmentPreferencesModalProps) {
  const t = useTranslations("Client.profileModal");
  const [formData, setFormData] = useState<AppointmentPreferencesData>({
    availability: profile?.availability || [],
    modality: profile?.modality || "",
    location: profile?.location || "",
    sessionFrequency: profile?.sessionFrequency || "",
    notes: profile?.notes || "",
  });

  const availabilityOptions = ["morning", "afternoon", "evening", "weekends"];

  const modalityOptions = [
    { value: "online", label: "Online" },
    { value: "inPerson", label: "In-Person" },
    { value: "both", label: "Both" },
  ];

  const sessionFrequencyOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const handleMultiSelect = (value: string) => {
    const currentValues = formData.availability;
    if (currentValues.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        availability: currentValues.filter((v) => v !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        availability: [...currentValues, value],
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

  const handleSubmit = async (data: AppointmentPreferencesData) => {
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
              {t("step6.title")}
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-1">
              {t("step6.subtitle")}
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
                {t("step6.availability")}
                <span className="text-primary ml-1">*</span>
              </Label>
              <p className="text-sm text-muted-foreground font-light mb-4">
                {t("step6.availabilityDesc")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availabilityOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect(item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-center transition-all ${
                      formData.availability.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {t(`preferences.${item}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <Label className="font-light mb-3 text-base">
                  {t("step6.modality")}
                </Label>
                <select
                  name="modality"
                  value={formData.modality}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{t("step6.modalityPlaceholder")}</option>
                  {modalityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="font-light mb-3 text-base">
                  {t("step6.sessionFrequency")}
                </Label>
                <select
                  name="sessionFrequency"
                  value={formData.sessionFrequency}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {t("step6.sessionFrequencyPlaceholder")}
                  </option>
                  {sessionFrequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="location" className="font-light mb-3 text-base">
                  {t("step6.location")}
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={t("step6.locationPlaceholder")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="font-light mb-3 text-base">
                {t("step6.notes")}
              </Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                placeholder={t("step6.notesPlaceholder")}
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
            disabled={formData.availability.length === 0}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
