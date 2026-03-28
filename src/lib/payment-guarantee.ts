import { stripe } from "@/lib/stripe";
import User from "@/models/User";

/**
 * Client "Statut vert" : garantie de paiement en place (carte ou PAD enregistré chez Stripe).
 * Définit aussi le moyen de paiement par défaut du client Stripe pour d’éventuels prélèvements hors session.
 */
/**
 * @param setStripeDefault - Si true, enregistre ce moyen comme défaut chez Stripe (ex. 1er moyen ou garantie RDV).
 */
export async function markClientPaymentGuaranteeGreen(
  userId: string,
  stripeCustomerId: string,
  paymentMethodId: string,
  setStripeDefault = true,
): Promise<void> {
  await User.findByIdAndUpdate(userId, {
    paymentGuaranteeStatus: "green",
  });
  if (!setStripeDefault) {
    return;
  }
  try {
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  } catch (e) {
    console.error(
      "[payment-guarantee] Failed to set default payment method:",
      e,
    );
  }
}

/** Réaligne le statut avec les moyens de paiement encore attachés au client Stripe. */
export async function syncPaymentGuaranteeStatusWithStripe(
  userId: string,
  stripeCustomerId: string,
): Promise<void> {
  const [card, acss] = await Promise.all([
    stripe.paymentMethods.list({ customer: stripeCustomerId, type: "card" }),
    stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: "acss_debit",
    }),
  ]);
  const count = card.data.length + acss.data.length;
  await User.findByIdAndUpdate(userId, {
    paymentGuaranteeStatus: count > 0 ? "green" : "none",
  });
}
