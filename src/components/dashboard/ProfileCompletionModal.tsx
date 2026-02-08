"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Stepper } from "@/components/ui/stepper";
import { useTranslations } from "next-intl";
import { IProfile } from "@/models/Profile";
import { profileAPI } from "@/lib/api-client";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  setProfessionalProfile: (data: IProfile) => void;
  profile?: IProfile;
}

export interface ProfileData {
  problematics: string[];
  approaches: string[];
  ageCategories: string[];
  skills: string[];
  bio: string;
  yearsOfExperience: string;
}

export default function ProfileCompletionModal({
  isOpen,
  onClose,
  setProfessionalProfile,
  profile,
}: ProfileCompletionModalProps) {
  const t = useTranslations("Dashboard.profileModal");
  const [currentStep, setCurrentStep] = useState(0);

  const STEPS = [
    { title: t("steps.issueTypes"), description: t("steps.issueTypesDesc") },
    { title: t("steps.approaches"), description: t("steps.approachesDesc") },
    { title: t("steps.ageGroups"), description: t("steps.ageGroupsDesc") },
    {
      title: t("steps.additionalInfo"),
      description: t("steps.additionalInfoDesc"),
    },
  ];

  const [formData, setFormData] = useState<ProfileData>({
    problematics: profile?.problematics || [],
    approaches: profile?.approaches || [],
    ageCategories: profile?.ageCategories || [],
    skills: profile?.skills || [],
    bio: profile?.bio || "",
    yearsOfExperience: profile?.yearsOfExperience?.toString() || "",
  });

  const problematics = [
    "Intervention auprès des employés des services d'urgence (ambulanciers, policiers, pompiers…)",
    "Estime/affirmation de soi",
    "Oncologie",
    "Accident de la route",
    "Accident de travail",
    "Adaptation à l'école",
    "Adoption internationale",
    "Alcoolisme / toxicomanies",
    "Aliénation mentale",
    "Abus sexuel",
    "Anxiété",
    "Anxiété de performance",
    "Arrêt de travail",
    "Retour progressif au travail",
    "Approche intégrative",
    "Approche humaniste",
    "Approche TCC",
    "ACT",
    "Psychodynamique",
    "Pleine conscience",
    "Changement organisationnel",
    "Changements sociaux",
    "Charge mentale",
    "Climat de travail",
    "Conflits interpersonnels",
    "Communication",
    "Curatelle publique",
    "Déficit de l'attention/hyperactivité",
    "Déficience intellectuelle",
    "Dépendance affective",
    "Dépendance aux jeux de hasard et d'argent (en ligne)",
    "Dépendance aux jeux vidéo",
    "Dépendance aux contenus pornographiques",
    "Difficultés académiques",
    "Recherche de sens",
    "Relations amoureuses",
    "Relations au travail",
    "Intervention en milieu de travail",
    "Santé psychologique au travail",
    "Deuil",
    "Diversité culturelle",
    "Douance",
    "Douleur chronique / fibromyalgie",
    "Dynamique organisationnelle",
    "EMDR",
    "Épuisement professionnel/burnout",
    "Estime de soi",
    "Étape de la vie",
    "Évaluation neuropsychologique",
    "Évaluation psychologique",
    "Évaluation psychologique milieu scolaire",
    "Fertilité / Procréation assistée",
    "Garde d'enfants (expertise psychosociale)",
    "Gestion de carrière",
    "Gestion du stress",
    "Gestion de la colère",
    "Gestion des émotions",
    "Guerre / conflits armés (vétérans)",
    "Guerre / conflits armés (victimes)",
    "Habiletés de gestion",
    "Harcèlement au travail",
    "HPI-adulte",
    "TSA",
    "TSA adulte évaluation",
    "TSA adulte intervention",
    "Hypnose thérapeutique",
    "IMO",
    "Immigration",
    "Vieillissement",
    "Intérêts / Aptitudes au travail",
    "Intimidation",
    "Violence (agresseurs)",
    "Violence (victimes)",
    "Maladie dégénératives / sida",
    "Maladies physiques / handicaps",
    "Médiation familiale",
    "Monoparentalité / famille recomposée",
    "Orientation scolaire et professionnelle",
    "Orientation sexuelle",
    "Peur de vomir",
    "Peur d'avoir peur",
    "Peur de mourir",
    "Périnatalité",
    "Problématiques propres aux autochtones",
    "Problématiques propres aux agriculteurs",
    "Problématiques propres aux réfugiés",
    "Problèmes relationnels",
    "Proche aidant",
    "Psychosomatique",
    "Psychologie du sport",
    "La psychologie gériatrique",
    "Relations familiales",
    "Sectes",
    "Sélection de personnel/réaffectation",
    "Séparation/divorce",
    "Situations de crise",
    "Soins palliatifs",
    "Spiritualité",
    "Stress post-traumatique",
    "Stress financier",
    "Transexualité",
    "Troubles alimentaires",
    "Troubles anxieux, phobies, panique",
    "Troubles d'apprentissages",
    "Troubles de la personnalité",
    "TPL",
    "Troubles de l'humeur",
    "Troubles du langage",
    "Troubles du sommeil",
    "Troubles mentaux sévères et persistants",
    "Troubles neuropsychologiques",
    "Troubles obsessifs-compulsifs",
    "Identité de genre / LGBTQ+",
    "Addiction sexuelle et hypersexualité",
    "Affirmation de soi",
    "Anxiété de séparation",
    "Anxiété post-partum",
    "Asexualité et aromantisme",
    "Attachement chez les adultes",
    "Autosabotage",
    "Blessure morale",
    "Boulimie",
    "Leadership",
    "Gestion d'équipe",
    "Rôle de gestionnaire",
    "Compétences en matière de résolution de problèmes",
    "Compétences parentales",
    "Étape ou transition de vie",
    "Difficultés masculines",
    "Famille recomposée",
    "Fugue",
    "Gestion de la colère ordonnée par le tribunal",
    "Gestion de la douleur chronique",
    "Gestion du temps et organisation",
    "Grossesse et maternité",
    "Identité de genre",
    "Insomnie",
    "Le mensonge",
    "Motivation",
    "Perfectionnisme",
    "Procrastination",
    "Racisme, soutien à la discrimination",
    "Relations interpersonnelles",
    "Séparation ou divorce",
    "Problèmes professionnels",
    "Soutien aux réfugiés et aux immigrants",
    "Survivre à la maltraitance",
    "Fatigue chronique",
    "L'agoraphobie",
    "L'anxiété liée à la santé",
    "Dysrégulation émotionnelle",
    "Phobie",
    "Colère",
    "Personnalité dépendante",
    "Traitement du jeu pathologique",
    "Interventions/moyens TDAH",
    "Accumulation compulsive",
    "Traitement du trouble obsessionnel compulsif (TOC)",
    "Traitement du trouble panique",
    "Traitement pour l'anxiété sociale",
    "Trouble affectif saisonnier (TAS)",
    "Trouble de l'adaptation",
    "Trouble de la dépersonnalisation-déréalisation",
    "Troubles de l'attachement",
    "Psychose",
    "État dépressif",
    "Bipolarité",
    "Peur de vieillir",
    "Exposition mentale",
    "Anxiété chez les personnes âgées",
    "Fatigabilité",
    "Irritabilité",
    "Problèmes de sommeil",
    "Difficultés de concentration",
    "Difficultés à prendre des décisions",
    "Déficits des fonctions exécutives",
    "Médiation en milieu de travail lorsqu'une personne a un problème de santé mentale",
  ];

  const therapeuticApproaches = [
    "Cognitive Behavioral Therapy (CBT)",
    "Psychodynamic Therapy",
    "Humanistic Therapy",
    "Dialectical Behavior Therapy (DBT)",
    "EMDR",
    "Solution-Focused Therapy",
    "Mindfulness-Based Therapy",
    "Family Systems Therapy",
    "Acceptance and Commitment Therapy (ACT)",
  ];

  const ageCategories = [
    "Children (0-12)",
    "Adolescents (13-17)",
    "Young Adults (18-25)",
    "Adults (26-64)",
    "Seniors (65+)",
  ];

  const skills = [
    "Crisis Intervention",
    "Group Therapy",
    "Couples Counseling",
    "Family Therapy",
    "Neuropsychological Assessment",
    "Psychometric Testing",
    "Bilingual Services (French/English)",
    "Cultural Competency",
    "LGBTQ+ Affirmative Therapy",
  ];

  const handleMultiSelect = (field: keyof ProfileData, value: string) => {
    const currentValues = formData[field] as string[];
    if (currentValues.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: currentValues.filter((v) => v !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: [...currentValues, value],
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: ProfileData) => {
    try {
      const newProfile = (await profileAPI.update(data)) as IProfile;
      setProfessionalProfile(newProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.problematics.length > 0;
      case 1:
        return formData.approaches.length > 0;
      case 2:
        return formData.ageCategories.length > 0;
      case 3:
        return formData.bio.trim() !== "" && formData.yearsOfExperience !== "";
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-light text-foreground">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-1">
              {t("subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-6 border-b border-border/40">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Step 1: Issue Types */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-light text-foreground mb-2">
                  {t("step1.title")}
                  <span className="text-primary ml-1">
                    {t("step1.required")}
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground font-light">
                  {t("step1.subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-2">
                {problematics.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect("problematics", item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                      formData.problematics.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Therapeutic Approaches */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-light text-foreground mb-2">
                  {t("step2.title")}
                  <span className="text-primary ml-1">
                    {t("step1.required")}
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground font-light">
                  {t("step2.subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {therapeuticApproaches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect("approaches", item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                      formData.approaches.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Age Categories */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-light text-foreground mb-2">
                  {t("step3.title")}
                  <span className="text-primary ml-1">
                    {t("step1.required")}
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground font-light">
                  {t("step3.subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ageCategories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiSelect("ageCategories", item)}
                    className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                      formData.ageCategories.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-light text-foreground mb-2">
                  {t("step4.title")}
                </h3>
                <p className="text-sm text-muted-foreground font-light">
                  {t("step4.subtitle")}
                </p>
              </div>

              {/* Years of Experience */}
              <div>
                <Label
                  htmlFor="yearsOfExperience"
                  className="font-light mb-3 text-base"
                >
                  {t("step4.yearsExp")}
                  <span className="text-primary ml-1">
                    {t("step4.yearsExpRequired")}
                  </span>
                </Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="max-w-xs"
                  placeholder={t("step4.yearsPlaceholder")}
                />
              </div>

              {/* Skills */}
              <div>
                <Label className="font-light mb-3 text-base">
                  {t("step4.additionalSkills")}
                </Label>
                <p className="text-sm text-muted-foreground font-light mb-4">
                  {t("step4.additionalSkillsDesc")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skills.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleMultiSelect("skills", item)}
                      className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                        formData.skills.includes(item)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground hover:bg-muted"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Professional Bio */}
              <div>
                <Label htmlFor="bio" className="font-light mb-3 text-base">
                  {t("step4.bio")}
                  <span className="text-primary ml-1">
                    {t("step4.bioRequired")}
                  </span>
                </Label>
                <p className="text-sm text-muted-foreground font-light mb-4">
                  {t("step4.subtitle")}
                </p>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={6}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                  placeholder={t("step4.bioPlaceholder")}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border/40 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 text-foreground font-light transition-opacity disabled:opacity-0 disabled:pointer-events-none hover:text-muted-foreground"
          >
            {t("buttons.back")}
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-foreground font-light transition-colors hover:text-muted-foreground"
            >
              Save for Later
            </button>
            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {t("buttons.next")}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit(formData)}
                disabled={!canProceed()}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {t("buttons.complete")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
