import User, { IUser } from "@/models/User";
import mongoose from "mongoose";

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date | string | undefined): number | null {
  if (!dateOfBirth) return null;

  const birthDate = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth;
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Check if user is a minor (under 18 in Quebec/Canada)
 */
export function isMinor(user: IUser | { dateOfBirth?: Date | string }): boolean {
  const age = calculateAge(user.dateOfBirth);
  return age !== null && age < 18;
}

/**
 * Get guardian/account manager for a user
 */
export async function getGuardian(
  userId: mongoose.Types.ObjectId | string,
): Promise<IUser | null> {
  try {
    const user = await User.findById(userId).populate("guardianId");
    if (!user || !user.guardianId) return null;

    const guardian = await User.findById(user.guardianId);
    return guardian;
  } catch (error) {
    console.error("Error getting guardian:", error);
    return null;
  }
}

/**
 * Get all accounts managed by a user (their children)
 */
export async function getManagedAccounts(
  userId: mongoose.Types.ObjectId | string,
): Promise<IUser[]> {
  try {
    const accounts = await User.find({
      guardianId: userId,
    });
    return accounts;
  } catch (error) {
    console.error("Error getting managed accounts:", error);
    return [];
  }
}

/**
 * Link a minor account to a guardian/parent account
 */
export async function linkGuardian(
  minorUserId: mongoose.Types.ObjectId | string,
  guardianUserId: mongoose.Types.ObjectId | string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const minor = await User.findById(minorUserId);
    const guardian = await User.findById(guardianUserId);

    if (!minor) {
      return { success: false, error: "Minor user not found" };
    }

    if (!guardian) {
      return { success: false, error: "Guardian user not found" };
    }

    // Verify the minor is actually a minor
    if (!isMinor(minor)) {
      return { success: false, error: "User is not a minor" };
    }

    // Update minor's guardian reference
    minor.guardianId = guardian._id;
    minor.accountManagerId = guardian._id;
    await minor.save();

    // Add minor to guardian's managed accounts if not already present
    if (!guardian.managedAccounts) {
      guardian.managedAccounts = [];
    }
    if (!guardian.managedAccounts.includes(minor._id)) {
      guardian.managedAccounts.push(minor._id);
      await guardian.save();
    }

    return { success: true };
  } catch (error) {
    console.error("Error linking guardian:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to link guardian",
    };
  }
}

/**
 * Unlink a guardian from a minor account
 */
export async function unlinkGuardian(
  minorUserId: mongoose.Types.ObjectId | string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const minor = await User.findById(minorUserId);

    if (!minor) {
      return { success: false, error: "User not found" };
    }

    const guardianId = minor.guardianId;

    // Remove guardian reference from minor
    minor.guardianId = undefined;
    minor.accountManagerId = undefined;
    await minor.save();

    // Remove minor from guardian's managed accounts
    if (guardianId) {
      const guardian = await User.findById(guardianId);
      if (guardian && guardian.managedAccounts) {
        guardian.managedAccounts = guardian.managedAccounts.filter(
          (id) => id.toString() !== minorUserId.toString(),
        );
        await guardian.save();
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error unlinking guardian:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unlink guardian",
    };
  }
}

/**
 * Check if a user can access another user's account (is guardian or is the user)
 */
export async function canAccessAccount(
  requestingUserId: mongoose.Types.ObjectId | string,
  targetUserId: mongoose.Types.ObjectId | string,
): Promise<boolean> {
  if (requestingUserId.toString() === targetUserId.toString()) {
    return true; // User can always access their own account
  }

  try {
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return false;

    // Check if requesting user is the guardian
    if (
      targetUser.guardianId &&
      targetUser.guardianId.toString() === requestingUserId.toString()
    ) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking account access:", error);
    return false;
  }
}
