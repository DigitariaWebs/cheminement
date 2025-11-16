"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { IMedicalProfile } from "@/models/MedicalProfile";
import { medicalProfileAPI } from "@/lib/api-client";

interface EmergencyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  setMedicalProfile: (data: IMedicalProfile) => void;
  profile?: IMedicalProfile;
}

export interface EmergencyInfoData {
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  crisisPlan: string;
  suicidalThoughts: boolean;
}

export default function EmergencyInfoModal({
  isOpen,
  onClose,
  setMedicalProfile,
  profile,
}: EmergencyInfoModalProps) {
  const t = useTranslations("Client.profileModal");
  const [formData, setFormData] = useState<EmergencyInfoData>({
    emergencyContactName: profile?.emergencyContactName || "",
    emergencyContactPhone: profile?.emergencyContactPhone || "",
    emergencyContactRelation: profile?.emergencyContactRelation || "",
    crisisPlan: profile?.crisisPlan || "",
    suicidalThoughts: profile?.suicidalThoughts || false,
  });

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

  const handleSubmit = async (data: EmergencyInfoData) => {
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
              {t("step7.title")}
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-1">
              {t("step7.subtitle")}
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
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <Label
                  htmlFor="emergencyContactName"
                  className="font-light mb-3 text-base"
                >
                  {t("step7.emergencyContactName")}
                  <span className="text-primary ml-1">*</span>
                </Label>
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  placeholder={t("step7.emergencyContactNamePlaceholder")}
                />
              </div>

              <div>
                <Label
                  htmlFor="emergencyContactPhone"
                  className="font-light mb-3 text-base"
                >
                  {t("step7.emergencyContactPhone")}
                  <span className="text-primary ml-1">*</span>
                </Label>
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder={t("step7.emergencyContactPhonePlaceholder")}
                />
              </div>

              <div>
                <Label
                  htmlFor="emergencyContactRelation"
                  className="font-light mb-3 text-base"
                >
                  {t("step7.emergencyContactRelation")}
                </Label>
                <Input
                  id="emergencyContactRelation"
                  name="emergencyContactRelation"
                  value={formData.emergencyContactRelation}
                  onChange={handleChange}
                  placeholder={t("step7.emergencyContactRelationPlaceholder")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="crisisPlan" className="font-light mb-3 text-base">
                {t("step7.crisisPlan")}
              </Label>
              <textarea
                id="crisisPlan"
                name="crisisPlan"
                value={formData.crisisPlan}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                placeholder={t("step7.crisisPlanPlaceholder")}
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="suicidalThoughts"
                  checked={formData.suicidalThoughts}
                  onChange={handleChange}
                />
                <span className="text-sm font-light">
                  {t("step7.suicidalThoughts")}
                </span>
              </label>
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
            disabled={
              !formData.emergencyContactName.trim() ||
              !formData.emergencyContactPhone.trim()
            }
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
