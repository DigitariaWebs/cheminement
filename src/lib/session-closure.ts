import type { AppointmentStatus } from "@/types/api";

/** Nature de l'acte (facturation / dossier). */
export const SESSION_ACT_NATURE_VALUES = [
  "psychotherapy_individual_couple_family",
  "psychotherapy_child",
  "eval_psych_neuro",
  "psychological_expertise",
  "report_followup_notes",
] as const;

export type SessionActNature = (typeof SESSION_ACT_NATURE_VALUES)[number];

/** Issue de la rencontre — détermine le statut du RDV et la fraction facturée. */
export const SESSION_OUTCOME_VALUES = [
  "present",
  "late_cancel_24_48",
  "no_show_within_24",
  "rescheduled_agreed",
] as const;

export type SessionOutcome = (typeof SESSION_OUTCOME_VALUES)[number];

export function getBillingFraction(outcome: SessionOutcome): number {
  switch (outcome) {
    case "present":
      return 1;
    case "late_cancel_24_48":
      return 0.5;
    case "no_show_within_24":
      return 1;
    case "rescheduled_agreed":
      return 0;
    default:
      return 1;
  }
}

export function getAppointmentStatusForOutcome(
  outcome: SessionOutcome,
): AppointmentStatus {
  switch (outcome) {
    case "present":
    case "late_cancel_24_48":
      return "completed";
    case "no_show_within_24":
      return "no-show";
    case "rescheduled_agreed":
      return "cancelled";
    default:
      return "completed";
  }
}

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}
