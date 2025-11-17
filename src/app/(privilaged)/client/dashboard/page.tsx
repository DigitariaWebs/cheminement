"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Mail,
  Pencil,
  User,
  Video,
  Phone,
  MapPin,
  Clock,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { appointmentsAPI } from "@/lib/api-client";

interface Professional {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface Appointment {
  _id: string;
  professionalId: Professional;
  date: string;
  time: string;
  duration: number;
  type: "video" | "in-person" | "phone";
  status: "scheduled" | "completed" | "cancelled" | "no-show" | "pending";
  issueType?: string;
  notes?: string;
  meetingLink?: string;
  location?: string;
}

// Mock data - replace with real data from API
const mockData = {
  requestStatus: {
    status: "analyzing", // analyzing | matched | pending
    lastUpdate: "12 février 2025",
    nextStep:
      "Confirmation de votre professionnel et proposition de rendez-vous",
  },
  changeHistory: [
    {
      date: "12 février 2025",
      change: "Mise à jour des disponibilités (soir ajouté)",
      by: "Vous",
    },
    {
      date: "04 février 2025",
      change: "Précision de la problématique : anxiété et sommeil",
      by: "Vous",
    },
    {
      date: "29 janvier 2025",
      change: "Dossier analysé par l'équipe jumelage",
      by: "Équipe Je chemine",
    },
  ],
};

export default function ClientDashboardPage() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const { data: session, status } = useSession();
  const t = useTranslations("Client.overview");

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const data = (await appointmentsAPI.list()) as Appointment[];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = data.filter((apt: Appointment) => {
          const aptDate = new Date(apt.date);
          return (
            aptDate >= today && ["scheduled", "pending"].includes(apt.status)
          );
        });
        setUpcomingAppointments(upcoming.slice(0, 3)); // Limit to next 3 upcoming
      } catch (err) {
        console.error("Error fetching upcoming appointments:", err);
      }
    };
    fetchUpcomingAppointments();
  }, []);

  const getModalityIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section className="rounded-3xl border border-border/20 bg-linear-to-r from-primary/10 via-card to-card/80 p-8 shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
              {t("tagline")}
            </p>
            <h1 className="font-serif text-3xl font-light text-foreground lg:text-4xl">
              {t("welcome")} {status !== "loading" && session?.user.name} !
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t("welcomeMessage")}
            </p>
            <p className="text-sm font-medium text-primary">« {t("quote")} »</p>
          </div>
          <div className="rounded-3xl bg-card/70 p-6 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">{t("todayMission")}</p>
            <p className="mt-3">{t("todayMissionText")}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-10 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          {/* Request Status */}
          <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-light text-foreground">
                  {t("requestStatus.title")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("requestStatus.subtitle")}
                </p>
              </div>
              <span className="rounded-full bg-primary/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                {t(`requestStatus.${mockData.requestStatus.status}`)}
              </span>
            </div>

            <div className="mt-6 grid gap-4 rounded-3xl bg-card/70 p-6 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {t("requestStatus.takenCareBy")}
              </p>
              <p>
                {t("requestStatus.lastUpdate")}{" "}
                <span className="font-medium text-foreground">
                  {mockData.requestStatus.lastUpdate}
                </span>
              </p>
              <p>
                {t("requestStatus.nextStep")}{" "}
                <span className="font-medium text-foreground">
                  {t("requestStatus.nextStepText")}
                </span>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="gap-2 rounded-full px-5 py-5 text-sm font-medium"
              >
                <Link href="/client/dashboard/profile">
                  <Pencil className="h-4 w-4" />
                  {t("requestStatus.editProfile")}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-full px-5 py-5 text-sm font-medium"
              >
                <Mail className="h-4 w-4" />
                {t("requestStatus.contactTeam")}
              </Button>
            </div>

            {/* Change History */}
            <div className="mt-6 border-t border-border/40 pt-4">
              <button
                onClick={() => setIsHistoryOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-2xl bg-muted/30 px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted/50"
              >
                <span className="font-medium text-foreground">
                  {t("requestStatus.changeHistory")}
                </span>
                {isHistoryOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {isHistoryOpen && (
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {mockData.changeHistory.map((entry, index) => (
                    <li
                      key={index}
                      className="rounded-2xl border border-border/30 px-4 py-3"
                    >
                      <p className="font-medium text-foreground">
                        {entry.date}
                      </p>
                      <p>{entry.change}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                        {t("requestStatus.by")} {entry.by}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Upcoming Appointments */}
          <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-light text-foreground">
                  {t("upcomingAppointments.title")}
                </h2>
              </div>
              <Button
                asChild
                variant="outline"
                className="gap-2 rounded-full px-5 py-5 text-sm font-medium"
              >
                <Link href="/client/dashboard/appointments">
                  <Calendar className="h-4 w-4" />
                  {t("upcomingAppointments.viewAll")}
                </Link>
              </Button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="mt-6 rounded-3xl bg-muted/30 p-8 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {t("upcomingAppointments.noAppointments")}
                </p>
                <Button className="mt-4 gap-2 rounded-full">
                  <Link href="/appointment" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t("upcomingAppointments.requestAppointment")}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="rounded-2xl border border-border/20 bg-card/70 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-primary/10 p-3">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-medium text-foreground">
                          {formatDate(appointment.date)}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {appointment.time}
                          </span>
                          <span className="flex items-center gap-1">
                            {getModalityIcon(appointment.type)}
                            {appointment.type === "in-person"
                              ? "In Person"
                              : appointment.type.charAt(0).toUpperCase() +
                                appointment.type.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t("upcomingAppointments.with")}{" "}
                          {appointment.professionalId.firstName}{" "}
                          {appointment.professionalId.lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Quick Actions */}
          <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <h2 className="font-serif text-2xl font-light text-foreground">
              {t("quickActions.title")}
            </h2>
            <div className="mt-6 space-y-4">
              <Link
                href="/client/dashboard/profile"
                className="flex items-start gap-4 rounded-2xl border border-border/20 bg-card/70 p-5 transition hover:bg-muted/50"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {t("quickActions.viewProfile")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("quickActions.viewProfileDesc")}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Link>

              <Link
                href="/client/dashboard/appointments"
                className="flex items-start gap-4 rounded-2xl border border-border/20 bg-card/70 p-5 transition hover:bg-muted/50"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {t("quickActions.manageAppointments")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("quickActions.manageAppointmentsDesc")}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Link>

              <Link
                href="/client/dashboard/library"
                className="flex items-start gap-4 rounded-2xl border border-border/20 bg-card/70 p-5 transition hover:bg-muted/50"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {t("quickActions.browseResources")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("quickActions.browseResourcesDesc")}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </div>
          </section>

          {/* Support & Help */}
          <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
            <h2 className="font-serif text-2xl font-light text-foreground">
              {t("support.title")}
            </h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-border/20 bg-card/70 p-5">
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {t("support.email")}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("support.emailDesc")}
                    </p>
                    <a
                      href="mailto:contact@monimpression.com"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      contact@monimpression.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/20 bg-card/70 p-5">
                <div className="flex items-start gap-4">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {t("support.faq")}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("support.faqDesc")}
                    </p>
                    <Button
                      variant="link"
                      className="mt-2 h-auto p-0 text-sm text-primary"
                    >
                      {t("support.openFaq")}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/20 bg-card/70 p-5">
                <div className="flex items-start gap-4">
                  <Wallet className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {t("support.billing")}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("support.billingDesc")}
                    </p>
                    <Button
                      variant="link"
                      className="mt-2 h-auto p-0 text-sm text-primary"
                    >
                      {t("support.billingCenter")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
