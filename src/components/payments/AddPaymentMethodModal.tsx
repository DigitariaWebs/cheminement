"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle2, CreditCard } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface AddPaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function SetupForm({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An error occurred");
      onError?.(error.message || "Failed to add payment method");
      setLoading(false);
    } else if (setupIntent && setupIntent.status === "succeeded") {
      setMessage("Payment method added successfully!");
      setIsComplete(true);

      // Save payment method to backend
      try {
        await apiClient.post("/payments/payment-methods", {
          paymentMethodId: setupIntent.payment_method,
        });
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      } catch (err) {
        console.error("Error saving payment method:", err);
        setMessage("Payment method added but failed to save");
        setLoading(false);
      }
    } else {
      setMessage("Unable to add payment method");
      setLoading(false);
    }
  };

  if (isComplete) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">
          Payment Method Added!
        </h3>
        <p className="text-muted-foreground">
          Your payment method has been saved successfully.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-border/40 bg-muted/30 p-4">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Add Payment Method
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          This card will be saved for future payments. No charge will be made
          now.
        </p>
      </div>

      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {message && (
        <div
          className={`rounded-lg border p-4 flex items-start gap-3 ${
            message.includes("success")
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.includes("success") ? (
            <CheckCircle2 className="h-5 w-5 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 mt-0.5" />
          )}
          <p className="text-sm">{message}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full"
        size="lg"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Adding..." : "Add Payment Method"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Secured by Stripe. Your card details are encrypted and never stored on
        our servers.
      </p>
    </form>
  );
}

export default function AddPaymentMethodModal({
  open,
  onOpenChange,
  onSuccess,
}: AddPaymentMethodModalProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createSetupIntent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post<{
        clientSecret: string;
        setupIntentId: string;
      }>("/payments/setup-intent", {});

      setClientSecret(response.clientSecret);
    } catch (err) {
      console.error("Error creating setup intent:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize payment method form",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      createSetupIntent();
    } else {
      // Reset state when modal closes
      setClientSecret("");
      setError(null);
      setLoading(true);
    }
  }, [open, createSetupIntent]);

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
            Add Payment Method
          </DialogTitle>
          <DialogDescription>
            Save a payment method for quick and easy checkouts
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Preparing form...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
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
              <SetupForm onSuccess={handleSuccess} onError={setError} />
            </Elements>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
