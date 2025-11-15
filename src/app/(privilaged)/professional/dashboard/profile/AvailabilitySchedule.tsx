"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Clock, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

export interface WeekSchedule {
  [key: string]: DaySchedule;
}

const TIME_OPTIONS: string[] = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    TIME_OPTIONS.push(time);
  }
}

const AvailabilitySchedule = () => {
  const t = useTranslations("Dashboard.profile");
  const tSchedule = useTranslations("Dashboard.schedule");

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
    <div className="rounded-xl bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-light text-foreground">
          {tSchedule("title")}
        </h2>
        <button
          onClick={() => {
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
  );
};

export default AvailabilitySchedule;
