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
  Plus,
  X,
} from "lucide-react";
import ProfileCompletionModal, {
  ProfileData,
} from "@/components/dashboard/ProfileCompletionModal";

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

interface WeekSchedule {
  [key: string]: DaySchedule;
}

const TIME_OPTIONS = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

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
  const tSchedule = useTranslations("Dashboard.schedule");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isScheduleEditable, setIsScheduleEditable] = useState(false);

  const DAYS_OF_WEEK = [
    { key: "monday", label: tSchedule("days.monday") },
    { key: "tuesday", label: tSchedule("days.tuesday") },
    { key: "wednesday", label: tSchedule("days.wednesday") },
    { key: "thursday", label: tSchedule("days.thursday") },
    { key: "friday", label: tSchedule("days.friday") },
    { key: "saturday", label: tSchedule("days.saturday") },
    { key: "sunday", label: tSchedule("days.sunday") },
  ];

  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    friday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    saturday: { enabled: false, slots: [] },
    sunday: { enabled: false, slots: [] },
  });

  const [sessionDuration, setSessionDuration] = useState("60");
  const [breakBetweenSessions, setBreakBetweenSessions] = useState("15");

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots:
          !prev[day].enabled && prev[day].slots.length === 0
            ? [{ start: "09:00", end: "17:00" }]
            : prev[day].slots,
      },
    }));
  };

  const addTimeSlot = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: "09:00", end: "17:00" }],
      },
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }));
  };

  const updateTimeSlot = (
    day: string,
    index: number,
    field: "start" | "end",
    value: string,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot,
        ),
      },
    }));
  };

  const handleSaveSchedule = () => {
    console.log("Saving schedule:", {
      schedule,
      sessionDuration,
      breakBetweenSessions,
    });
  };

  const copyToAllDays = (sourceDay: string) => {
    const sourceSchedule = schedule[sourceDay];
    const updatedSchedule: WeekSchedule = { ...schedule };

    DAYS_OF_WEEK.forEach((day) => {
      updatedSchedule[day.key] = {
        enabled: sourceSchedule.enabled,
        slots: sourceSchedule.slots.map((slot) => ({ ...slot })),
      };
    });

    setSchedule(updatedSchedule);
  };

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          {t("title")}
        </h1>
        <p className="text-muted-foreground font-light mt-2">{t("subtitle")}</p>
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
            {mockUserData.status === "pending-review" && t("pendingReviewDesc")}
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
        <div className="space-y-6">
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
                <Label className="font-light mb-2 text-base">{t("bio")}</Label>
                <p className="text-foreground leading-relaxed">
                  {profileData.bio}
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

      {/* Availability & Schedule Settings */}
      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-light text-foreground">
            {tSchedule("title")}
          </h2>
          <button
            onClick={() => {
              if (isScheduleEditable) {
                handleSaveSchedule();
              }
              setIsScheduleEditable(!isScheduleEditable);
            }}
            className="text-sm text-primary hover:text-primary/80 font-light"
          >
            {isScheduleEditable ? t("save") : t("edit")}
          </button>
        </div>

        {/* Session Settings */}
        <div className="mb-6">
          <h3 className="text-base font-serif font-light text-foreground mb-4">
            {tSchedule("sessionSettings")}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="sessionDuration" className="font-light mb-2">
                {tSchedule("defaultDuration")}
              </Label>
              <select
                id="sessionDuration"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(e.target.value)}
                disabled={!isScheduleEditable}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="30">30 {tSchedule("minutes")}</option>
                <option value="45">45 {tSchedule("minutes")}</option>
                <option value="60">60 {tSchedule("minutes")}</option>
                <option value="90">90 {tSchedule("minutes")}</option>
                <option value="120">120 {tSchedule("minutes")}</option>
              </select>
            </div>

            <div>
              <Label htmlFor="breakBetweenSessions" className="font-light mb-2">
                {tSchedule("breakBetween")}
              </Label>
              <select
                id="breakBetweenSessions"
                value={breakBetweenSessions}
                onChange={(e) => setBreakBetweenSessions(e.target.value)}
                disabled={!isScheduleEditable}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="0">{tSchedule("noBreak")}</option>
                <option value="5">5 {tSchedule("minutes")}</option>
                <option value="10">10 {tSchedule("minutes")}</option>
                <option value="15">15 {tSchedule("minutes")}</option>
                <option value="30">30 {tSchedule("minutes")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-serif font-light text-foreground">
              {tSchedule("weeklySchedule")}
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              {tSchedule("setHours")}
            </p>
          </div>

          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day.key}
                className={`rounded-lg p-3 transition-colors ${
                  schedule[day.key].enabled
                    ? "bg-muted/30"
                    : "bg-muted/10 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center pt-2">
                    <input
                      type="checkbox"
                      id={day.key}
                      checked={schedule[day.key].enabled}
                      onChange={() => toggleDay(day.key)}
                      disabled={!isScheduleEditable}
                      className="h-4 w-4 text-primary focus:ring-primary border-border/20 rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Label
                        htmlFor={day.key}
                        className="font-light text-sm text-foreground cursor-pointer"
                      >
                        {day.label}
                      </Label>
                      {schedule[day.key].enabled && isScheduleEditable && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToAllDays(day.key)}
                            className="text-xs text-primary hover:text-primary/80 font-light"
                          >
                            {tSchedule("copyToAll")}
                          </button>
                          <button
                            onClick={() => addTimeSlot(day.key)}
                            className="p-1 rounded-full hover:bg-muted transition-colors"
                            title={tSchedule("addTimeSlot")}
                          >
                            <Plus className="h-3 w-3 text-primary" />
                          </button>
                        </div>
                      )}
                    </div>

                    {schedule[day.key].enabled && (
                      <div className="space-y-2">
                        {schedule[day.key].slots.map((slot, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-background/50 rounded-lg p-2"
                          >
                            <Clock className="h-3 w-3 text-muted-foreground shrink-0" />

                            <div className="flex items-center gap-2 flex-1">
                              <select
                                value={slot.start}
                                onChange={(e) =>
                                  updateTimeSlot(
                                    day.key,
                                    index,
                                    "start",
                                    e.target.value,
                                  )
                                }
                                disabled={!isScheduleEditable}
                                className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                              >
                                {TIME_OPTIONS.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>

                              <span className="text-muted-foreground text-xs">
                                {tSchedule("to")}
                              </span>

                              <select
                                value={slot.end}
                                onChange={(e) =>
                                  updateTimeSlot(
                                    day.key,
                                    index,
                                    "end",
                                    e.target.value,
                                  )
                                }
                                disabled={!isScheduleEditable}
                                className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                              >
                                {TIME_OPTIONS.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {schedule[day.key].slots.length > 1 &&
                              isScheduleEditable && (
                                <button
                                  onClick={() => removeTimeSlot(day.key, index)}
                                  className="p-1 rounded-full hover:bg-muted transition-colors"
                                  title={tSchedule("removeTimeSlot")}
                                >
                                  <X className="h-3 w-3 text-muted-foreground" />
                                </button>
                              )}
                          </div>
                        ))}
                      </div>
                    )}

                    {!schedule[day.key].enabled && (
                      <p className="text-xs text-muted-foreground font-light">
                        {tSchedule("unavailable")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProfileCompletionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleCompleteProfile}
      />
    </div>
  );
}
