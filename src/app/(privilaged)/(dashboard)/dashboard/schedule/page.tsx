"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Clock, Plus, X, Save } from "lucide-react";

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

export default function SchedulePage() {
  const t = useTranslations("Dashboard.schedule");

  const DAYS_OF_WEEK = [
    { key: "monday", label: t("days.monday") },
    { key: "tuesday", label: t("days.tuesday") },
    { key: "wednesday", label: t("days.wednesday") },
    { key: "thursday", label: t("days.thursday") },
    { key: "friday", label: t("days.friday") },
    { key: "saturday", label: t("days.saturday") },
    { key: "sunday", label: t("days.sunday") },
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

  const handleSave = () => {
    console.log("Saving schedule:", {
      schedule,
      sessionDuration,
      breakBetweenSessions,
    });
    // Here you would save to your backend
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          {t("title")}
        </h1>
        <p className="text-muted-foreground font-light mt-2">{t("subtitle")}</p>
      </div>

      {/* Session Settings */}
      <div className="rounded-xl bg-card p-6">
        <h2 className="text-xl font-serif font-light text-foreground mb-6">
          {t("sessionSettings")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="sessionDuration" className="font-light mb-2">
              {t("defaultDuration")}
            </Label>
            <select
              id="sessionDuration"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="30">30 {t("minutes")}</option>
              <option value="45">45 {t("minutes")}</option>
              <option value="60">60 {t("minutes")}</option>
              <option value="90">90 {t("minutes")}</option>
              <option value="120">120 {t("minutes")}</option>
            </select>
          </div>

          <div>
            <Label htmlFor="breakBetweenSessions" className="font-light mb-2">
              {t("breakBetween")}
            </Label>
            <select
              id="breakBetweenSessions"
              value={breakBetweenSessions}
              onChange={(e) => setBreakBetweenSessions(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="0">{t("noBreak")}</option>
              <option value="5">5 {t("minutes")}</option>
              <option value="10">10 {t("minutes")}</option>
              <option value="15">15 {t("minutes")}</option>
              <option value="30">30 {t("minutes")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-light text-foreground">
            {t("weeklySchedule")}
          </h2>
          <p className="text-sm text-muted-foreground font-light">
            {t("setHours")}
          </p>
        </div>

        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day.key}
              className={`rounded-lg p-4 transition-colors ${
                schedule[day.key].enabled
                  ? "bg-muted/30"
                  : "bg-muted/10 opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Day Toggle */}
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id={day.key}
                    checked={schedule[day.key].enabled}
                    onChange={() => toggleDay(day.key)}
                    className="h-4 w-4 text-primary focus:ring-primary border-border/20 rounded"
                  />
                </div>

                {/* Day Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <Label
                      htmlFor={day.key}
                      className="font-light text-base text-foreground cursor-pointer"
                    >
                      {day.label}
                    </Label>
                    {schedule[day.key].enabled && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToAllDays(day.key)}
                          className="text-xs text-primary hover:text-primary/80 font-light"
                        >
                          {t("copyToAll")}
                        </button>
                        <button
                          onClick={() => addTimeSlot(day.key)}
                          className="p-1 rounded-full hover:bg-muted transition-colors"
                          title={t("addTimeSlot")}
                        >
                          <Plus className="h-4 w-4 text-primary" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Time Slots */}
                  {schedule[day.key].enabled && (
                    <div className="space-y-2">
                      {schedule[day.key].slots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-background/50 rounded-lg p-3"
                        >
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />

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
                              className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                            >
                              {TIME_OPTIONS.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>

                            <span className="text-muted-foreground">
                              {t("to")}
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
                              className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                            >
                              {TIME_OPTIONS.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>

                          {schedule[day.key].slots.length > 1 && (
                            <button
                              onClick={() => removeTimeSlot(day.key, index)}
                              className="p-1 rounded-full hover:bg-muted transition-colors"
                              title={t("removeTimeSlot")}
                            >
                              <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!schedule[day.key].enabled && (
                    <p className="text-sm text-muted-foreground font-light">
                      {t("unavailable")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <Save className="h-4 w-4" />
          <span>{t("save")}</span>
        </button>
      </div>

      {/* Schedule Summary */}
      <div className="rounded-xl bg-muted/30 p-6">
        <h3 className="font-serif font-light text-lg text-foreground mb-4">
          {t("summary")}
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground font-light mb-2">
              {t("workingDays")}
            </p>
            <p className="text-foreground">
              {DAYS_OF_WEEK.filter((day) => schedule[day.key].enabled).length}{" "}
              {t("daysPerWeek")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground font-light mb-2">
              {t("sessionLength")}
            </p>
            <p className="text-foreground">
              {sessionDuration} {t("minutes")} + {breakBetweenSessions}{" "}
              {t("minBreak")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
