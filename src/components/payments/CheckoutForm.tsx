"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Plus,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

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

interface CheckoutFormProps {
  amount: number;
  clientSecret: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function CheckoutForm({
  amount,
  clientSecret,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string>("new");
  const [showPaymentElement, setShowPaymentElement] = useState(true);

  // Simple inline radio component
  const RadioButton = ({
    id,
    value,
    checked,
    onChange,
    children,
  }: {
    id: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center space-x-3">
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className={cn(
          "h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "appearance-none relative cursor-pointer",
          "before:absolute before:inset-0 before:rounded-full before:transition-all before:m-0.5",
          checked && "before:bg-primary",
        )}
      />
      <Label
        htmlFor={id}
        className="flex items-center gap-3 flex-1 cursor-pointer rounded-lg border border-border/40 bg-card/50 p-4 hover:bg-accent/50 transition-colors"
      >
        {children}
      </Label>
    </div>
  );

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Check initial payment intent status
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          setIsComplete(true);
          onSuccess?.();
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Please provide payment details.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, onSuccess]);

  const fetchPaymentMethods = async () => {
    try {
      setLoadingMethods(true);
      const data = await apiClient.get<{ paymentMethods: PaymentMethod[] }>(
        "/payments/payment-methods",
      );
      setPaymentMethods(data.paymentMethods || []);

      // If there are saved methods, default to the first one
      if (data.paymentMethods && data.paymentMethods.length > 0) {
        setSelectedMethod(data.paymentMethods[0].id);
        setShowPaymentElement(false);
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
    } finally {
      setLoadingMethods(false);
    }
  };

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    setShowPaymentElement(value === "new");
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // If using a saved payment method, use confirmCardPayment directly
      if (selectedMethod !== "new" && selectedMethod) {
        // Confirm with saved payment method using the clientSecret
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: selectedMethod,
          },
        );

        if (error) {
          if (
            error.type === "card_error" ||
            error.type === "validation_error"
          ) {
            setMessage(error.message || "An error occurred");
          } else {
            setMessage("An unexpected error occurred.");
          }
          onError?.(error.message || "Payment failed");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          setMessage("Payment succeeded!");
          setIsComplete(true);
          setTimeout(() => {
            onSuccess?.();
          }, 1500);
        }
      } else {
        // Using new payment method with PaymentElement
        if (!elements) {
          setMessage("Payment form not ready. Please try again.");
          setLoading(false);
          return;
        }

        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/client/dashboard/appointments?payment_success=true`,
          },
          redirect: "if_required",
        });

        if (error) {
          if (
            error.type === "card_error" ||
            error.type === "validation_error"
          ) {
            setMessage(error.message || "An error occurred");
          } else {
            setMessage("An unexpected error occurred.");
          }
          onError?.(error.message || "Payment failed");
        } else {
          setMessage("Payment succeeded!");
          setIsComplete(true);
          setTimeout(() => {
            onSuccess?.();
          }, 1500);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed";
      setMessage(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isComplete) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">
          Payment Successful!
        </h3>
        <p className="text-muted-foreground">
          Your appointment has been confirmed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-border/40 bg-muted/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Amount to pay</span>
          <span className="text-2xl font-semibold text-foreground">
            ${amount.toFixed(2)} CAD
          </span>
        </div>
      </div>

      {/* Payment Method Selection */}
      {loadingMethods ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : paymentMethods.length > 0 ? (
        <div className="space-y-4">
          <Label className="text-base font-medium">Payment Method</Label>
          <div className="space-y-3">
            {/* Saved Payment Methods */}
            {paymentMethods.map((method) => (
              <RadioButton
                key={method.id}
                id={method.id}
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={handleMethodChange}
              >
                <div className="rounded-full bg-primary/10 p-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  {method.card && (
                    <>
                      <p className="font-medium text-foreground capitalize">
                        {method.card.brand} ••••{method.card.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.card.expMonth}/{method.card.expYear}
                      </p>
                    </>
                  )}
                </div>
              </RadioButton>
            ))}

            {/* Add New Payment Method Option */}
            <RadioButton
              id="new"
              value="new"
              checked={selectedMethod === "new"}
              onChange={handleMethodChange}
            >
              <div className="rounded-full bg-primary/10 p-2">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  Use a different card
                </p>
                <p className="text-sm text-muted-foreground">
                  Enter new payment details
                </p>
              </div>
            </RadioButton>
          </div>
        </div>
      ) : null}

      {/* Show PaymentElement only when "new" is selected or no saved methods */}
      {showPaymentElement && (
        <div className="space-y-4">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>
      )}

      {message && (
        <div
          className={`rounded-lg border p-4 flex items-start gap-3 ${
            message.includes("succeeded")
              ? "border-green-200 bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-200"
          }`}
        >
          {message.includes("succeeded") ? (
            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          )}
          <p className="text-sm">{message}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || loading || (selectedMethod === "new" && !elements)}
        className="w-full"
        size="lg"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Processing..." : `Pay $${amount.toFixed(2)} CAD`}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Your payment is secured by Stripe. We do not store your card details.
      </p>
    </form>
  );
}
