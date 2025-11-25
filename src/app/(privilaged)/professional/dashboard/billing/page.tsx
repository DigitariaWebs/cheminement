"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Eye,
  Filter,
  Wallet,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { appointmentsAPI } from "@/lib/api-client";
import { AppointmentResponse } from "@/types/api";

interface Payment {
  _id: string;
  sessionId: string;
  client: string;
  date: string;
  sessionDate: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: AppointmentResponse["paymentStatus"];
  invoiceUrl?: string;
  paidDate?: string;
  paymentStatus?: string;
  cancelReason?: string;
}

export default function ProfessionalBillingPage() {
  const [activeTab, setActiveTab] = useState<"receivables" | "history">(
    "receivables",
  );
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Professional.billing");

  // Fetch real appointments from API
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsAPI.list();

      // Transform appointments to payment format
      const transformedPayments: Payment[] = data.map((apt) => {
        const client = apt.clientId;
        const clientName = client
          ? `${client.firstName} ${client.lastName}`
          : "Unknown Client";

        // Map payment status
        const status = apt.paymentStatus;

        // When paymentStatus is "cancelled", the client only pays a percentage
        // of the original session price. The backend already adjusted:
        // - price: actual amount charged to the client after cancellation policy
        // - platformFee: platform's share of that amount
        // - professionalPayout: net amount for the professional (may be 0)
        const grossAmount =
          apt.paymentStatus === "cancelled" ? apt.price : apt.price || 120;
        const platformFee =
          apt.paymentStatus === "cancelled"
            ? apt.platformFee
            : apt.platformFee || 12;
        const netAmount =
          apt.paymentStatus === "cancelled"
            ? apt.professionalPayout
            : apt.professionalPayout || 108;

        return {
          _id: apt._id,
          sessionId: `SES-${apt._id.slice(-6).toUpperCase()}`,
          client: clientName,
          date: apt.date,
          sessionDate: `${new Date(apt.date).toLocaleDateString()} ${apt.time}`,
          amount: grossAmount,
          platformFee: platformFee ?? 0,
          netAmount: netAmount ?? 0,
          status,
          paymentStatus: apt.paymentStatus,
          paidDate: apt.paidAt ? new Date(apt.paidAt).toISOString() : undefined,
          invoiceUrl: apt.paymentStatus === "paid" ? "#" : undefined,
          cancelReason: apt.cancelReason,
        };
      });

      setPayments(transformedPayments);
    } catch (err: unknown) {
      console.error("Error fetching appointments:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  const receivablePayments = payments.filter(
    (p) => p.status === "pending" || p.status === "processing",
  );
  const paidPayments = payments.filter(
    (p) =>
      p.status === "paid" ||
      p.status === "refunded" ||
      p.status === "cancelled",
  );

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

  const getStatusColor = (status: AppointmentResponse["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-green-500/15 text-green-700 dark:text-green-400";
      case "pending":
        return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400";
      case "processing":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-400";
      case "refunded":
        return "bg-red-500/15 text-red-700 dark:text-red-400";
      case "cancelled":
        return "bg-gray-500/15 text-gray-700 dark:text-gray-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: AppointmentResponse["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "refunded":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
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

  const handleDownloadReceipt = async (appointmentId: string) => {
    try {
      const response = await fetch(
        `/api/payments/receipt?appointmentId=${appointmentId}`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to download receipt");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${appointmentId.slice(-8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading receipt:", err);
      alert(err instanceof Error ? err.message : "Failed to download receipt");
    }
  };

  const displayPayments =
    activeTab === "receivables" ? receivablePayments : paidPayments;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchAppointments} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
      {displayPayments.length === 0 ? (
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
          {displayPayments.map((payment) => (
            <div
              key={payment._id}
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
                    {payment.status === "cancelled" && payment.cancelReason && (
                      <div className="md:col-span-4">
                        <p className="text-xs text-muted-foreground">
                          {t("cancelReason")}
                        </p>
                        <p className="font-medium text-foreground">
                          {payment.cancelReason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {payment.status === "paid" && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        className="gap-2 rounded-full"
                        onClick={() => handleDownloadReceipt(payment._id)}
                      >
                        <Download className="h-4 w-4" />
                        {t("downloadInvoice")}
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
