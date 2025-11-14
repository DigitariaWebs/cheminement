"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Video,
  MapPin,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageSquare,
} from "lucide-react";

interface Session {
  id: string;
  clientName: string;
  clientId: string;
  date: string;
  time: string;
  duration: number;
  type: "in-person" | "video" | "phone";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  paymentStatus: "paid" | "pending" | "overdue";
  amount: number;
  issueType: string;
  notes?: string;
}

// Mock data
const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    clientId: "1",
    date: "2024-01-20",
    time: "09:00",
    duration: 60,
    type: "video",
    status: "scheduled",
    paymentStatus: "pending",
    amount: 150,
    issueType: "Anxiety Disorders",
  },
  {
    id: "2",
    clientName: "Michael Chen",
    clientId: "2",
    date: "2024-01-20",
    time: "14:00",
    duration: 60,
    type: "in-person",
    status: "scheduled",
    paymentStatus: "paid",
    amount: 150,
    issueType: "Depression",
  },
  {
    id: "3",
    clientName: "Emily Rodriguez",
    clientId: "3",
    date: "2024-01-21",
    time: "10:00",
    duration: 60,
    type: "video",
    status: "scheduled",
    paymentStatus: "pending",
    amount: 150,
    issueType: "Stress Management",
  },
  {
    id: "4",
    clientName: "David Thompson",
    clientId: "4",
    date: "2024-01-21",
    time: "15:30",
    duration: 90,
    type: "in-person",
    status: "scheduled",
    paymentStatus: "paid",
    amount: 200,
    issueType: "Trauma & PTSD",
  },
  {
    id: "5",
    clientName: "Jessica Martinez",
    clientId: "5",
    date: "2024-01-19",
    time: "11:00",
    duration: 60,
    type: "video",
    status: "completed",
    paymentStatus: "paid",
    amount: 150,
    issueType: "Relationship Issues",
    notes: "Great progress on communication skills",
  },
  {
    id: "6",
    clientName: "Robert Kim",
    clientId: "6",
    date: "2024-01-19",
    time: "16:00",
    duration: 60,
    type: "in-person",
    status: "completed",
    paymentStatus: "pending",
    amount: 150,
    issueType: "Anxiety Disorders",
    notes: "Discussed coping mechanisms",
  },
  {
    id: "7",
    clientName: "Sarah Johnson",
    clientId: "1",
    date: "2024-01-18",
    time: "09:00",
    duration: 60,
    type: "video",
    status: "no-show",
    paymentStatus: "overdue",
    amount: 150,
    issueType: "Anxiety Disorders",
  },
  {
    id: "8",
    clientName: "Michael Chen",
    clientId: "2",
    date: "2024-01-22",
    time: "11:00",
    duration: 60,
    type: "video",
    status: "scheduled",
    paymentStatus: "pending",
    amount: 150,
    issueType: "Depression",
  },
  {
    id: "9",
    clientName: "Emily Rodriguez",
    clientId: "3",
    date: "2024-01-23",
    time: "13:00",
    duration: 60,
    type: "in-person",
    status: "scheduled",
    paymentStatus: "pending",
    amount: 150,
    issueType: "Stress Management",
  },
];

export default function SessionsPage() {
  const t = useTranslations("Dashboard.sessions");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const today = useMemo(() => new Date("2024-01-20"), []); // Mock today's date

  // Categorize sessions
  const todaysSessions = useMemo(() => {
    return MOCK_SESSIONS.filter((session) => {
      const sessionDate = new Date(session.date);
      return (
        sessionDate.toDateString() === today.toDateString() &&
        session.status === "scheduled"
      );
    }).sort((a, b) => a.time.localeCompare(b.time));
  }, [today]);

  const nextSession = useMemo(() => {
    const upcoming = MOCK_SESSIONS.filter((session) => {
      const sessionDateTime = new Date(`${session.date}T${session.time}`);
      return sessionDateTime > today && session.status === "scheduled";
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
    return upcoming[0] || null;
  }, [today]);

  const upcomingSessions = useMemo(() => {
    return MOCK_SESSIONS.filter((session) => {
      const sessionDateTime = new Date(`${session.date}T${session.time}`);
      return (
        sessionDateTime > today &&
        session.status === "scheduled" &&
        session.id !== nextSession?.id
      );
    })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
  }, [nextSession, today]);

  // Filter all sessions
  const filteredSessions = useMemo(() => {
    return MOCK_SESSIONS.filter((session) => {
      const matchesSearch =
        session.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.issueType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || session.status === statusFilter;

      const matchesType = typeFilter === "all" || session.type === typeFilter;

      const matchesPayment =
        paymentFilter === "all" || session.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesType && matchesPayment;
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
  }, [searchQuery, statusFilter, typeFilter, paymentFilter]);

  const stats = useMemo(() => {
    return {
      today: todaysSessions.length,
      upcoming: MOCK_SESSIONS.filter(
        (s) => new Date(s.date) > today && s.status === "scheduled",
      ).length,
      completed: MOCK_SESSIONS.filter((s) => s.status === "completed").length,
      revenue: MOCK_SESSIONS.filter((s) => s.paymentStatus === "paid").reduce(
        (sum, s) => sum + s.amount,
        0,
      ),
    };
  }, [todaysSessions, today]);

  const getStatusBadge = (status: Session["status"]) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      "no-show": "bg-orange-100 text-orange-700",
    };

    const labels = {
      scheduled: t("scheduled"),
      completed: t("completed"),
      cancelled: t("cancelled"),
      "no-show": t("noShow"),
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-light ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: Session["paymentStatus"]) => {
    const styles = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      overdue: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-light ${styles[paymentStatus]}`}
      >
        {t(paymentStatus)}
      </span>
    );
  };

  const getTypeIcon = (type: Session["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      case "phone":
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          {t("title")}
        </h1>
        <p className="text-muted-foreground font-light mt-2">{t("subtitle")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-card p-4">
          <p className="text-sm font-light text-muted-foreground">
            {t("todaySchedule")}
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {stats.today}
          </p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <p className="text-sm font-light text-muted-foreground">
            {t("upcomingTitle")}
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {stats.upcoming}
          </p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <p className="text-sm font-light text-muted-foreground">
            {t("completed")}
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {stats.completed}
          </p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <p className="text-sm font-light text-muted-foreground">
            {t("payment")}
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            ${stats.revenue}
          </p>
        </div>
      </div>

      {/* Next Session Highlight */}
      {nextSession && (
        <div className="rounded-xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 border border-primary/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-serif font-light text-foreground">
                  {t("nextSession")}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-2xl font-serif font-light text-foreground mb-2">
                    {nextSession.clientName}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-light">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatFullDate(nextSession.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-light">
                      {formatTime(nextSession.time)} ({nextSession.duration}{" "}
                      {t("minutes")})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(nextSession.type)}
                    <span className="text-sm font-light capitalize">
                      {nextSession.type.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPaymentStatusBadge(nextSession.paymentStatus)}
                  </div>
                </div>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg">
              {t("startSession")}
            </button>
          </div>
        </div>
      )}

      {/* Today's Sessions */}
      {todaysSessions.length > 0 && (
        <div className="rounded-xl bg-card p-6">
          <h2 className="text-xl font-serif font-light text-foreground mb-4">
            {t("todaySchedule")}
          </h2>
          <div className="space-y-3">
            {todaysSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-lg bg-muted/30 p-4 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-light text-muted-foreground">
                      {formatTime(session.time)}
                    </p>
                    <p className="text-xs text-muted-foreground font-light">
                      {session.duration} {t("minutes")}
                    </p>
                  </div>
                  <div className="w-px h-12 bg-border/40" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-1">
                      {session.clientName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-light">
                      <div className="flex items-center gap-1">
                        {getTypeIcon(session.type)}
                        <span className="capitalize">
                          {session.type.replace("-", " ")}
                        </span>
                      </div>
                      <span>•</span>
                      <span>{session.issueType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPaymentStatusBadge(session.paymentStatus)}
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-light text-sm transition-all duration-300 hover:scale-105">
                  {t("startSession")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Sessions Preview */}
      {upcomingSessions.length > 0 && (
        <div className="rounded-xl bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-light text-foreground">
              {t("upcomingTitle")}
            </h2>
            <span className="text-sm text-muted-foreground font-light">
              {t("noUpcoming")}
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-lg bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(session.type)}
                    <p className="text-sm font-medium text-foreground">
                      {session.clientName}
                    </p>
                  </div>
                  {getPaymentStatusBadge(session.paymentStatus)}
                </div>
                <div className="space-y-2 text-xs text-muted-foreground font-light">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatTime(session.time)} • {session.duration}{" "}
                      {t("minutes")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="rounded-xl bg-card overflow-hidden">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-serif font-light text-foreground">
                {t("filters")}
              </h2>
              {isFilterExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {(searchQuery ||
              statusFilter !== "all" ||
              typeFilter !== "all" ||
              paymentFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setPaymentFilter("all");
                }}
                className="text-sm text-primary hover:text-primary/80 font-light transition-colors"
              >
                {t("hideFilters")}
              </button>
            )}
          </div>

          {!isFilterExpanded &&
            (searchQuery ||
              statusFilter !== "all" ||
              typeFilter !== "all" ||
              paymentFilter !== "all") && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {searchQuery && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-light">
                    Search: {searchQuery}
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-light">
                    Status: {statusFilter}
                  </span>
                )}
                {typeFilter !== "all" && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-light">
                    Type: {typeFilter}
                  </span>
                )}
                {paymentFilter !== "all" && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-light">
                    Payment: {paymentFilter}
                  </span>
                )}
              </div>
            )}
        </div>

        {isFilterExpanded && (
          <div className="px-6 pb-6 space-y-6 border-t border-border/40 pt-6">
            <div>
              <label className="text-sm font-light text-muted-foreground mb-2 block">
                {t("allSessions")}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-light text-muted-foreground mb-2 block">
                  {t("status")}
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="font-light">{t("all")}</span>
                    </SelectItem>
                    <SelectItem value="scheduled">
                      <span className="font-light">{t("scheduled")}</span>
                    </SelectItem>
                    <SelectItem value="completed">
                      <span className="font-light">{t("completed")}</span>
                    </SelectItem>
                    <SelectItem value="cancelled">
                      <span className="font-light">{t("cancelled")}</span>
                    </SelectItem>
                    <SelectItem value="no-show">
                      <span className="font-light">{t("noShow")}</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-light text-muted-foreground mb-2 block">
                  {t("type")}
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="font-light">{t("all")}</span>
                    </SelectItem>
                    <SelectItem value="video">
                      <span className="font-light">{t("video")}</span>
                    </SelectItem>
                    <SelectItem value="in-person">
                      <span className="font-light">{t("inPerson")}</span>
                    </SelectItem>
                    <SelectItem value="phone">
                      <span className="font-light">{t("phone")}</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-light text-muted-foreground mb-2 block">
                  {t("payment")}
                </label>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("payment")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="font-light">{t("all")}</span>
                    </SelectItem>
                    <SelectItem value="paid">
                      <span className="font-light">{t("paid")}</span>
                    </SelectItem>
                    <SelectItem value="pending">
                      <span className="font-light">{t("pending")}</span>
                    </SelectItem>
                    <SelectItem value="overdue">
                      <span className="font-light">{t("overdue")}</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-light">
                  <span className="font-medium text-foreground">
                    {filteredSessions.length}
                  </span>
                  <span>
                    {MOCK_SESSIONS.length} {t("allSessions")}
                  </span>
                </div>
                {filteredSessions.length !== MOCK_SESSIONS.length && (
                  <span className="text-xs text-primary font-light">
                    {t("showFilters")}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All Sessions Table */}
      <div className="rounded-xl bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40">
          <h2 className="text-lg font-serif font-light text-foreground">
            {t("allSessions")}
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-light">{t("client")}</TableHead>
              <TableHead className="font-light">{t("dateTime")}</TableHead>
              <TableHead className="font-light">{t("type")}</TableHead>
              <TableHead className="font-light">{t("duration")}</TableHead>
              <TableHead className="font-light">{t("status")}</TableHead>
              <TableHead className="font-light">{t("payment")}</TableHead>
              <TableHead className="font-light">{t("amount")}</TableHead>
              <TableHead className="font-light">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSessions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground font-light"
                >
                  {t("noSessions")}
                </TableCell>
              </TableRow>
            ) : (
              filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-light">
                    <div>
                      <p className="font-medium text-foreground">
                        {session.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.issueType}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-light">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(session.date)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{formatTime(session.time)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-light">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(session.type)}
                      <span className="text-sm capitalize">
                        {session.type.replace("-", " ")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-light">
                    <span className="text-sm">
                      {session.duration} {t("minutes")}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(session.status)}</TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(session.paymentStatus)}
                  </TableCell>
                  <TableCell className="font-light">
                    <span className="text-sm font-medium">
                      ${session.amount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title={t("viewDetails")}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      {session.status === "scheduled" && (
                        <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-full font-light text-xs transition-all duration-300 hover:scale-105">
                          {t("startSession")}
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
