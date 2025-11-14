"use client";

import { useState } from "react";
import {
  Download,
  Eye,
  Filter,
  Wallet,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type PaymentStatus = "paid" | "pending" | "upcoming" | "processing";

interface Payment {
  id: number;
  sessionId: string;
  client: string;
  date: string;
  sessionDate: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: PaymentStatus;
  invoiceUrl?: string;
  paidDate?: string;
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: 1,
    sessionId: "SES-2025-001",
    client: "Jean Pierre",
    date: "2025-02-27",
    sessionDate: "2025-02-27 14:00",
    amount: 120,
    platformFee: 12,
    netAmount: 108,
    status: "upcoming",
  },
  {
    id: 2,
    sessionId: "SES-2025-002",
    client: "Marie Claire",
    date: "2025-02-20",
    sessionDate: "2025-02-20 14:00",
    amount: 120,
    platformFee: 12,
    netAmount: 108,
    status: "processing",
  },
  {
    id: 3,
    sessionId: "SES-2025-003",
    client: "Jean Pierre",
    date: "2025-02-13",
    sessionDate: "2025-02-13 14:00",
    amount: 120,
    platformFee: 12,
    netAmount: 108,
    status: "paid",
    paidDate: "2025-02-14",
    invoiceUrl: "#",
  },
  {
    id: 4,
    sessionId: "SES-2025-004",
    client: "Sophie Martin",
    date: "2025-02-06",
    sessionDate: "2025-02-06 14:00",
    amount: 120,
    platformFee: 12,
    netAmount: 108,
    status: "paid",
    paidDate: "2025-02-07",
    invoiceUrl: "#",
  },
  {
    id: 5,
    sessionId: "SES-2025-005",
    client: "Jean Pierre",
    date: "2025-01-30",
    sessionDate: "2025-01-30 14:00",
    amount: 120,
    platformFee: 12,
    netAmount: 108,
    status: "paid",
    paidDate: "2025-01-31",
    invoiceUrl: "#",
  },
  {
    id: 6,
    sessionId: "SES-2025-006",
    client: "Marie Claire",
    date: "2025-01-23",
    sessionDate: "2025-01-23 14:00",
    amount: 120,
    platformFee: 12,
    netAmount: 108,
    status: "paid",
    paidDate: "2025-01-24",
    invoiceUrl: "#",
  },
];

export default function ProfessionalBillingPage() {
  const [activeTab, setActiveTab] = useState<"receivables" | "history">(
    "receivables",
  );
  const [showBankDetails, setShowBankDetails] = useState(false);
  const t = useTranslations("Professional.billing");

  const receivablePayments = mockPayments.filter(
    (p) =>
      p.status === "pending" ||
      p.status === "upcoming" ||
      p.status === "processing",
  );
  const paidPayments = mockPayments.filter((p) => p.status === "paid");

  const totalReceivables = receivablePayments.reduce(
    (sum, p) => sum + p.netAmount,
    0,
  );
  const totalReceived = paidPayments.reduce((sum, p) => sum + p.netAmount, 0);
  const monthlyRevenue = paidPayments
    .filter((p) => {
      const date = new Date(p.paidDate || p.date);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, p) => sum + p.netAmount, 0);

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
        return <Calendar className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
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

  const payments =
    activeTab === "receivables" ? receivablePayments : paidPayments;

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
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-border/20 bg-card/80 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-500/10 p-3">
              <Clock className="h-6 w-6 text-yellow-700 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("totalReceivables")}
              </p>
              <p className="text-2xl font-light text-foreground">
                {totalReceivables.toFixed(2)} $
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/20 bg-card/80 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-700 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("totalReceived")}
              </p>
              <p className="text-2xl font-light text-foreground">
                {totalReceived.toFixed(2)} $
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/20 bg-card/80 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("monthlyRevenue")}
              </p>
              <p className="text-2xl font-light text-foreground">
                {monthlyRevenue.toFixed(2)} $
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details Section */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-light text-foreground">
            {t("bankDetails")}
          </h2>
          <Button
            onClick={() => setShowBankDetails(!showBankDetails)}
            variant="outline"
            className="gap-2 rounded-full"
          >
            {showBankDetails ? (
              <Eye className="h-4 w-4" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
            {showBankDetails ? t("hide") : t("show")}
          </Button>
        </div>

        {showBankDetails && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-border/20 bg-card/70 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("accountHolder")}
                  </p>
                  <p className="font-medium text-foreground">
                    Dr. Marie Dubois
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("institution")}
                  </p>
                  <p className="font-medium text-foreground">
                    Banque Nationale
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("accountNumber")}
                  </p>
                  <p className="font-medium text-foreground">••••••1234</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("transitNumber")}
                  </p>
                  <p className="font-medium text-foreground">00123</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("bankDetailsNote")}
            </p>
            <Button className="gap-2 rounded-full" variant="outline">
              <Wallet className="h-4 w-4" />
              {t("updateBankDetails")}
            </Button>
          </div>
        )}
      </section>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40">
        <button
          onClick={() => setActiveTab("receivables")}
          className={`rounded-t-lg px-6 py-3 font-medium transition ${
            activeTab === "receivables"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("receivables")} ({receivablePayments.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`rounded-t-lg px-6 py-3 font-medium transition ${
            activeTab === "history"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("paymentHistory")} ({paidPayments.length})
        </button>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <div className="rounded-3xl border border-border/20 bg-card/80 p-12 text-center shadow-lg">
          <DollarSign className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-4 font-serif text-xl text-foreground">
            {activeTab === "receivables"
              ? t("noReceivables")
              : t("noPaymentHistory")}
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
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
                        {t("session")} - {payment.client}
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
                  <div className="grid gap-4 rounded-2xl bg-muted/30 p-4 md:grid-cols-4">
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
                        {t("grossAmount")}
                      </p>
                      <p className="font-medium text-foreground">
                        {payment.amount.toFixed(2)} $
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("platformFee")}
                      </p>
                      <p className="font-medium text-foreground">
                        -{payment.platformFee.toFixed(2)} $
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("netAmount")}
                      </p>
                      <p className="font-medium text-primary">
                        {payment.netAmount.toFixed(2)} $
                      </p>
                    </div>
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
    </div>
  );
}
