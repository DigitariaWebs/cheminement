"use client";

import { useState, useMemo } from "react";
import {
  Download,
  Wallet,
  CheckCircle2,
  Clock,
  TrendingUp,
  Search,
  Users,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type PaymentStatus = "paid" | "pending" | "upcoming" | "processing" | "overdue";

interface Payment {
  id: number;
  sessionId: string;
  client: string;
  professional: string;
  date: string;
  sessionDate: string;
  amount: number;
  platformFee: number;
  professionalPayout: number;
  status: PaymentStatus;
  paymentMethod?: string;
  invoiceUrl?: string;
  paidDate?: string;
}

// Mock data - comprehensive admin view
const mockPayments: Payment[] = [
  {
    id: 1,
    sessionId: "SES-2025-001",
    client: "Jean Pierre",
    professional: "Dr. Marie Dubois",
    date: "2025-02-27",
    sessionDate: "2025-02-27 14:00",
    amount: 120,
    platformFee: 12,
    professionalPayout: 108,
    status: "upcoming",
  },
  {
    id: 2,
    sessionId: "SES-2025-002",
    client: "Marie Claire",
    professional: "Dr. Sophie Martin",
    date: "2025-02-20",
    sessionDate: "2025-02-20 14:00",
    amount: 120,
    platformFee: 12,
    professionalPayout: 108,
    status: "processing",
  },
  {
    id: 3,
    sessionId: "SES-2025-003",
    client: "Jean Pierre",
    professional: "Dr. Marie Dubois",
    date: "2025-02-13",
    sessionDate: "2025-02-13 14:00",
    amount: 120,
    platformFee: 12,
    professionalPayout: 108,
    status: "paid",
    paymentMethod: "Visa ••••4242",
    paidDate: "2025-02-14",
    invoiceUrl: "#",
  },
  {
    id: 4,
    sessionId: "SES-2025-004",
    client: "Sophie Martin",
    professional: "Alexandre Piché",
    date: "2025-02-06",
    sessionDate: "2025-02-06 14:00",
    amount: 120,
    platformFee: 12,
    professionalPayout: 108,
    status: "paid",
    paymentMethod: "Mastercard ••••5555",
    paidDate: "2025-02-07",
    invoiceUrl: "#",
  },
  {
    id: 5,
    sessionId: "SES-2025-005",
    client: "Jean Pierre",
    professional: "Dr. Marie Dubois",
    date: "2025-01-30",
    sessionDate: "2025-01-30 14:00",
    amount: 120,
    platformFee: 12,
    professionalPayout: 108,
    status: "paid",
    paymentMethod: "Assurance - Manulife",
    paidDate: "2025-01-31",
    invoiceUrl: "#",
  },
  {
    id: 6,
    sessionId: "SES-2025-006",
    client: "Marie Claire",
    professional: "Dr. Sophie Martin",
    date: "2025-01-23",
    sessionDate: "2025-01-23 14:00",
    amount: 120,
    platformFee: 12,
    professionalPayout: 108,
    status: "paid",
    paymentMethod: "Visa ••••4242",
    paidDate: "2025-01-24",
    invoiceUrl: "#",
  },
  {
    id: 7,
    sessionId: "SES-2025-007",
    client: "Thomas Leblanc",
    professional: "Alexandre Piché",
    date: "2025-01-15",
    sessionDate: "2025-01-15 10:00",
    amount: 120,
    platformFee: 12,
    professionalPayout: 108,
    status: "overdue",
  },
  {
    id: 8,
    sessionId: "SES-2025-008",
    client: "Isabelle Roy",
    professional: "Dr. Marie Dubois",
    date: "2025-01-10",
    sessionDate: "2025-01-10 15:00",
    amount: 120,
    platformFee: 12,
    professionalPayout: 108,
    status: "paid",
    paymentMethod: "Visa ••••3333",
    paidDate: "2025-01-11",
    invoiceUrl: "#",
  },
];

export default function AdminBillingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">(
    "all",
  );
  const t = useTranslations("Admin.billing");

  const filteredPayments = useMemo(() => {
    return mockPayments.filter((payment) => {
      const matchesSearch =
        search.trim().length === 0 ||
        [payment.client, payment.professional, payment.sessionId].some(
          (field) => field.toLowerCase().includes(search.toLowerCase()),
        );
      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    const totalRevenue = mockPayments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.platformFee, 0);

    const pendingRevenue = mockPayments
      .filter(
        (p) =>
          p.status === "pending" ||
          p.status === "upcoming" ||
          p.status === "processing",
      )
      .reduce((sum, p) => sum + p.platformFee, 0);

    const professionalPayouts = mockPayments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.professionalPayout, 0);

    const totalTransactions = mockPayments.filter(
      (p) => p.status === "paid",
    ).length;

    const overdueCount = mockPayments.filter(
      (p) => p.status === "overdue",
    ).length;

    return {
      totalRevenue,
      pendingRevenue,
      professionalPayouts,
      totalTransactions,
      overdueCount,
    };
  }, []);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "bg-green-500/15 text-green-700 dark:text-green-400";
      case "pending":
        return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400";
      case "upcoming":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400";
      case "processing":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-400";
      case "overdue":
        return "bg-red-500/15 text-red-700 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "upcoming":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          <Download className="h-4 w-4" />
          {t("exportReport")}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-border/20 bg-card/80 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("platformRevenue")}
              </p>
              <p className="text-2xl font-light text-foreground">
                {stats.totalRevenue.toFixed(2)} $
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/20 bg-card/80 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-500/10 p-3">
              <Clock className="h-6 w-6 text-yellow-700 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("pendingRevenue")}
              </p>
              <p className="text-2xl font-light text-foreground">
                {stats.pendingRevenue.toFixed(2)} $
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/20 bg-card/80 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-500/10 p-3">
              <Users className="h-6 w-6 text-green-700 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("professionalPayouts")}
              </p>
              <p className="text-2xl font-light text-foreground">
                {stats.professionalPayouts.toFixed(2)} $
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/20 bg-card/80 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-500/10 p-3">
              <AlertCircle className="h-6 w-6 text-red-700 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("overdue")}</p>
              <p className="text-2xl font-light text-foreground">
                {stats.overdueCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <section className="grid gap-4 rounded-3xl border border-border/20 bg-card/60 p-6 shadow-inner">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-full border border-border/40 bg-card/80 py-3 pl-11 pr-4 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              "all",
              "paid",
              "pending",
              "upcoming",
              "processing",
              "overdue",
            ] as const
          ).map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-lg"
                    : "border-border/40 bg-card/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {status !== "all" && getStatusIcon(status as PaymentStatus)}
                {t(`filters.${status}`)}
              </button>
            );
          })}
        </div>
      </section>

      {/* Payments List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-light text-foreground">
            {t("allTransactions")}
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredPayments.length}{" "}
            {filteredPayments.length > 1
              ? t("transactionsPlural")
              : t("transactions")}
          </span>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="rounded-3xl border border-border/20 bg-card/80 p-12 text-center shadow-lg">
            <Wallet className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 font-serif text-xl text-foreground">
              {t("noTransactions")}
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-3xl border border-border/20 bg-card/80 p-6 shadow-lg transition hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-xl font-light text-foreground">
                          {payment.client} → {payment.professional}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatDate(payment.sessionDate)}
                        </p>
                      </div>
                      <span
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${getStatusColor(
                          payment.status,
                        )}`}
                      >
                        {getStatusIcon(payment.status)}
                        {t(`status.${payment.status}`)}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid gap-4 rounded-2xl bg-muted/30 p-4 md:grid-cols-5">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("invoiceNumber")}
                        </p>
                        <p className="font-medium text-foreground">
                          {payment.sessionId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("clientPayment")}
                        </p>
                        <p className="font-medium text-foreground">
                          {payment.amount.toFixed(2)} $
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("platformFee")}
                        </p>
                        <p className="font-medium text-primary">
                          {payment.platformFee.toFixed(2)} $
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("professionalPayout")}
                        </p>
                        <p className="font-medium text-foreground">
                          {payment.professionalPayout.toFixed(2)} $
                        </p>
                      </div>
                      {payment.paymentMethod && (
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {t("paymentMethod")}
                          </p>
                          <p className="font-medium text-foreground">
                            {payment.paymentMethod}
                          </p>
                        </div>
                      )}
                      {payment.paidDate && (
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {t("paidDate")}
                          </p>
                          <p className="font-medium text-foreground">
                            {formatDate(payment.paidDate)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {payment.status === "paid" && payment.invoiceUrl && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          className="gap-2 rounded-full"
                          size="sm"
                          asChild
                        >
                          <a href={payment.invoiceUrl} download>
                            <Download className="h-4 w-4" />
                            {t("downloadInvoice")}
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
