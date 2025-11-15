"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import ProfileCompletionModal from "@/components/dashboard/ProfileCompletionModal";
import BasicInformation from "@/components/dashboard/BasicInformation";
import AvailabilitySchedule from "./AvailabilitySchedule";
import { IProfile } from "@/models/Profile";
import { profileAPI } from "@/lib/api-client";

export default function ProfilePage() {
  const t = useTranslations("Dashboard.profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [professionalProfile, setProfessionalProfile] =
    useState<IProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.get();
        setProfessionalProfile(response as IProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          {t("title")}
        </h1>
        <p className="text-muted-foreground font-light mt-2">{t("subtitle")}</p>
      </div>

      {/* Profile Completion Banner */}
      {!professionalProfile?.profileCompleted && (
        <div className="rounded-xl bg-primary/10 p-6 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-light text-foreground text-lg mb-2">
              {t("completeSetupTitle")}
            </h3>
            <p className="text-sm text-muted-foreground font-light mb-4">
              {t("completeSetupDesc")}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
            >
              {t("completeNow")}
            </button>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <BasicInformation isEditable={true} />

      {/* Professional Information */}
      <div className="rounded-xl bg-card p-6">
        <h2 className="text-xl font-serif font-light text-foreground mb-6">
          {t("professionalInfo")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label className="font-light mb-2">{t("license")}</Label>
            <p className="text-foreground">
              {professionalProfile?.license || "N/A"}
            </p>
          </div>

          <div>
            <Label className="font-light mb-2">{t("specialty")}</Label>
            <p className="text-foreground capitalize">
              {professionalProfile?.specialty || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Details - Only show after completion */}
      {professionalProfile && (
        <div className="space-y-6">
          <div className="rounded-xl bg-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-serif font-light text-foreground">
                {t("professionalSpec")}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="font-light mb-3 text-base">
                  {t("issueTypes")}
                </Label>
                {professionalProfile?.problematics &&
                professionalProfile.problematics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {professionalProfile.problematics.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">N/A</p>
                )}
              </div>

              <div>
                <Label className="font-light mb-3 text-base">
                  {t("approaches")}
                </Label>
                {professionalProfile?.approaches &&
                professionalProfile.approaches.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {professionalProfile.approaches.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">N/A</p>
                )}
              </div>

              <div>
                <Label className="font-light mb-3 text-base">
                  {t("ageCategories")}
                </Label>
                {professionalProfile?.ageCategories &&
                professionalProfile.ageCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {professionalProfile.ageCategories.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">N/A</p>
                )}
              </div>

              <div>
                <Label className="font-light mb-3 text-base">
                  {t("additionalSkills")}
                </Label>
                {professionalProfile?.skills &&
                professionalProfile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {professionalProfile.skills.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-muted text-foreground rounded-full text-sm font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">N/A</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-serif font-light text-foreground">
                {t("about")}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="font-light mb-2 text-base">
                  {t("yearsExp")}
                </Label>
                <p className="text-foreground">
                  {professionalProfile.yearsOfExperience || "N/A"}{" "}
                  {professionalProfile.yearsOfExperience ? t("years") : ""}
                </p>
              </div>

              <div>
                <Label className="font-light mb-2 text-base">{t("bio")}</Label>
                <p className="text-foreground leading-relaxed">
                  {professionalProfile?.bio || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platform Benefits Reminder */}
      <div className="rounded-xl bg-muted/30 p-6">
        <h3 className="font-serif font-light text-lg text-foreground mb-4">
          {t("accessTitle")}
        </h3>
        <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground font-light">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefit1")}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefit2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefit3")}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefit4")}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefit5")}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefit6")}</span>
          </li>
        </ul>
      </div>

      <AvailabilitySchedule />

      <ProfileCompletionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setProfessionalProfile={setProfessionalProfile}
      />
    </div>
  );
}
