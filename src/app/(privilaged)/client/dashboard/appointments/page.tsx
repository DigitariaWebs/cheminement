"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  MoreVertical,
  Download,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - replace with real data from API
const mockAppointments = {
  upcoming: [
    {
      id: 1,
      professional: {
        name: "Dr. Marie Dubois",
        title: "Psychologue",
      },
      date: "2025-02-20",
      time: "14:00",
      duration: 60,
      modality: "video",
      status: "scheduled",
      location: "En ligne",
      amount: 120,
      paymentStatus: "paid",
      notes: "Première séance de suivi",
    },
    {
      id: 2,
      professional: {
        name: "Dr. Marie Dubois",
        title: "Psychologue",
      },
      date: "2025-02-27",
      time: "14:00",
      duration: 60,
      modality: "video",
      status: "scheduled",
      location: "En ligne",
      amount: 120,
      paymentStatus: "pending",
    },
  ],
  past: [
    {
      id: 3,
      professional: {
        name: "Dr. Marie Dubois",
        title: "Psychologue",
      },
      date: "2025-02-13",
      time: "14:00",
      duration: 60,
      modality: "video",
      status: "completed",
      location: "En ligne",
      amount: 120,
      paymentStatus: "paid",
      notes: "Séance initiale - évaluation",
    },
    {
      id: 4,
      professional: {
        name: "Dr. Marie Dubois",
        title: "Psychologue",
      },
      date: "2025-02-06",
      time: "14:00",
      duration: 60,
      modality: "video",
      status: "completed",
      location: "En ligne",
      amount: 120,
      paymentStatus: "paid",
    },
  ],
};

export default function ClientAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const t = useTranslations("Client.appointments");

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "inPerson":
        return <MapPin className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-primary/15 text-primary";
      case "completed":
        return "bg-green-500/15 text-green-700 dark:text-green-400";
      case "cancelled":
        return "bg-red-500/15 text-red-700 dark:text-red-400";
      case "pending":
        return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-700 dark:text-green-400";
      case "pending":
        return "text-yellow-700 dark:text-yellow-400";
      case "refunded":
        return "text-blue-700 dark:text-blue-400";
      default:
        return "text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-CA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const appointments =
    activeTab === "upcoming"
      ? mockAppointments.upcoming
      : mockAppointments.past;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button className="gap-2 rounded-full">
          <Calendar className="h-4 w-4" />
          {t("requestNew")}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`rounded-t-lg px-6 py-3 font-medium transition ${
            activeTab === "upcoming"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("upcoming")}
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`rounded-t-lg px-6 py-3 font-medium transition ${
            activeTab === "past"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("past")}
        </button>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="rounded-3xl border border-border/20 bg-card/80 p-12 text-center shadow-lg">
          <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-4 font-serif text-xl text-foreground">
            {activeTab === "upcoming" ? t("noUpcoming") : t("noPast")}
          </h3>
          {activeTab === "upcoming" && (
            <Button className="mt-6 gap-2 rounded-full">
              <Calendar className="h-4 w-4" />
              {t("requestNew")}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-3xl border border-border/20 bg-card/80 p-6 shadow-lg transition hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  {/* Date and Time */}
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-primary/10 p-4">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-light text-foreground">
                        {formatDate(appointment.date)}
                      </h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointment.time}
                        </span>
                        <span>
                          {appointment.duration} {t("minutes")}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusColor(
                            appointment.status,
                          )}`}
                        >
                          {t(`status.${appointment.status}`)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {appointment.professional.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.professional.title}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getModalityIcon(appointment.modality)}
                      <span>{t(`modality.${appointment.modality}`)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{appointment.location}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {t("details.paymentStatus")}:{" "}
                      </span>
                      <span
                        className={`font-medium ${getPaymentStatusColor(
                          appointment.paymentStatus,
                        )}`}
                      >
                        {t(`payment.${appointment.paymentStatus}`)}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  {appointment.notes && (
                    <div className="rounded-2xl border border-border/20 bg-card/70 p-4">
                      <p className="text-sm font-medium text-foreground">
                        {t("details.notes")}:
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {appointment.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {activeTab === "upcoming" &&
                      appointment.status === "scheduled" && (
                        <>
                          {appointment.modality === "video" && (
                            <Button className="gap-2 rounded-full">
                              <Video className="h-4 w-4" />
                              {t("actions.joinSession")}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            className="gap-2 rounded-full"
                          >
                            {t("actions.reschedule")}
                          </Button>
                          <Button
                            variant="outline"
                            className="gap-2 rounded-full text-red-600 hover:text-red-700"
                          >
                            {t("actions.cancel")}
                          </Button>
                        </>
                      )}
                    {activeTab === "past" && (
                      <Button variant="outline" className="gap-2 rounded-full">
                        <Download className="h-4 w-4" />
                        Télécharger le reçu
                      </Button>
                    )}
                  </div>
                </div>

                {/* More Options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      {t("actions.viewDetails")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {t("actions.addToCalendar")}
                    </DropdownMenuItem>
                    {appointment.modality === "inPerson" && (
                      <DropdownMenuItem>
                        {t("actions.getDirections")}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
