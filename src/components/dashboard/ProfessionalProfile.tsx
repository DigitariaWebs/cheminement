"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { IProfile } from "@/models/Profile";
import { profileAPI } from "@/lib/api-client";

interface ProfessionalProfileProps {
  profile?: IProfile;
  userId?: string;
}

export default function ProfessionalProfile({
  profile,
  userId,
}: ProfessionalProfileProps) {
  const t = useTranslations("Dashboard.profile");
  const [professionalProfile, setProfessionalProfile] =
    useState<IProfile | null>(profile || null);
  const [isLoading, setIsLoading] = useState(!profile);

  const fetchProfile = useCallback(async () => {
    if (profile) return;

    try {
      setIsLoading(true);
      const response = userId
        ? await profileAPI.getById(userId)
        : await profileAPI.get();
      setProfessionalProfile(response as IProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, profile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!professionalProfile) {
    return (
      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <>
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

      {/* Professional Specialization */}
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

      {/* About Section */}
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
    </>
  );
}
