"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import ProfileCompletionModal, {
  ProfileData,
} from "@/components/dashboard/ProfileCompletionModal";

// Mock data - this would come from the signup process
const mockUserData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  license: "PSY-12345",
  specialty: "psychologist",
  location: "Montreal, QC",
  status: "pending-review",
};

export default function ProfilePage() {
  const t = useTranslations("Dashboard.profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const handleCompleteProfile = (data: ProfileData) => {
    setProfileData(data);
    setIsProfileComplete(true);
    console.log("Profile data saved:", data);
  };

  const getStatusInfo = () => {
    switch (mockUserData.status) {
      case "pending-review":
        return {
          icon: Clock,
          text: t("pendingReview"),
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        };
      case "approved":
        return {
          icon: CheckCircle2,
          text: t("approved"),
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "incomplete":
        return {
          icon: AlertCircle,
          text: t("incomplete"),
          color: "text-red-600",
          bgColor: "bg-red-50",
        };
      default:
        return {
          icon: Clock,
          text: t("pendingReview"),
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        };
    }
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <>
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-light text-foreground">
            {t("title")}
          </h1>
          <p className="text-muted-foreground font-light mt-2">
            {t("subtitle")}
          </p>
        </div>

        {/* Status Banner */}
        <div
          className={`rounded-xl ${status.bgColor} p-6 flex items-start gap-4`}
        >
          <StatusIcon className={`h-6 w-6 ${status.color} shrink-0 mt-0.5`} />
          <div className="flex-1">
            <h3 className={`font-light ${status.color} text-lg mb-2`}>
              {t("accountStatus")} {status.text}
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              {mockUserData.status === "pending-review" &&
                t("pendingReviewDesc")}
              {mockUserData.status === "incomplete" && t("incompleteDesc")}
              {mockUserData.status === "approved" && t("approvedDesc")}
            </p>
          </div>
        </div>

        {/* Profile Completion Banner */}
        {!isProfileComplete && (
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
        <div className="rounded-xl bg-card p-6">
          <h2 className="text-xl font-serif font-light text-foreground mb-6">
            {t("basicInfo")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {t("fullName")}
              </Label>
              <p className="text-foreground">
                {mockUserData.firstName} {mockUserData.lastName}
              </p>
            </div>

            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {t("email")}
              </Label>
              <p className="text-foreground">{mockUserData.email}</p>
            </div>

            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {t("phone")}
              </Label>
              <p className="text-foreground">{mockUserData.phone}</p>
            </div>

            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {t("location")}
              </Label>
              <p className="text-foreground">{mockUserData.location}</p>
            </div>

            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {t("license")}
              </Label>
              <p className="text-foreground">{mockUserData.license}</p>
            </div>

            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {t("specialty")}
              </Label>
              <p className="text-foreground capitalize">
                {mockUserData.specialty.replace("-", " ")}
              </p>
            </div>
          </div>

          {!isProfileComplete && (
            <div className="mt-6 pt-6 border-t border-border/40">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-muted text-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:bg-muted/80 text-sm"
              >
                {t("completeSetup")}
              </button>
            </div>
          )}
        </div>

        {/* Profile Details - Only show after completion */}
        {isProfileComplete && profileData && (
          <>
            <div className="rounded-xl bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-light text-foreground">
                  {t("professionalSpec")}
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-primary hover:text-primary/80 font-light"
                >
                  {t("edit")}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="font-light mb-3 text-base">
                    {t("issueTypes")}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.problematics.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-light mb-3 text-base">
                    {t("approaches")}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.approaches.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-light mb-3 text-base">
                    {t("ageCategories")}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.ageCategories.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {profileData.skills.length > 0 && (
                  <div>
                    <Label className="font-light mb-3 text-base">
                      {t("additionalSkills")}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 bg-muted text-foreground rounded-full text-sm font-light"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-light text-foreground">
                  {t("about")}
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-primary hover:text-primary/80 font-light"
                >
                  {t("edit")}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="font-light mb-2 text-base">
                    {t("yearsExp")}
                  </Label>
                  <p className="text-foreground">
                    {profileData.yearsOfExperience} {t("years")}
                  </p>
                </div>

                <div>
                  <Label className="font-light mb-2 text-base">
                    {t("bio")}
                  </Label>
                  <p className="text-foreground leading-relaxed">
                    {profileData.bio}
                  </p>
                </div>
              </div>
            </div>
          </>
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
      </div>

      <ProfileCompletionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleCompleteProfile}
      />
    </>
  );
}
