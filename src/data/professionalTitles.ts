/**
 * Liste des titres professionnels, ordre harmonisé avec la page d'accueil.
 * Ordre : 1. Psychologue, 2. Psychothérapeute, 3. Neuropsychologue, etc.
 */
export const PROFESSIONAL_TITLES = [
  { value: "psychologist", label: "Psychologue" },
  { value: "psychotherapist", label: "Psychothérapeute" },
  { value: "neuropsychologist", label: "Neuropsychologue" },
  { value: "psychoeducator", label: "Psychoéducateur" },
  { value: "occupationalTherapistMentalHealth", label: "Ergothérapeute en santé mentale" },
  { value: "psychiatrist", label: "Psychiatre" },
  { value: "otherProfessionals", label: "Autres professionnels" },
] as const;

/** Catégories d'âge (dès le début pour déterminer l'affichage de l'étape 4). */
export const AGE_CATEGORIES = [
  { value: "0-12", label: "Enfants (0-12)" },
  { value: "13-17", label: "Adolescents (13-17)" },
  { value: "18-64", label: "Adultes (18-64)" },
  { value: "65+", label: "Aînés (65+)" },
] as const;
