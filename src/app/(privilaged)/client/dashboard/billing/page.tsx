"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Download,
  Eye,
  Filter,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Loader2,
  Plus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PaymentModal, AddPaymentMethodModal } from "@/components/payments";
import { apiClient } from "@/lib/api-client";

type PaymentStatus =
  | "paid"
  | "pending"
  | "overdue"
  | "upcoming"
  | "processing"
  | "refunded"
  | "cancelled";

interface Payment {
  _id: string;
  sessionId: string;
  professional: string;
  date: string;
  sessionDate: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod?: string;
  invoiceUrl?: string;
  dueDate?: string;
  paymentStatus?: string;
  appointmentStatus?: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

export default function ClientBillingPage() {
  const [activeTab, setActiveTab] = useState<"owed" | "history">("owed");
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [appointmentStatuses, setAppointmentStatuses] = useState<
    Record<string, string>
  >({});
  const t = useTranslations("Client.billing");

  // Fetch real appointments from API
  useEffect(() => {
    fetchAppointments();
    fetchPaymentMethods();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<
        Array<{
          _id: string;
          professionalId?: { firstName: string; lastName: string };
          paymentStatus?: string;
          status?: string;
          date: string;
          time?: string;
          price?: number;
          stripePaymentMethodId?: string;
        }>
      >("/appointments");

      // Store appointment statuses
      const statusMap: Record<string, string> = {};
      data.forEach((apt) => {
        statusMap[apt._id] = apt.status || "pending";
      });
      setAppointmentStatuses(statusMap);

      // Transform appointments to payment format
      const transformedPayments: Payment[] = data.map((apt) => {
        const professional = apt.professionalId;
        const professionalName = professional
          ? `${professional.firstName} ${professional.lastName}`
          : "Unknown Professional";

        // Map payment status - can't pay until professional confirms (status changes from pending to scheduled)
        let status: PaymentStatus = "pending";
        if (apt.paymentStatus === "paid") {
          status = "paid";
        } else if (apt.paymentStatus === "refunded") {
          status = "refunded";
        } else if (apt.paymentStatus === "cancelled") {
          status = "cancelled";
        } else if (apt.paymentStatus === "processing") {
          status = "processing";
        } else if (apt.paymentStatus === "pending") {
          // Check if appointment is confirmed by professional
          const appointmentStatus = apt.status;
          if (appointmentStatus === "pending") {
            // Appointment not yet confirmed by professional
            status = "upcoming"; // Show as upcoming but don't allow payment
          } else if (appointmentStatus === "scheduled") {
            // Appointment confirmed, payment can be made
            status = "pending";
          } else if (new Date(apt.date) > new Date()) {
            status = "upcoming";
          } else {
            status = "pending";
          }
        }

        return {
          _id: apt._id,
          sessionId: `SES-${apt._id.slice(-6).toUpperCase()}`,
          professional: professionalName,
          date: apt.date,
          sessionDate: `${new Date(apt.date).toLocaleDateString()} ${apt.time}`,
          amount: apt.price || 120,
          status,
          paymentStatus: apt.paymentStatus,
          appointmentStatus: apt.status,
          paymentMethod: apt.stripePaymentMethodId
            ? "Visa ••••4242"
            : undefined,
          invoiceUrl: apt.paymentStatus === "paid" ? "#" : undefined,
          dueDate: apt.date,
        };
      });

      setPayments(transformedPayments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      setLoadingPaymentMethods(true);
      const data = await apiClient.get<{ paymentMethods: PaymentMethod[] }>(
        "/payments/payment-methods",
      );
      setPaymentMethods(data.paymentMethods || []);
    } catch (err) {
      console.error("Error fetching payment methods:", err);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    if (
      !confirm(
        t("confirmDeletePaymentMethod") ||
          "Are you sure you want to delete this payment method?",
      )
    ) {
      return;
    }

    try {
      await apiClient.delete(
        `/payments/payment-methods?paymentMethodId=${paymentMethodId}`,
      );
      await fetchPaymentMethods();
    } catch (err) {
      console.error("Error deleting payment method:", err);
      alert(
        err instanceof Error ? err.message : "Failed to delete payment method",
      );
    }
  };

  const handlePayNow = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
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

  const handlePaymentSuccess = () => {
    // Refresh appointments after payment
    fetchAppointments();
    fetchPaymentMethods();
    setShowPaymentModal(false);
  };

  const owedPayments = payments.filter(
    (p) =>
      p.status === "pending" ||
      p.status === "upcoming" ||
      p.status === "overdue" ||
      p.status === "processing",
  );
  const paidPayments = payments.filter((p) => p.status === "paid");

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
      case "refunded":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-400";
      case "cancelled":
        return "bg-gray-500/15 text-gray-700 dark:text-gray-400";
      case "processing":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
      case "upcoming":
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      case "refunded":
        return <Wallet className="h-4 w-4" />;
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

  const displayPayments = activeTab === "owed" ? owedPayments : paidPayments;

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
                {paymentMethods.length}
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
            {loadingPaymentMethods ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="rounded-2xl border border-border/20 bg-card/70 p-8 text-center">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("noPaymentMethods") || "No payment methods added yet"}
                </p>
              </div>
            ) : (
              paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between rounded-2xl border border-border/20 bg-card/70 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      {method.card && (
                        <>
                          <p className="font-medium text-foreground capitalize">
                            {method.card.brand} ••••{method.card.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("expires")} {method.card.expMonth}/
                            {method.card.expYear}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                  </Button>
                </div>
              ))
            )}
            <Button
              className="gap-2 rounded-full w-full"
              variant="outline"
              onClick={() => setShowAddPaymentMethod(true)}
            >
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
      {displayPayments.length === 0 ? (
        <div className="rounded-3xl border border-border/20 bg-card/80 p-12 text-center shadow-lg">
          <Wallet className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-4 font-serif text-xl text-foreground">
            {activeTab === "owed" ? t("noPaymentsOwed") : t("noPaymentHistory")}
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
                    {payment.status === "paid" && (
                      <Button
                        variant="outline"
                        className="gap-2 rounded-full"
                        onClick={() => handleDownloadReceipt(payment._id)}
                      >
                        <Download className="h-4 w-4" />
                        {t("downloadReceipt")}
                      </Button>
                    )}
                    {(payment.status === "pending" ||
                      payment.status === "upcoming" ||
                      payment.status === "overdue") && (
                      <>
                        {appointmentStatuses[payment._id] === "pending" ? (
                          <div className="text-sm text-muted-foreground italic">
                            {t("waitingProfessionalConfirmation") ||
                              "Waiting for professional to confirm appointment before payment"}
                          </div>
                        ) : (
                          <Button
                            className="gap-2 rounded-full"
                            onClick={() => handlePayNow(payment)}
                          >
                            <CreditCard className="h-4 w-4" />
                            {t("payNow")}
                          </Button>
                        )}
                      </>
                    )}
                    {payment.status === "upcoming" &&
                      payment.paymentStatus === "pending" &&
                      payment.appointmentStatus === "pending" && (
                        <div className="text-sm text-muted-foreground italic">
                          {t("awaitingConfirmation") ||
                            "Awaiting professional confirmation before payment"}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {selectedPayment && (
        <PaymentModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          appointmentId={selectedPayment._id}
          amount={selectedPayment.amount}
          professionalName={selectedPayment.professional}
          appointmentDate={selectedPayment.sessionDate}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        open={showAddPaymentMethod}
        onOpenChange={setShowAddPaymentMethod}
        onSuccess={() => {
          fetchPaymentMethods();
          setShowAddPaymentMethod(false);
        }}
      />
    </div>
  );
}
