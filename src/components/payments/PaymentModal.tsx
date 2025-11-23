"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CheckoutForm from "./CheckoutForm";
import { Loader2, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  amount: number;
  professionalName: string;
  appointmentDate: string;
  onSuccess?: () => void;
}

export default function PaymentModal({
  open,
  onOpenChange,
  appointmentId,
  amount,
  professionalName,
  appointmentDate,
  onSuccess,
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post<{
        clientSecret: string;
        paymentIntentId: string;
      }>("/payments/create-intent", { appointmentId });

      setClientSecret(response.clientSecret);
    } catch (err: any) {
      console.error("Error creating payment intent:", err);
      setError(err.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    if (open && appointmentId) {
      createPaymentIntent();
    }
  }, [open, appointmentId, createPaymentIntent]);

  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#0f172a",
      borderRadius: "8px",
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-light">
            Complete Payment
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>Session with {professionalName}</p>
            <p className="text-sm">{appointmentDate}</p>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">
                Preparing payment...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Payment Error
                </p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && clientSecret && (
            <Elements
              options={{
                clientSecret,
                appearance,
              }}
              stripe={stripePromise}
            >
              <CheckoutForm
                amount={amount}
                onSuccess={handleSuccess}
                onError={setError}
              />
            </Elements>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
