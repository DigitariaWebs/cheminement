"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, User, Filter, Eye } from "lucide-react";

interface Session {
  id: string;
  clientName: string;
  time: string;
  duration: number;
  type: "video" | "in-person" | "phone";
  status: "scheduled" | "completed" | "cancelled";
  issueType: string;
}

interface Request {
  id: string;
  patientName: string;
  requestedDate: string;
  requestedTime: string;
  issueType: string;
  urgency: "low" | "medium" | "high";
  isNewClient: boolean;
}

const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    time: "09:00",
    duration: 60,
    type: "video",
    status: "scheduled",
    issueType: "Anxiety",
  },
  {
    id: "2",
    clientName: "Michael Chen",
    time: "14:00",
    duration: 60,
    type: "in-person",
    status: "scheduled",
    issueType: "Depression",
  },
];

const MOCK_REQUESTS: Request[] = [
  {
    id: "1",
    patientName: "Emma Wilson",
    requestedDate: "2024-01-20",
    requestedTime: "10:00",
    issueType: "Anxiety",
    urgency: "high",
    isNewClient: true,
  },
  {
    id: "2",
    patientName: "James Anderson",
    requestedDate: "2024-01-22",
    requestedTime: "14:00",
    issueType: "Depression",
    urgency: "medium",
    isNewClient: false,
  },
];

export default function SchedulePage() {
  const t = useTranslations("Dashboard.scheduleCalendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [showRequests, setShowRequests] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(
        currentDate.getMonth() + (direction === "next" ? 1 : -1),
      );
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days = [];
    const current = new Date(startDate);

    while (days.length < 42) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const formatDate = (date: Date) => {
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "📹";
      case "in-person":
        return "👤";
      case "phone":
        return "📞";
      default:
        return "📅";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-light text-foreground">
              {t("title")}
            </h1>
            <p className="text-muted-foreground font-light mt-1">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRequests(!showRequests)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-light text-sm transition-colors ${
                showRequests
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <Filter className="h-4 w-4" />
              {showRequests ? t("showSessions") : t("showRequests")}
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateDate("prev")}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-serif font-light text-foreground min-w-[200px] text-center">
                {view === "day" && formatDate(currentDate)}
                {view === "week" &&
                  `${t("weekOf")} ${formatDate(getWeekDays()[0])}`}
                {view === "month" &&
                  `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
              </h2>
              <button
                onClick={() => navigateDate("next")}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm font-light text-primary hover:bg-primary/10 rounded-full transition-colors"
              >
                {t("today")}
              </button>
              <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                <button
                  onClick={() => setView("day")}
                  className={`px-3 py-1 text-sm font-light rounded-full transition-colors ${
                    view === "day"
                      ? "bg-background text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("day")}
                </button>
                <button
                  onClick={() => setView("week")}
                  className={`px-3 py-1 text-sm font-light rounded-full transition-colors ${
                    view === "week"
                      ? "bg-background text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("week")}
                </button>
                <button
                  onClick={() => setView("month")}
                  className={`px-3 py-1 text-sm font-light rounded-full transition-colors ${
                    view === "month"
                      ? "bg-background text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("month")}
                </button>
              </div>
            </div>
          </div>

          {view === "week" && (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-px bg-border/40 border border-border/40 rounded-lg overflow-hidden">
                  <div className="bg-muted/30 p-2"></div>
                  {getWeekDays().map((day, idx) => (
                    <div
                      key={idx}
                      className={`bg-card p-3 text-center ${
                        isToday(day) ? "bg-primary/10" : ""
                      }`}
                    >
                      <div className="text-xs font-light text-muted-foreground mb-1">
                        {dayNames[day.getDay()]}
                      </div>
                      <div
                        className={`text-sm font-light ${
                          isToday(day)
                            ? "text-primary font-medium"
                            : "text-foreground"
                        }`}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                  ))}

                  {hours.map((hour) => (
                    <React.Fragment key={hour}>
                      <div className="bg-muted/30 p-2 text-xs font-light text-muted-foreground text-right">
                        {hour}:00
                      </div>
                      {getWeekDays().map((day, idx) => (
                        <div
                          key={`day-${day}-${hour}-${idx}`}
                          className="bg-card p-2 min-h-[60px] relative"
                        >
                          {!showRequests &&
                            MOCK_SESSIONS.filter(
                              (s) => parseInt(s.time.split(":")[0]) === hour,
                            ).map((session) => (
                              <div
                                key={session.id}
                                className="bg-primary/10 border border-primary/20 rounded p-2 mb-1 hover:bg-primary/20 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-1 text-xs font-light">
                                  <span>{getTypeIcon(session.type)}</span>
                                  <span className="text-foreground">
                                    {session.clientName}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground font-light mt-1">
                                  {session.time} ({session.duration}m)
                                </div>
                              </div>
                            ))}
                          {showRequests &&
                            MOCK_REQUESTS.filter(
                              (r) =>
                                parseInt(r.requestedTime.split(":")[0]) ===
                                hour,
                            ).map((request) => (
                              <div
                                key={request.id}
                                className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-1 hover:bg-yellow-100 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-1 text-xs font-light">
                                  <User className="h-3 w-3" />
                                  <span className="text-foreground">
                                    {request.patientName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-light ${getUrgencyColor(request.urgency)}`}
                                  >
                                    {request.urgency}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "month" && (
            <div className="grid grid-cols-7 gap-px bg-border/40 border border-border/40 rounded-lg overflow-hidden">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="bg-muted/30 p-3 text-center text-sm font-light text-muted-foreground"
                >
                  {day}
                </div>
              ))}
              {getMonthDays().map((day, idx) => (
                <div
                  key={idx}
                  className={`bg-card p-3 min-h-[100px] ${
                    !isSameMonth(day) ? "opacity-40" : ""
                  } ${isToday(day) ? "bg-primary/5 ring-1 ring-primary/20" : ""}`}
                >
                  <div
                    className={`text-sm font-light mb-2 ${isToday(day) ? "text-primary font-medium" : "text-foreground"}`}
                  >
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {!showRequests &&
                      MOCK_SESSIONS.slice(0, 2).map((session) => (
                        <div
                          key={session.id}
                          className="bg-primary/10 rounded px-2 py-1 text-xs font-light truncate"
                        >
                          {session.time} {session.clientName}
                        </div>
                      ))}
                    {showRequests &&
                      MOCK_REQUESTS.slice(0, 2).map((request) => (
                        <div
                          key={request.id}
                          className="bg-yellow-50 rounded px-2 py-1 text-xs font-light truncate"
                        >
                          {request.requestedTime} {request.patientName}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === "day" && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-lg bg-muted/30 p-4">
                  <div className="text-sm font-light text-muted-foreground mb-1">
                    {t("totalSessions")}
                  </div>
                  <div className="text-2xl font-serif font-light text-foreground">
                    {MOCK_SESSIONS.length}
                  </div>
                </div>
                <div className="rounded-lg bg-muted/30 p-4">
                  <div className="text-sm font-light text-muted-foreground mb-1">
                    {t("pendingRequests")}
                  </div>
                  <div className="text-2xl font-serif font-light text-foreground">
                    {MOCK_REQUESTS.length}
                  </div>
                </div>
              </div>

              {hours.map((hour) => (
                <div key={hour} className="flex gap-4">
                  <div className="w-20 text-sm font-light text-muted-foreground pt-2">
                    {hour}:00
                  </div>
                  <div className="flex-1 min-h-[60px] border-l border-border/40 pl-4 space-y-2">
                    {!showRequests &&
                      MOCK_SESSIONS.filter(
                        (s) => parseInt(s.time.split(":")[0]) === hour,
                      ).map((session) => (
                        <div
                          key={session.id}
                          className="bg-primary/10 border border-primary/20 rounded-lg p-3 hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">
                                {getTypeIcon(session.type)}
                              </span>
                              <div>
                                <div className="font-light text-foreground">
                                  {session.clientName}
                                </div>
                                <div className="text-sm text-muted-foreground font-light">
                                  {session.time} - {session.duration} minutes •{" "}
                                  {session.issueType}
                                </div>
                              </div>
                            </div>
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-light text-sm hover:scale-105 transition-transform">
                              {t("startSession")}
                            </button>
                          </div>
                        </div>
                      ))}
                    {showRequests &&
                      MOCK_REQUESTS.filter(
                        (r) => parseInt(r.requestedTime.split(":")[0]) === hour,
                      ).map((request) => (
                        <div
                          key={request.id}
                          className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 hover:bg-yellow-100 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="font-light text-foreground">
                                  {request.patientName}
                                </div>
                                <div className="text-sm text-muted-foreground font-light flex items-center gap-2">
                                  {request.requestedTime} • {request.issueType}
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-light ${getUrgencyColor(request.urgency)}`}
                                  >
                                    {request.urgency}
                                  </span>
                                  {request.isNewClient && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-light bg-purple-100 text-purple-700">
                                      {t("new")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-full hover:bg-muted transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-light text-sm hover:scale-105 transition-transform">
                                {t("accept")}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
