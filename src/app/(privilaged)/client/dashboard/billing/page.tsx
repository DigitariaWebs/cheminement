"use client";

import { useState } from "react";
import {
  CreditCard,
  Download,
  Eye,
  Filter,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type PaymentStatus = "paid" | "pending" | "overdue" | "upcoming";

interface Payment {
  id: number;
  sessionId: string;
  professional: string;
  date: string;
  sessionDate: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod?: string;
  invoiceUrl?: string;
  dueDate?: string;
}

interface PaymentMethod {
  id: number;
  type: "card" | "insurance";
  last4?: string;
  brand?: string;
  expiryDate?: string;
  isDefault: boolean;
  insuranceProvider?: string;
  policyNumber?: string;
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: 1,
    sessionId: "SES-2025-001",
    professional: "Dr. Marie Dubois",
    date: "2025-02-27",
    sessionDate: "2025-02-27 14:00",
    amount: 120,
    status: "upcoming",
    dueDate: "2025-02-27",
  },
  {
    id: 2,
    sessionId: "SES-2025-002",
    professional: "Dr. Marie Dubois",
    date: "2025-02-20",
    sessionDate: "2025-02-20 14:00",
    amount: 120,
    status: "pending",
    dueDate: "2025-02-25",
  },
  {
    id: 3,
    sessionId: "SES-2025-003",
    professional: "Dr. Marie Dubois",
    date: "2025-02-13",
    sessionDate: "2025-02-13 14:00",
    amount: 120,
    status: "paid",
    paymentMethod: "Visa ••••4242",
    invoiceUrl: "#",
  },
  {
    id: 4,
    sessionId: "SES-2025-004",
    professional: "Dr. Marie Dubois",
    date: "2025-02-06",
    sessionDate: "2025-02-06 14:00",
    amount: 120,
    status: "paid",
    paymentMethod: "Visa ••••4242",
    invoiceUrl: "#",
  },
  {
    id: 5,
    sessionId: "SES-2025-005",
    professional: "Dr. Marie Dubois",
    date: "2025-01-30",
    sessionDate: "2025-01-30 14:00",
    amount: 120,
    status: "paid",
    paymentMethod: "Assurance - Manulife",
    invoiceUrl: "#",
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryDate: "12/26",
    isDefault: true,
  },
  {
    id: 2,
    type: "insurance",
    insuranceProvider: "Manulife",
    policyNumber: "POL-123456",
    isDefault: false,
  },
];

export default function ClientBillingPage() {
  const [activeTab, setActiveTab] = useState<"owed" | "history">("owed");
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const t = useTranslations("Client.billing");

  const owedPayments = mockPayments.filter(
    (p) =>
      p.status === "pending" ||
      p.status === "upcoming" ||
      p.status === "overdue",
  );
  const paidPayments = mockPayments.filter((p) => p.status === "paid");

  const totalOwed = owedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "bg-green-500/15 text-green-700 dark:text-green-400";
      case "pending":
        return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400";
      case "upcoming":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400";
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

  const payments = activeTab === "owed" ? owedPayments : paidPayments;

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
              <p className="text-sm text-muted-foreground">{t("totalOwed")}</p>
              <p className="text-2xl font-light text-foreground">
                {totalOwed.toFixed(2)} $
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
              <p className="text-sm text-muted-foreground">{t("totalPaid")}</p>
              <p className="text-2xl font-light text-foreground">
                {totalPaid.toFixed(2)} $
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/20 bg-card/80 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("paymentMethods")}
              </p>
              <p className="text-2xl font-light text-foreground">
                {mockPaymentMethods.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-light text-foreground">
            {t("paymentMethods")}
          </h2>
          <Button
            onClick={() => setShowPaymentMethods(!showPaymentMethods)}
            variant="outline"
            className="gap-2 rounded-full"
          >
            {showPaymentMethods ? (
              <Eye className="h-4 w-4" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
            {showPaymentMethods ? t("hide") : t("show")}
          </Button>
        </div>

        {showPaymentMethods && (
          <div className="mt-6 space-y-4">
            {mockPaymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-2xl border border-border/20 bg-card/70 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    {method.type === "card" ? (
                      <CreditCard className="h-5 w-5 text-primary" />
                    ) : (
                      <Wallet className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    {method.type === "card" ? (
                      <>
                        <p className="font-medium text-foreground">
                          {method.brand} ••••{method.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("expires")} {method.expiryDate}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-foreground">
                          {method.insuranceProvider}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("policy")} {method.policyNumber}
                        </p>
                      </>
                    )}
                    {method.isDefault && (
                      <span className="mt-1 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                        {t("default")}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
            <Button className="gap-2 rounded-full" variant="outline">
              <Plus className="h-4 w-4" />
              {t("addPaymentMethod")}
            </Button>
          </div>
        )}
      </section>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40">
        <button
          onClick={() => setActiveTab("owed")}
          className={`rounded-t-lg px-6 py-3 font-medium transition ${
            activeTab === "owed"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("paymentsOwed")} ({owedPayments.length})
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
          <Wallet className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-4 font-serif text-xl text-foreground">
            {activeTab === "owed" ? t("noPaymentsOwed") : t("noPaymentHistory")}
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
                        {t("session")} - {payment.professional}
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
                  <div className="grid gap-4 rounded-2xl bg-muted/30 p-4 md:grid-cols-3">
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
                        {t("amount")}
                      </p>
                      <p className="font-medium text-foreground">
                        {payment.amount.toFixed(2)} $
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
                    {payment.dueDate && (
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("dueDate")}
                        </p>
                        <p className="font-medium text-foreground">
                          {formatDate(payment.dueDate)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {payment.status === "paid" && payment.invoiceUrl && (
                      <Button
                        variant="outline"
                        className="gap-2 rounded-full"
                        asChild
                      >
                        <a href={payment.invoiceUrl} download>
                          <Download className="h-4 w-4" />
                          {t("downloadReceipt")}
                        </a>
                      </Button>
                    )}
                    {(payment.status === "pending" ||
                      payment.status === "upcoming" ||
                      payment.status === "overdue") && (
                      <Button className="gap-2 rounded-full">
                        <CreditCard className="h-4 w-4" />
                        {t("payNow")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
