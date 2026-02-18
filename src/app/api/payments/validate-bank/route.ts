import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/payments/validate-bank
 * Initiate bank account validation for direct debit
 * In production, this would integrate with a bank verification service
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();
    const { bankName, accountNumber, transitNumber, institutionNumber } = data;

    // Validate required fields
    if (!bankName || !accountNumber || !transitNumber || !institutionNumber) {
      return NextResponse.json(
        { error: "Missing required bank account details" },
        { status: 400 },
      );
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // In production, integrate with a bank verification service like:
    // - Plaid (North America)
    // - Flinks (Canada)
    // - Stripe ACH verification
    // For now, simulate the verification process

    // Simulate micro-deposit verification or instant verification
    const accountLast4 = accountNumber.slice(-4);

    // Update user's bank validation status
    user.bankValidationStatus = "pending";

    // Find or create direct_debit payment method
    if (!user.paymentMethods) {
      user.paymentMethods = [];
    }

    const existingDebitMethod = user.paymentMethods.find(
      (pm) => pm.type === "direct_debit",
    );

    if (existingDebitMethod) {
      // Update existing
      existingDebitMethod.bankName = bankName;
      existingDebitMethod.accountLast4 = accountLast4;
      existingDebitMethod.verified = false; // Pending verification
    } else {
      // Add new
      user.paymentMethods.push({
        type: "direct_debit",
        isDefault: user.paymentMethods.length === 0, // First payment method is default
        bankName,
        accountLast4,
        verified: false,
        addedAt: new Date(),
      });
    }

    await user.save();

    // TODO: In production, initiate actual bank verification process
    // This might involve:
    // 1. Sending micro-deposits to the account
    // 2. Using instant verification via banking credentials
    // 3. Sending verification link to online banking

    return NextResponse.json({
      success: true,
      message: "Bank verification initiated",
      status: "pending",
      verificationMethod: "micro_deposits", // or 'instant', 'online_banking'
      accountLast4,
    });
  } catch (error: unknown) {
    console.error(
      "Bank validation error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to validate bank account",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/payments/validate-bank
 * Complete bank account validation
 * Called after user verifies micro-deposits or completes instant verification
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();
    const { verificationCode, deposit1, deposit2 } = data;

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.bankValidationStatus !== "pending") {
      return NextResponse.json(
        { error: "No pending bank validation" },
        { status: 400 },
      );
    }

    // In production, verify the deposits or code with your bank verification service
    // For now, simulate successful verification
    const isValid = true; // Replace with actual verification logic

    if (!isValid) {
      user.bankValidationStatus = "failed";
      await user.save();
      return NextResponse.json(
        { error: "Bank verification failed. Please check your information." },
        { status: 400 },
      );
    }

    // Mark as verified
    user.bankValidationStatus = "verified";
    user.bankValidatedAt = new Date();

    // Update the direct debit payment method to verified
    const debitMethod = user.paymentMethods?.find(
      (pm) => pm.type === "direct_debit",
    );

    if (debitMethod) {
      debitMethod.verified = true;
      debitMethod.verifiedAt = new Date();
    }

    await user.save();

    // Update any pending appointments to allow confirmation
    await Appointment.updateMany(
      {
        clientId: user._id,
        status: "pending",
        "payment.method": "direct_debit",
      },
      {
        $set: {
          bankValidationCompleted: true,
        },
      },
    );

    return NextResponse.json({
      success: true,
      message: "Bank account verified successfully",
      status: "verified",
    });
  } catch (error: unknown) {
    console.error(
      "Bank verification completion error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to complete bank verification",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/payments/validate-bank
 * Check bank validation status
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

    const debitMethod = user.paymentMethods?.find(
      (pm) => pm.type === "direct_debit",
    );

    return NextResponse.json({
      status: user.bankValidationStatus || "not_initiated",
      verifiedAt: user.bankValidatedAt,
      accountLast4: debitMethod?.accountLast4,
      bankName: debitMethod?.bankName,
      verified: debitMethod?.verified || false,
    });
  } catch (error: unknown) {
    console.error(
      "Get bank validation status error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to get bank validation status",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
