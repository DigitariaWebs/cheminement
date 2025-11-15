"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { profileAPI } from "@/lib/api-client";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import BasicInformation from "@/components/dashboard/BasicInformation";

interface Profile {
  concernedPerson?: string;
  profileCompleted?: boolean;
}

export default function ClientProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("Client.profile");
  const tBasic = useTranslations("Dashboard.profile");

  const fetchProfile = async () => {
    try {
      const profileData = await profileAPI.get();
      setProfile(profileData as Profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getStatusInfo = () => {
    if (!profile?.profileCompleted) {
      return {
        icon: AlertCircle,
        text: t("incomplete"),
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      };
    }
    return {
      icon: CheckCircle2,
      text: t("complete"),
      color: "text-green-600",
      bgColor: "bg-green-50",
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          {t("title")}
        </h1>
        <p className="text-muted-foreground font-light mt-2">{t("subtitle")}</p>
      </div>

      {/* Basic Information */}
      <BasicInformation isEditable={true} />

      {/* Platform Benefits */}
      <div className="rounded-xl bg-muted/30 p-6">
        <h3 className="font-serif font-light text-lg text-foreground mb-4">
          {t("benefits.title")}
        </h3>
        <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground font-light">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefits.benefit1")}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefits.benefit2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefits.benefit3")}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefits.benefit4")}</span>
          </li>
        </ul>
      </div>

      {/* Account Information */}
      {!isLoading && profile && (
        <div className="rounded-xl bg-card p-6">
          <h2 className="text-xl font-serif font-light text-foreground mb-6">
            {t("accountInfo.title")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground font-light mb-1">
                {t("accountInfo.profileCompleted")}
              </p>
              <p className="text-foreground">
                {profile?.profileCompleted ? t("yes") : t("no")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
