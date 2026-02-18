import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

/**
 * GET /api/payments/methods
 * Get all payment methods for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      paymentMethods: user.paymentMethods || [],
      defaultPaymentMethod: user.defaultPaymentMethod,
      stripeCustomerId: user.stripeCustomerId,
    });
  } catch (error: unknown) {
    console.error(
      "Get payment methods error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to fetch payment methods",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/payments/methods
 * Add a new payment method for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();
    const { type, stripePaymentMethodId, setAsDefault } = data;

    if (!type || !["card", "transfer", "direct_debit"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid payment method type" },
        { status: 400 },
      );
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create Stripe customer if doesn't exist
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user._id.toString(),
        },
      });
      user.stripeCustomerId = customer.id;
    }

    let paymentMethodData: {
      type: "card" | "transfer" | "direct_debit";
      isDefault: boolean;
      verified: boolean;
      addedAt: Date;
      stripePaymentMethodId?: string;
      last4?: string;
      brand?: string;
      expiryMonth?: number;
      expiryYear?: number;
      bankName?: string;
      accountLast4?: string;
    } = {
      type,
      isDefault: setAsDefault || false,
      verified: false,
      addedAt: new Date(),
    };

    // Handle card payment method
    if (type === "card" && stripePaymentMethodId) {
      // Attach payment method to customer
      await stripe.paymentMethods.attach(stripePaymentMethodId, {
        customer: user.stripeCustomerId,
      });

      // Get payment method details
      const paymentMethod = await stripe.paymentMethods.retrieve(
        stripePaymentMethodId,
      );

      if (paymentMethod.card) {
        paymentMethodData.stripePaymentMethodId = stripePaymentMethodId;
        paymentMethodData.last4 = paymentMethod.card.last4;
        paymentMethodData.brand = paymentMethod.card.brand;
        paymentMethodData.expiryMonth = paymentMethod.card.exp_month;
        paymentMethodData.expiryYear = paymentMethod.card.exp_year;
        paymentMethodData.verified = true; // Cards are verified by Stripe
      }

      if (setAsDefault) {
        await stripe.customers.update(user.stripeCustomerId, {
          invoice_settings: {
            default_payment_method: stripePaymentMethodId,
          },
        });
        user.defaultPaymentMethod = stripePaymentMethodId;
      }
    }

    // Handle transfer (Interac) - requires manual verification
    if (type === "transfer") {
      paymentMethodData.verified = false; // Needs manual verification
    }

    // Handle direct debit - requires bank validation
    if (type === "direct_debit") {
      paymentMethodData.verified = false; // Needs bank validation
      paymentMethodData.bankName = data.bankName;
      paymentMethodData.accountLast4 = data.accountLast4;
    }

    // If setting as default, unset other defaults
    if (setAsDefault && user.paymentMethods) {
      user.paymentMethods.forEach((pm) => (pm.isDefault = false));
    }

    // Add payment method to user
    if (!user.paymentMethods) {
      user.paymentMethods = [];
    }
    user.paymentMethods.push(paymentMethodData);

    // Update profile completion status
    if (!user.profileCompletionStatus) {
      user.profileCompletionStatus = {
        personalInfo: false,
        paymentMethod: false,
        preferences: false,
        completed: false,
      };
    }
    user.profileCompletionStatus.paymentMethod = true;
    user.profileCompletionStatus.completed =
      user.profileCompletionStatus.personalInfo &&
      user.profileCompletionStatus.paymentMethod &&
      user.profileCompletionStatus.preferences;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Payment method added successfully",
        paymentMethod: paymentMethodData,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(
      "Add payment method error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to add payment method",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/payments/methods
 * Remove a payment method
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const paymentMethodId = searchParams.get("paymentMethodId");

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 },
      );
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove from Stripe if it's a card
    if (user.stripeCustomerId && paymentMethodId.startsWith("pm_")) {
      try {
        await stripe.paymentMethods.detach(paymentMethodId);
      } catch (err) {
        console.error("Failed to detach Stripe payment method:", err);
      }
    }

    // Remove from user's payment methods
    user.paymentMethods =
      user.paymentMethods?.filter(
        (pm) => pm.stripePaymentMethodId !== paymentMethodId,
      ) || [];

    // If this was the default, clear it
    if (user.defaultPaymentMethod === paymentMethodId) {
      user.defaultPaymentMethod = undefined;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Payment method removed successfully",
    });
  } catch (error: unknown) {
    console.error(
      "Delete payment method error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to delete payment method",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
