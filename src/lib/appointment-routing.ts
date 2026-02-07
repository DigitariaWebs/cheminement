import Profile from "@/models/Profile";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import MedicalProfile from "@/models/MedicalProfile";

interface ProfessionalMatch {
  professionalId: string;
  score: number;
  reasons: string[];
}

/**
 * Normalize a string for comparison (remove accents, lowercase, trim)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .trim()
    .replace(/\s+/g, " "); // Normalize whitespace
}

/**
 * Calculate string similarity using multiple methods
 * Returns a score between 0 and 1
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);

  // Exact match
  if (normalized1 === normalized2) {
    return 1.0;
  }

  // One contains the other (high similarity)
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    const minLen = Math.min(normalized1.length, normalized2.length);
    const maxLen = Math.max(normalized1.length, normalized2.length);
    return minLen / maxLen; // Proportional similarity
  }

  // Word-based matching
  const words1 = normalized1.split(/\s+/);
  const words2 = normalized2.split(/\s+/);
  const commonWords = words1.filter((w) => words2.includes(w));
  if (commonWords.length > 0) {
    const wordSimilarity =
      commonWords.length / Math.max(words1.length, words2.length);
    return wordSimilarity * 0.7; // Slightly lower than exact match
  }

  // Character-based similarity (simple Levenshtein-like)
  const longer = normalized1.length > normalized2.length ? normalized1 : normalized2;
  const shorter = normalized1.length > normalized2.length ? normalized2 : normalized1;
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
    }
  }
  if (matches > 0) {
    return (matches / longer.length) * 0.5; // Lower weight for character matching
  }

  return 0;
}

/**
 * Find the best match between a client preference and a list of professional specialties
 * Returns the best similarity score and the matched item
 */
function findBestMatch(
  clientPreference: string,
  professionalList: string[],
  threshold: number = 0.3,
): { score: number; matchedItem?: string } {
  if (!clientPreference || !professionalList || professionalList.length === 0) {
    return { score: 0 };
  }

  let bestScore = 0;
  let bestMatch: string | undefined;

  for (const professionalItem of professionalList) {
    const similarity = calculateStringSimilarity(
      clientPreference,
      professionalItem,
    );
    if (similarity > bestScore) {
      bestScore = similarity;
      bestMatch = professionalItem;
    }
  }

  // Only return if above threshold
  if (bestScore >= threshold) {
    return { score: bestScore, matchedItem: bestMatch };
  }

  return { score: 0 };
}

/**
 * Calculate a relevancy score for a professional based on appointment requirements
 * and client medical profile preferences
 */
function calculateRelevancyScore(
  profile: {
    problematics?: string[];
    specialty?: string;
    approaches?: string[];
    ageCategories?: string[];
    modalities?: string[];
    sessionTypes?: string[];
    languages?: string[];
    availability?: {
      days: { day: string; isWorkDay: boolean }[];
    };
  },
  appointment: {
    issueType?: string;
    type: string;
    therapyType: string;
    preferredAvailability?: string[];
  },
  medicalProfile?: {
    primaryIssue?: string;
    secondaryIssues?: string[];
    therapyApproach?: string[];
    languagePreference?: string;
  } | null,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // ===== MATCHING BASED ON CLIENT PREFERENCES vs PROFESSIONAL SPECIALTIES =====

  // 1. Match primary issue with problematics/specialty (highest weight)
  if (medicalProfile?.primaryIssue) {
    const primaryIssue = medicalProfile.primaryIssue;

    // Check against problematics
    if (profile.problematics && profile.problematics.length > 0) {
      const match = findBestMatch(primaryIssue, profile.problematics, 0.3);
      if (match.score > 0) {
        const points = Math.round(match.score * 50); // Up to 50 points
        score += points;
        reasons.push(
          `Correspondance forte avec votre problématique principale (${Math.round(match.score * 100)}%)`,
        );
      }
    }

    // Check against specialty
    if (profile.specialty) {
      const match = findBestMatch(primaryIssue, [profile.specialty], 0.3);
      if (match.score > 0) {
        const points = Math.round(match.score * 30); // Up to 30 points
        score += points;
        reasons.push(
          `Spécialité correspondante (${Math.round(match.score * 100)}%)`,
        );
      }
    }
  }

  // 2. Match issueType from appointment (fallback if no medical profile)
  if (!medicalProfile?.primaryIssue && appointment.issueType) {
    if (profile.problematics && profile.problematics.length > 0) {
      const match = findBestMatch(appointment.issueType, profile.problematics, 0.3);
      if (match.score > 0) {
        const points = Math.round(match.score * 40);
        score += points;
        reasons.push(
          `Spécialisé dans ce type de problématique (${Math.round(match.score * 100)}%)`,
        );
      }
    }
    if (profile.specialty) {
      const match = findBestMatch(appointment.issueType, [profile.specialty], 0.3);
      if (match.score > 0) {
        const points = Math.round(match.score * 25);
        score += points;
        reasons.push(
          `Spécialité pertinente (${Math.round(match.score * 100)}%)`,
        );
      }
    }
  }

  // 3. Match secondary issues with problematics
  if (medicalProfile?.secondaryIssues && medicalProfile.secondaryIssues.length > 0) {
    let secondaryMatches = 0;
    let totalSecondaryScore = 0;

    for (const secondaryIssue of medicalProfile.secondaryIssues) {
      if (profile.problematics && profile.problematics.length > 0) {
        const match = findBestMatch(secondaryIssue, profile.problematics, 0.25);
        if (match.score > 0) {
          secondaryMatches++;
          totalSecondaryScore += match.score;
        }
      }
    }

    if (secondaryMatches > 0) {
      const avgScore = totalSecondaryScore / medicalProfile.secondaryIssues.length;
      const points = Math.round(avgScore * 20 * secondaryMatches); // Up to 20 points per match
      score += Math.min(points, 40); // Cap at 40 points total
      reasons.push(
        `${secondaryMatches} problématique(s) secondaire(s) correspondante(s)`,
      );
    }
  }

  // 4. Match therapy approach preferences
  if (medicalProfile?.therapyApproach && medicalProfile.therapyApproach.length > 0) {
    if (profile.approaches && profile.approaches.length > 0) {
      let approachMatches = 0;
      let totalApproachScore = 0;

      for (const clientApproach of medicalProfile.therapyApproach) {
        const match = findBestMatch(clientApproach, profile.approaches, 0.3);
        if (match.score > 0) {
          approachMatches++;
          totalApproachScore += match.score;
        }
      }

      if (approachMatches > 0) {
        const avgScore = totalApproachScore / approachMatches;
        const points = Math.round(avgScore * 25); // Up to 25 points
        score += points;
        reasons.push(
          `${approachMatches} approche(s) thérapeutique(s) correspondante(s)`,
        );
      }
    }
  }

  // 5. Match language preference
  if (medicalProfile?.languagePreference && profile.languages) {
    const languageMatch = findBestMatch(
      medicalProfile.languagePreference,
      profile.languages,
      0.5,
    );
    if (languageMatch.score > 0) {
      score += 10;
      reasons.push("Langue préférée disponible");
    }
  }

  // ===== MATCHING BASED ON APPOINTMENT REQUIREMENTS =====

  // 6. Match by modality (video, in-person, phone)
  if (profile.modalities) {
    const modalityMap: Record<string, string> = {
      video: "online",
      "in-person": "inPerson",
      phone: "phone",
    };
    const requiredModality = modalityMap[appointment.type];
    if (
      profile.modalities.includes(requiredModality) ||
      profile.modalities.includes("both")
    ) {
      score += 15;
      reasons.push("Offre la modalité de session requise");
    }
  }

  // 7. Match by session type (solo, couple, group)
  if (profile.sessionTypes) {
    const sessionTypeMap: Record<string, string> = {
      solo: "individual",
      couple: "couple",
      group: "group",
    };
    const requiredType = sessionTypeMap[appointment.therapyType];
    if (
      profile.sessionTypes.some((t) => t.toLowerCase().includes(requiredType))
    ) {
      score += 12;
      reasons.push("Offre le type de session requis");
    }
  }

  // 8. Match by availability
  if (appointment.preferredAvailability && profile.availability?.days) {
    const availableDays = profile.availability.days
      .filter((d) => d.isWorkDay)
      .map((d) => d.day);

    // Check if professional has any availability matching client preferences
    const availabilityMatches = appointment.preferredAvailability.some(
      (pref) => {
        const prefLower = pref.toLowerCase();
        if (prefLower.includes("weekday")) {
          return availableDays.some((d) =>
            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
              d,
            ),
          );
        }
        if (prefLower.includes("weekend")) {
          return availableDays.some((d) => ["Saturday", "Sunday"].includes(d));
        }
        return true;
      },
    );

    if (availabilityMatches) {
      score += 10;
      reasons.push("Disponibilité correspondante");
    }
  }

  // ===== BONUS POINTS =====

  // Profile completeness bonus
  if (profile.problematics && profile.problematics.length > 0) {
    score += 3;
  }
  if (profile.modalities && profile.modalities.length > 0) {
    score += 2;
  }
  if (profile.approaches && profile.approaches.length > 0) {
    score += 2;
  }

  return { score, reasons };
}

/**
 * Route an appointment to relevant professionals based on matching criteria
 * Returns the list of matched professionals and updates the appointment
 */
export async function routeAppointmentToProfessionals(
  appointmentId: string,
): Promise<{
  success: boolean;
  matches: ProfessionalMatch[];
  routingStatus: string;
}> {
  try {
    // Get the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return { success: false, matches: [], routingStatus: "pending" };
    }

    // Only route pending appointments that haven't been routed yet
    if (appointment.routingStatus !== "pending" || appointment.professionalId) {
      return {
        success: false,
        matches: [],
        routingStatus: appointment.routingStatus,
      };
    }

    // Get all active professionals with profiles
    const professionals = await User.find({
      role: "professional",
      status: "active",
    }).select("_id firstName lastName email");

    const professionalIds = professionals.map((p) => p._id);

    // Get profiles for all professionals
    const profiles = await Profile.find({
      userId: { $in: professionalIds },
      profileCompleted: true,
    });

    // Get client's medical profile for better matching
    let medicalProfile = null;
    try {
      medicalProfile = await MedicalProfile.findOne({
        userId: appointment.clientId,
      });
    } catch (error) {
      console.error("Error fetching medical profile:", error);
      // Continue without medical profile
    }

    // Calculate relevancy scores
    const matches: ProfessionalMatch[] = [];

    for (const profile of profiles) {
      const { score, reasons } = calculateRelevancyScore(
        profile,
        {
          issueType: appointment.issueType,
          type: appointment.type,
          therapyType: appointment.therapyType,
          preferredAvailability: appointment.preferredAvailability,
        },
        medicalProfile
          ? {
              primaryIssue: medicalProfile.primaryIssue,
              secondaryIssues: medicalProfile.secondaryIssues,
              therapyApproach: medicalProfile.therapyApproach,
              languagePreference: medicalProfile.languagePreference,
            }
          : null,
      );

      // Only include professionals with a minimum relevancy score
      // Lowered threshold to 15 to allow more matches with the new scoring system
      if (score >= 15) {
        matches.push({
          professionalId: profile.userId.toString(),
          score,
          reasons,
        });
      }
    }

    // Sort by score (highest first) and take top 5
    matches.sort((a, b) => b.score - a.score);
    const topMatches = matches.slice(0, 5);

    if (topMatches.length === 0) {
      // No matching professionals found, move to general list
      await Appointment.findByIdAndUpdate(appointmentId, {
        routingStatus: "general",
      });

      return { success: true, matches: [], routingStatus: "general" };
    }

    // Update appointment with proposed professionals
    const proposedIds = topMatches.map((m) => m.professionalId);
    await Appointment.findByIdAndUpdate(appointmentId, {
      routingStatus: "proposed",
      proposedTo: proposedIds,
    });

    // TODO: Send notifications to proposed professionals

    return { success: true, matches: topMatches, routingStatus: "proposed" };
  } catch (error) {
    console.error("Route appointment error:", error);
    return { success: false, matches: [], routingStatus: "pending" };
  }
}
