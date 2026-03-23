"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Edit, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IMedicalProfile } from "@/models/MedicalProfile";
import { medicalProfileAPI } from "@/lib/api-client";
import { CHILD_DIAGNOSTICS } from "@/data/childDiagnostics";
import { ADULT_DIAGNOSTICS } from "@/data/adultDiagnostics";

interface MedicalProfileProps {
  profile?: IMedicalProfile;
  userId?: string;
  setProfile?: (profile: IMedicalProfile) => void;
  isEditable?: boolean;
}

export default function MedicalProfile({
  profile,
  userId,
  setProfile,
  isEditable = false,
}: MedicalProfileProps) {
  const t = useTranslations("Client.profile");
  const tMp = useTranslations("Client.profile.profileModal");
  const tMv = useTranslations("Client.medicalProfile");
  const [medicalProfile, setMedicalProfile] = useState<IMedicalProfile | null>(
    profile || null,
  );
  const [isLoading, setIsLoading] = useState(!profile);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("health-background");

  const updateProfile = useCallback(
    (updatedProfile: IMedicalProfile) => {
      setMedicalProfile(updatedProfile);
      if (setProfile) setProfile(updatedProfile);
    },
    [setProfile],
  );

  const fetchProfile = useCallback(async () => {
    if (profile) return;

    try {
      setIsLoading(true);
      const response = userId
        ? await medicalProfileAPI.getByUserId(userId)
        : await medicalProfileAPI.get();
      setMedicalProfile(response as IMedicalProfile);
      if (setProfile) setProfile(response as IMedicalProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, profile, setProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">{tMv("loading")}</p>
        </div>
      </div>
    );
  }

  if (!medicalProfile) {
    return (
      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">{tMv("noData")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Health Background */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            {tMp("steps.healthBackground")}
          </h2>
          {isEditable && (
            <button
              onClick={() => {
                setActiveTab("health-background");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              {t("edit")}
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>{tMp("step1.medicalConditions")}</Label>
            {medicalProfile.medicalConditions &&
            medicalProfile.medicalConditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {medicalProfile.medicalConditions.map((condition, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-light"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {tMv("empty.noneReported")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{tMp("step1.currentMedications")}</Label>
            {medicalProfile.currentMedications &&
            medicalProfile.currentMedications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {medicalProfile.currentMedications.map((medication, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-light"
                  >
                    {medication}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {tMv("empty.noneReported")}
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{tMp("step1.allergies")}</Label>
              {medicalProfile.allergies &&
              medicalProfile.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {medicalProfile.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 rounded-full text-sm font-light"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {tMv("empty.noneReported")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{tMp("step1.substanceUse")}</Label>
              <p className="text-foreground">
                {medicalProfile.substanceUse || tMv("empty.notReported")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mental Health History */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            {tMp("steps.mentalHealthHistory")}
          </h2>
          {isEditable && (
            <button
              onClick={() => {
                setActiveTab("mental-health-history");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              {t("edit")}
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{tMp("step2.previousTherapy")}</Label>
              <p className="text-foreground">
                {medicalProfile.previousTherapy ? t("yes") : t("no")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{tMp("step2.psychiatricHospitalization")}</Label>
              <p className="text-foreground">
                {medicalProfile.psychiatricHospitalization ? t("yes") : t("no")}
              </p>
            </div>
          </div>

          {medicalProfile.previousTherapy && (
            <div className="space-y-2">
              <Label>{tMp("step2.previousTherapyDetails")}</Label>
              <p className="text-foreground leading-relaxed">
                {medicalProfile.previousTherapyDetails ||
                  tMv("empty.noDetailsProvided")}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>{tMp("step2.diagnosedConditions")}</Label>
            {medicalProfile.diagnosedConditions &&
            medicalProfile.diagnosedConditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {medicalProfile.diagnosedConditions.map((condition, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-light"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {tMv("empty.noneReported")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{tMp("step2.currentTreatment")}</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.currentTreatment ||
                tMv("empty.noCurrentTreatment")}
            </p>
          </div>
        </div>
      </section>

      {/* Current Concerns */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            {tMp("steps.currentConcerns")}
          </h2>
          {isEditable && (
            <button
              onClick={() => {
                setActiveTab("current-concerns");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              {t("edit")}
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>{tMp("step3.primaryIssue")}</Label>
            <p className="text-foreground">
              {medicalProfile.primaryIssue || tMv("empty.notSpecified")}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{tMp("step3.secondaryIssues")}</Label>
            {medicalProfile.secondaryIssues &&
            medicalProfile.secondaryIssues.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {medicalProfile.secondaryIssues.map((issue, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 rounded-full text-sm font-light"
                  >
                    {issue}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {tMv("empty.noneReported")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{tMp("step3.issueDescription")}</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.issueDescription ||
                tMv("empty.noDescriptionProvided")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>{tMp("step3.severity")}</Label>
              <p className="text-foreground capitalize">
                {medicalProfile.severity || tMv("empty.notSpecified")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{tMp("step3.duration")}</Label>
              <p className="text-foreground">
                {medicalProfile.duration
                  ? t(`issueDetails.${medicalProfile.duration}`)
                  : tMv("empty.notSpecified")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{tMv("labels.triggeringEvent")}</Label>
              <p className="text-foreground">
                {medicalProfile.triggeringSituation ||
                  tMv("empty.notReported")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Symptoms & Impact */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            {tMv("sections.symptomsDailyLife")}
          </h2>
          {isEditable && (
            <button
              onClick={() => {
                setActiveTab("symptoms-impact");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              {t("edit")}
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>{tMp("step4.symptoms")}</Label>
            {medicalProfile.symptoms && medicalProfile.symptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {medicalProfile.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 rounded-full text-sm font-light"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {tMv("empty.noneReported")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{tMp("step4.dailyLifeImpact")}</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.dailyLifeImpact || tMv("empty.notSpecified")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{tMp("step4.sleepQuality")}</Label>
              <p className="text-foreground capitalize">
                {medicalProfile.sleepQuality
                  ? tMp(`step4.sleepQualityOptions.${medicalProfile.sleepQuality}`)
                  : tMv("empty.normalSleep")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{tMp("step4.appetiteChanges")}</Label>
              <p className="text-foreground">
                {medicalProfile.appetiteChanges ||
                  tMv("empty.noChangesReported")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Goals & Treatment Preferences */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            {tMv("sections.treatmentGoalsPrefs")}
          </h2>
          {isEditable && (
            <button
              onClick={() => {
                setActiveTab("goals-preferences");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              {t("edit")}
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>{tMp("step5.treatmentGoals")}</Label>
            {medicalProfile.treatmentGoals &&
            medicalProfile.treatmentGoals.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {medicalProfile.treatmentGoals.map((goal, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 rounded-full text-sm font-light"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {tMv("empty.notSpecified")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{tMp("step5.therapyApproach")}</Label>
            {medicalProfile.therapyApproach &&
            medicalProfile.therapyApproach.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {medicalProfile.therapyApproach.map((approach, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                  >
                    {approach}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {t("noPreference")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{tMp("step5.concernsAboutTherapy")}</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.concernsAboutTherapy ||
                tMv("empty.noConcernsReported")}
            </p>
          </div>
        </div>
      </section>

      {/* Appointment Preferences */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            {tMp("step6.title")}
          </h2>
          {isEditable && (
            <button
              onClick={() => {
                setActiveTab("appointment-preferences");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              {t("edit")}
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{tMv("labels.preferredTimeSlots")}</Label>
              <div className="flex flex-wrap gap-2">
                {medicalProfile.availability &&
                medicalProfile.availability.length > 0 ? (
                  medicalProfile.availability.map((time) => (
                    <span
                      key={time}
                      className="rounded-full px-4 py-2 text-sm font-medium bg-primary/10 text-primary"
                    >
                      {t(`preferences.${time}`)}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {t("noPreference")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{tMp("step6.sessionFrequency")}</Label>
              <p className="text-foreground capitalize">
                {medicalProfile.sessionFrequency
                  ? tMp(
                      `step6.sessionFrequencyOptions.${medicalProfile.sessionFrequency}`,
                    )
                  : tMv("empty.notSpecified")}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{tMv("labels.sessionModality")}</Label>
              <p className="text-foreground">
                {medicalProfile.modality
                  ? t(`preferences.${medicalProfile.modality}`)
                  : tMv("empty.notSpecified")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{tMp("step6.location")}</Label>
              <p className="text-foreground">
                {medicalProfile.location || tMv("empty.notSpecified")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{tMp("step6.notes")}</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.notes || tMv("empty.noAdditionalNotes")}
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Information */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-2xl font-light text-foreground">
            {tMv("labels.emergencyContactTitle")}
          </h2>
          {isEditable && (
            <button
              onClick={() => {
                setActiveTab("emergency-info");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              {t("edit")}
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground font-light mb-6">
          {tMv("labels.emergencyConfidential")}
        </p>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>{tMv("labels.contactName")}</Label>
              <p className="text-foreground">
                {medicalProfile.emergencyContactName ||
                  tMv("empty.notProvided")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{tMv("labels.phoneNumber")}</Label>
              <p className="text-foreground">
                {medicalProfile.emergencyContactPhone ||
                  tMv("empty.notProvided")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{tMv("labels.relationship")}</Label>
              <p className="text-foreground">
                {medicalProfile.emergencyContactRelation ||
                  tMv("empty.notSpecified")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{tMv("labels.crisisPlan")}</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.crisisPlan || tMv("empty.noCrisisPlan")}
            </p>
          </div>

          {medicalProfile.suicidalThoughts && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 border border-red-200 dark:border-red-900">
              <p className="text-sm text-red-800 dark:text-red-200 font-light">
                ⚠️ {tMv("labels.suicidalThoughtsWarning")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Matching Preferences */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            {tMv("labels.matchingPrefsTitle")}
          </h2>
          {isEditable && (
            <button
              onClick={() => {
                setActiveTab("matching-preferences");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              {t("edit")}
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{tMp("step8.preferredGender")}</Label>
              <p className="text-foreground capitalize">
                {medicalProfile.preferredGender === "noPreference"
                  ? t("noPreference")
                  : medicalProfile.preferredGender || tMv("empty.notSpecified")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{tMv("labels.preferredAgeRange")}</Label>
              <p className="text-foreground">
                {medicalProfile.preferredAge === "any"
                  ? tMv("labels.anyAge")
                  : medicalProfile.preferredAge === "younger"
                    ? tMv("labels.ageYounger")
                    : medicalProfile.preferredAge === "middle"
                      ? tMv("labels.ageMiddle")
                      : medicalProfile.preferredAge === "older"
                        ? tMv("labels.ageOlder")
                        : tMv("empty.notSpecified")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{tMp("step8.languagePreference")}</Label>
            <p className="text-foreground">
              {medicalProfile.languagePreference || tMv("empty.notSpecified")}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{tMp("step8.culturalConsiderations")}</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.culturalConsiderations ||
                tMv("empty.notSpecified")}
            </p>
          </div>
        </div>
      </section>

      <MedicalProfileModal
        isOpen={isEditable && isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={medicalProfile}
        setMedicalProfile={updateProfile}
      />
    </>
  );
}

interface MedicalProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile?: IMedicalProfile;
  setMedicalProfile: (profile: IMedicalProfile) => void;
}

function MedicalProfileModal({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  profile,
  setMedicalProfile,
}: MedicalProfileModalProps) {
  // State for each tab's form data, initialized with profile data
  const [healthBackgroundData, setHealthBackgroundData] = useState({
    concernedPerson: profile?.concernedPerson || "",
    medicalConditions: profile?.medicalConditions || [],
    currentMedications: profile?.currentMedications || [],
    allergies: profile?.allergies || [],
    substanceUse: profile?.substanceUse || "",
  });

  const [mentalHealthHistoryData, setMentalHealthHistoryData] = useState({
    previousTherapy: profile?.previousTherapy || false,
    previousTherapyDetails: profile?.previousTherapyDetails || "",
    psychiatricHospitalization: profile?.psychiatricHospitalization || false,
    diagnosedConditions: profile?.diagnosedConditions || [],
    currentTreatment: profile?.currentTreatment || "",
  });

  const [currentConcernsData, setCurrentConcernsData] = useState({
    primaryIssue: profile?.primaryIssue || "",
    secondaryIssues: profile?.secondaryIssues || [],
    issueDescription: profile?.issueDescription || "",
    severity: profile?.severity || "",
    duration: profile?.duration || "",
    triggeringSituation: profile?.triggeringSituation || "",
  });

  const [symptomsImpactData, setSymptomsImpactData] = useState({
    symptoms: profile?.symptoms || [],
    dailyLifeImpact: profile?.dailyLifeImpact || "",
    sleepQuality: profile?.sleepQuality || "",
    appetiteChanges: profile?.appetiteChanges || "",
  });

  const [goalsPreferencesData, setGoalsPreferencesData] = useState({
    treatmentGoals: profile?.treatmentGoals || [],
    therapyApproach: profile?.therapyApproach || [],
    concernsAboutTherapy: profile?.concernsAboutTherapy || "",
  });

  const [appointmentPreferencesData, setAppointmentPreferencesData] = useState({
    availability: profile?.availability || [],
    sessionFrequency: profile?.sessionFrequency || "",
    modality: profile?.modality || "",
    location: profile?.location || "",
    notes: profile?.notes || "",
  });

  const [emergencyInfoData, setEmergencyInfoData] = useState({
    emergencyContactName: profile?.emergencyContactName || "",
    emergencyContactPhone: profile?.emergencyContactPhone || "",
    emergencyContactRelation: profile?.emergencyContactRelation || "",
    crisisPlan: profile?.crisisPlan || "",
    suicidalThoughts: profile?.suicidalThoughts || false,
  });

  const [matchingPreferencesData, setMatchingPreferencesData] = useState({
    preferredGender: profile?.preferredGender || "",
    preferredAge: profile?.preferredAge || "",
    languagePreference: profile?.languagePreference || "",
    culturalConsiderations: profile?.culturalConsiderations || "",
  });

  const handleSave = async () => {
    // Collect all data
    const updatedProfile = {
      ...profile,
      ...healthBackgroundData,
      ...mentalHealthHistoryData,
      ...currentConcernsData,
      ...symptomsImpactData,
      ...goalsPreferencesData,
      ...appointmentPreferencesData,
      ...emergencyInfoData,
      ...matchingPreferencesData,
    };
    try {
      const newProfile = await medicalProfileAPI.update(updatedProfile);
      setMedicalProfile(newProfile as IMedicalProfile);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[95vw] h-[80vh] overflow-y-auto bg-background rounded-2xl shadow-2xl m-4">
        <div className="sticky top-0 z-10 bg-background border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-light text-foreground">
              Edit Medical Profile
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-1">
              Update your information across different sections
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              <TabsTrigger value="health-background">
                Health Background
              </TabsTrigger>
              <TabsTrigger value="mental-health-history">
                Mental Health History
              </TabsTrigger>
              <TabsTrigger value="current-concerns">
                Current Concerns
              </TabsTrigger>
              <TabsTrigger value="symptoms-impact">
                Symptoms & Impact
              </TabsTrigger>
              <TabsTrigger value="goals-preferences">
                Goals & Preferences
              </TabsTrigger>
              <TabsTrigger value="appointment-preferences">
                Appointment Preferences
              </TabsTrigger>
              <TabsTrigger value="emergency-info">Emergency Info</TabsTrigger>
              <TabsTrigger value="matching-preferences">
                Matching Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="health-background">
              {/* Health Background Form */}
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="concernedPerson"
                    className="font-light mb-3 text-base"
                  >
                    Concerned Person
                  </Label>
                  <Input
                    id="concernedPerson"
                    name="concernedPerson"
                    value={healthBackgroundData.concernedPerson}
                    onChange={(e) =>
                      setHealthBackgroundData((prev) => ({
                        ...prev,
                        concernedPerson: e.target.value,
                      }))
                    }
                    placeholder="Who is concerned about your health?"
                  />
                </div>

                <div>
                  <Label className="font-light mb-3 text-base">
                    Medical Conditions
                  </Label>
                  <p className="text-sm text-muted-foreground font-light mb-4">
                    Select any medical conditions you have been diagnosed with
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Diabetes",
                      "Hypertension",
                      "Asthma",
                      "Heart Disease",
                      "Cancer",
                      "Thyroid Disorders",
                      "Arthritis",
                      "Chronic Pain",
                      "Migraines",
                      "Epilepsy",
                      "Other",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          const current =
                            healthBackgroundData.medicalConditions;
                          if (current.includes(item)) {
                            setHealthBackgroundData((prev) => ({
                              ...prev,
                              medicalConditions: current.filter(
                                (v) => v !== item,
                              ),
                            }));
                          } else {
                            setHealthBackgroundData((prev) => ({
                              ...prev,
                              medicalConditions: [...current, item],
                            }));
                          }
                        }}
                        className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                          healthBackgroundData.medicalConditions.includes(item)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-foreground hover:bg-muted"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="currentMedications"
                    className="font-light mb-3 text-base"
                  >
                    Current Medications
                  </Label>
                  <Input
                    id="currentMedications"
                    name="currentMedications"
                    value={healthBackgroundData.currentMedications.join(", ")}
                    onChange={(e) =>
                      setHealthBackgroundData((prev) => ({
                        ...prev,
                        currentMedications: e.target.value
                          .split(", ")
                          .filter(Boolean),
                      }))
                    }
                    placeholder="List your current medications"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="allergies"
                    className="font-light mb-3 text-base"
                  >
                    Allergies
                  </Label>
                  <Input
                    id="allergies"
                    name="allergies"
                    value={healthBackgroundData.allergies.join(", ")}
                    onChange={(e) =>
                      setHealthBackgroundData((prev) => ({
                        ...prev,
                        allergies: e.target.value.split(", ").filter(Boolean),
                      }))
                    }
                    placeholder="List any allergies"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="substanceUse"
                    className="font-light mb-3 text-base"
                  >
                    Substance Use
                  </Label>
                  <Input
                    id="substanceUse"
                    name="substanceUse"
                    value={healthBackgroundData.substanceUse}
                    onChange={(e) =>
                      setHealthBackgroundData((prev) => ({
                        ...prev,
                        substanceUse: e.target.value,
                      }))
                    }
                    placeholder="Describe any substance use"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mental-health-history">
              {/* Mental Health History Form */}
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label className="font-light mb-3 text-base">
                      Previous Therapy Experience
                    </Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="previousTherapy"
                          checked={
                            mentalHealthHistoryData.previousTherapy === true
                          }
                          onChange={() =>
                            setMentalHealthHistoryData((prev) => ({
                              ...prev,
                              previousTherapy: true,
                            }))
                          }
                        />
                        <span className="text-sm font-light">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="previousTherapy"
                          checked={
                            mentalHealthHistoryData.previousTherapy === false
                          }
                          onChange={() =>
                            setMentalHealthHistoryData((prev) => ({
                              ...prev,
                              previousTherapy: false,
                            }))
                          }
                        />
                        <span className="text-sm font-light">No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="font-light mb-3 text-base">
                      Psychiatric Hospitalization
                    </Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="psychiatricHospitalization"
                          checked={
                            mentalHealthHistoryData.psychiatricHospitalization ===
                            true
                          }
                          onChange={() =>
                            setMentalHealthHistoryData((prev) => ({
                              ...prev,
                              psychiatricHospitalization: true,
                            }))
                          }
                        />
                        <span className="text-sm font-light">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="psychiatricHospitalization"
                          checked={
                            mentalHealthHistoryData.psychiatricHospitalization ===
                            false
                          }
                          onChange={() =>
                            setMentalHealthHistoryData((prev) => ({
                              ...prev,
                              psychiatricHospitalization: false,
                            }))
                          }
                        />
                        <span className="text-sm font-light">No</span>
                      </label>
                    </div>
                  </div>
                </div>

                {mentalHealthHistoryData.previousTherapy && (
                  <div>
                    <Label
                      htmlFor="previousTherapyDetails"
                      className="font-light mb-3 text-base"
                    >
                      Previous Therapy Details
                    </Label>
                    <Textarea
                      id="previousTherapyDetails"
                      name="previousTherapyDetails"
                      value={mentalHealthHistoryData.previousTherapyDetails}
                      onChange={(e) =>
                        setMentalHealthHistoryData((prev) => ({
                          ...prev,
                          previousTherapyDetails: e.target.value,
                        }))
                      }
                      rows={4}
                      placeholder="Describe your previous therapy experience"
                    />
                  </div>
                )}

                <div>
                  <Label
                    htmlFor="currentTreatment"
                    className="font-light mb-3 text-base"
                  >
                    Current Treatment
                  </Label>
                  <Input
                    id="currentTreatment"
                    name="currentTreatment"
                    value={mentalHealthHistoryData.currentTreatment}
                    onChange={(e) =>
                      setMentalHealthHistoryData((prev) => ({
                        ...prev,
                        currentTreatment: e.target.value,
                      }))
                    }
                    placeholder="Describe any current treatment"
                  />
                </div>

                <div>
                  <Label className="font-light mb-3 text-base">
                    Diagnosed Conditions
                  </Label>
                  <p className="text-sm text-muted-foreground font-light mb-4">
                    Select any diagnosed mental health conditions
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                    {(() => {
                      // Determine if child based on concernedPerson field
                      const isChild = healthBackgroundData.concernedPerson?.toLowerCase().includes("enfant") || 
                                     healthBackgroundData.concernedPerson?.toLowerCase().includes("child");

                      // Diagnostics pour les enfants (liste affichée au client pour son profil médical)
                      const childDiagnosedConditions = CHILD_DIAGNOSTICS;

                      // Diagnostics pour les adultes (liste affichée au client pour son profil médical)
                      const adultDiagnosedConditions = ADULT_DIAGNOSTICS;

                      const conditionsList = isChild ? childDiagnosedConditions : adultDiagnosedConditions;

                      return conditionsList.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            const current =
                              mentalHealthHistoryData.diagnosedConditions;
                            if (current.includes(item)) {
                              setMentalHealthHistoryData((prev) => ({
                                ...prev,
                                diagnosedConditions: current.filter(
                                  (v) => v !== item,
                                ),
                              }));
                            } else {
                              setMentalHealthHistoryData((prev) => ({
                                ...prev,
                                diagnosedConditions: [...current, item],
                              }));
                            }
                          }}
                          className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                            mentalHealthHistoryData.diagnosedConditions.includes(
                              item,
                            )
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 text-foreground hover:bg-muted"
                          }`}
                        >
                          {item}
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="current-concerns">
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="primaryIssue"
                    className="font-light mb-3 text-base"
                  >
                    Primary Issue <span className="text-primary ml-1">*</span>
                  </Label>
                  <Input
                    id="primaryIssue"
                    name="primaryIssue"
                    value={currentConcernsData.primaryIssue}
                    onChange={(e) =>
                      setCurrentConcernsData((prev) => ({
                        ...prev,
                        primaryIssue: e.target.value,
                      }))
                    }
                    placeholder="What is your main concern?"
                  />
                </div>

                <div>
                  <Label className="font-light mb-3 text-base">
                    Secondary Issues
                  </Label>
                  <p className="text-sm text-muted-foreground font-light mb-4">
                    Select any additional issues yo&apos;re experiencing
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Anxiety",
                      "Depression",
                      "Stress",
                      "Relationship Problems",
                      "Trauma",
                      "Self-Esteem Issues",
                      "Addiction",
                      "Grief",
                      "Anger Management",
                      "Family Issues",
                      "Work/School Problems",
                      "Other",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          const current = currentConcernsData.secondaryIssues;
                          if (current.includes(item)) {
                            setCurrentConcernsData((prev) => ({
                              ...prev,
                              secondaryIssues: current.filter(
                                (v) => v !== item,
                              ),
                            }));
                          } else {
                            setCurrentConcernsData((prev) => ({
                              ...prev,
                              secondaryIssues: [...current, item],
                            }));
                          }
                        }}
                        className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                          currentConcernsData.secondaryIssues.includes(item)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-foreground hover:bg-muted"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="issueDescription"
                    className="font-light mb-3 text-base"
                  >
                    Detailed Description
                  </Label>
                  <Textarea
                    id="issueDescription"
                    name="issueDescription"
                    value={currentConcernsData.issueDescription}
                    onChange={(e) =>
                      setCurrentConcernsData((prev) => ({
                        ...prev,
                        issueDescription: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Describe your concerns in detail"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <Label className="font-light mb-3 text-base">
                      Severity
                    </Label>
                    <Select
                      value={currentConcernsData.severity}
                      onValueChange={(value) =>
                        setCurrentConcernsData((prev) => ({
                          ...prev,
                          severity: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="font-light mb-3 text-base">
                      Duration
                    </Label>
                    <Select
                      value={currentConcernsData.duration}
                      onValueChange={(value) =>
                        setCurrentConcernsData((prev) => ({
                          ...prev,
                          duration: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lessThanMonth">
                          Less than a month
                        </SelectItem>
                        <SelectItem value="oneToThree">1-3 months</SelectItem>
                        <SelectItem value="threeToSix">3-6 months</SelectItem>
                        <SelectItem value="moreThanSix">
                          More than 6 months
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="triggeringSituation"
                      className="font-light mb-3 text-base"
                    >
                      Triggering Situation
                    </Label>
                    <Input
                      id="triggeringSituation"
                      name="triggeringSituation"
                      value={currentConcernsData.triggeringSituation}
                      onChange={(e) =>
                        setCurrentConcernsData((prev) => ({
                          ...prev,
                          triggeringSituation: e.target.value,
                        }))
                      }
                      placeholder="What triggered this?"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="symptoms-impact">
              <div className="space-y-6">
                <div>
                  <Label className="font-light mb-3 text-base">
                    Current Symptoms
                  </Label>
                  <p className="text-sm text-muted-foreground font-light mb-4">
                    Select symptoms you&apos;re experiencing
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Persistent Sadness",
                      "Anxiety Attacks",
                      "Sleep Problems",
                      "Loss of Interest",
                      "Irritability",
                      "Fatigue",
                      "Concentration Issues",
                      "Appetite Changes",
                      "Social Withdrawal",
                      "Panic Attacks",
                      "Mood Swings",
                      "Suicidal Thoughts",
                      "Hallucinations",
                      "Delusions",
                      "Other",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          const current = symptomsImpactData.symptoms;
                          if (current.includes(item)) {
                            setSymptomsImpactData((prev) => ({
                              ...prev,
                              symptoms: current.filter((v) => v !== item),
                            }));
                          } else {
                            setSymptomsImpactData((prev) => ({
                              ...prev,
                              symptoms: [...current, item],
                            }));
                          }
                        }}
                        className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                          symptomsImpactData.symptoms.includes(item)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-foreground hover:bg-muted"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="dailyLifeImpact"
                    className="font-light mb-3 text-base"
                  >
                    Impact on Daily Life
                  </Label>
                  <Textarea
                    id="dailyLifeImpact"
                    name="dailyLifeImpact"
                    value={symptomsImpactData.dailyLifeImpact}
                    onChange={(e) =>
                      setSymptomsImpactData((prev) => ({
                        ...prev,
                        dailyLifeImpact: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Describe how these symptoms affect your daily life"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label className="font-light mb-3 text-base">
                      Sleep Quality
                    </Label>
                    <Select
                      value={symptomsImpactData.sleepQuality}
                      onValueChange={(value) =>
                        setSymptomsImpactData((prev) => ({
                          ...prev,
                          sleepQuality: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sleep quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="insomnia">Insomnia</SelectItem>
                        <SelectItem value="excessive">Excessive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="appetiteChanges"
                      className="font-light mb-3 text-base"
                    >
                      Appetite Changes
                    </Label>
                    <Input
                      id="appetiteChanges"
                      name="appetiteChanges"
                      value={symptomsImpactData.appetiteChanges}
                      onChange={(e) =>
                        setSymptomsImpactData((prev) => ({
                          ...prev,
                          appetiteChanges: e.target.value,
                        }))
                      }
                      placeholder="Describe any changes in appetite"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="goals-preferences">
              <div className="space-y-6">
                <div>
                  <Label className="font-light mb-3 text-base">
                    Treatment Goals <span className="text-primary ml-1">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground font-light mb-4">
                    Select your main goals for therapy
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Reduce Anxiety",
                      "Improve Mood",
                      "Better Sleep",
                      "Increase Self-Esteem",
                      "Manage Stress",
                      "Improve Relationships",
                      "Overcome Trauma",
                      "Develop Coping Skills",
                      "Address Addiction",
                      "Weight Management",
                      "Other",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          const current = goalsPreferencesData.treatmentGoals;
                          if (current.includes(item)) {
                            setGoalsPreferencesData((prev) => ({
                              ...prev,
                              treatmentGoals: current.filter((v) => v !== item),
                            }));
                          } else {
                            setGoalsPreferencesData((prev) => ({
                              ...prev,
                              treatmentGoals: [...current, item],
                            }));
                          }
                        }}
                        className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                          goalsPreferencesData.treatmentGoals.includes(item)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-foreground hover:bg-muted"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-light mb-3 text-base">
                    Preferred Therapy Approach
                  </Label>
                  <p className="text-sm text-muted-foreground font-light mb-4">
                    Select preferred therapeutic approaches
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Cognitive Behavioral Therapy (CBT)",
                      "Psychodynamic Therapy",
                      "Humanistic Therapy",
                      "Dialectical Behavior Therapy (DBT)",
                      "EMDR",
                      "Solution-Focused Therapy",
                      "Mindfulness-Based Therapy",
                      "Family Systems Therapy",
                      "Acceptance and Commitment Therapy (ACT)",
                      "No Preference",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          const current = goalsPreferencesData.therapyApproach;
                          if (current.includes(item)) {
                            setGoalsPreferencesData((prev) => ({
                              ...prev,
                              therapyApproach: current.filter(
                                (v) => v !== item,
                              ),
                            }));
                          } else {
                            setGoalsPreferencesData((prev) => ({
                              ...prev,
                              therapyApproach: [...current, item],
                            }));
                          }
                        }}
                        className={`rounded-lg px-4 py-3 text-sm font-light text-left transition-all ${
                          goalsPreferencesData.therapyApproach.includes(item)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-foreground hover:bg-muted"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="concernsAboutTherapy"
                    className="font-light mb-3 text-base"
                  >
                    Concerns About Therapy
                  </Label>
                  <Textarea
                    id="concernsAboutTherapy"
                    name="concernsAboutTherapy"
                    value={goalsPreferencesData.concernsAboutTherapy}
                    onChange={(e) =>
                      setGoalsPreferencesData((prev) => ({
                        ...prev,
                        concernsAboutTherapy: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Any concerns or questions about therapy?"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appointment-preferences">
              <div className="space-y-6">
                <div>
                  <Label className="font-light mb-3 text-base">
                    Preferred Time Slots{" "}
                    <span className="text-primary ml-1">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground font-light mb-4">
                    Select your preferred times for sessions
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["morning", "afternoon", "evening", "weekends"].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            const current =
                              appointmentPreferencesData.availability;
                            if (current.includes(item)) {
                              setAppointmentPreferencesData((prev) => ({
                                ...prev,
                                availability: current.filter((v) => v !== item),
                              }));
                            } else {
                              setAppointmentPreferencesData((prev) => ({
                                ...prev,
                                availability: [...current, item],
                              }));
                            }
                          }}
                          className={`rounded-lg px-4 py-3 text-sm font-light text-center transition-all ${
                            appointmentPreferencesData.availability.includes(
                              item,
                            )
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 text-foreground hover:bg-muted"
                          }`}
                        >
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <Label className="font-light mb-3 text-base">
                      Session Modality
                    </Label>
                    <Select
                      value={appointmentPreferencesData.modality}
                      onValueChange={(value) =>
                        setAppointmentPreferencesData((prev) => ({
                          ...prev,
                          modality: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select modality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="inPerson">In-Person</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="font-light mb-3 text-base">
                      Session Frequency
                    </Label>
                    <Select
                      value={appointmentPreferencesData.sessionFrequency}
                      onValueChange={(value) =>
                        setAppointmentPreferencesData((prev) => ({
                          ...prev,
                          sessionFrequency: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="location"
                      className="font-light mb-3 text-base"
                    >
                      Preferred Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={appointmentPreferencesData.location}
                      onChange={(e) =>
                        setAppointmentPreferencesData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="Preferred location for in-person sessions"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="font-light mb-3 text-base">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={appointmentPreferencesData.notes}
                    onChange={(e) =>
                      setAppointmentPreferencesData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Any additional preferences or notes"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emergency-info">
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <Label
                      htmlFor="emergencyContactName"
                      className="font-light mb-3 text-base"
                    >
                      Emergency Contact Name{" "}
                      <span className="text-primary ml-1">*</span>
                    </Label>
                    <Input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      value={emergencyInfoData.emergencyContactName}
                      onChange={(e) =>
                        setEmergencyInfoData((prev) => ({
                          ...prev,
                          emergencyContactName: e.target.value,
                        }))
                      }
                      placeholder="Full name of emergency contact"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="emergencyContactPhone"
                      className="font-light mb-3 text-base"
                    >
                      Emergency Contact Phone{" "}
                      <span className="text-primary ml-1">*</span>
                    </Label>
                    <Input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      value={emergencyInfoData.emergencyContactPhone}
                      onChange={(e) =>
                        setEmergencyInfoData((prev) => ({
                          ...prev,
                          emergencyContactPhone: e.target.value,
                        }))
                      }
                      placeholder="Phone number"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="emergencyContactRelation"
                      className="font-light mb-3 text-base"
                    >
                      Relationship
                    </Label>
                    <Input
                      id="emergencyContactRelation"
                      name="emergencyContactRelation"
                      value={emergencyInfoData.emergencyContactRelation}
                      onChange={(e) =>
                        setEmergencyInfoData((prev) => ({
                          ...prev,
                          emergencyContactRelation: e.target.value,
                        }))
                      }
                      placeholder="e.g., Parent, Spouse, Friend"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="crisisPlan"
                    className="font-light mb-3 text-base"
                  >
                    Crisis Plan
                  </Label>
                  <Textarea
                    id="crisisPlan"
                    name="crisisPlan"
                    value={emergencyInfoData.crisisPlan}
                    onChange={(e) =>
                      setEmergencyInfoData((prev) => ({
                        ...prev,
                        crisisPlan: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Describe your crisis plan or coping strategies"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="suicidalThoughts"
                      checked={emergencyInfoData.suicidalThoughts}
                      onChange={(e) =>
                        setEmergencyInfoData((prev) => ({
                          ...prev,
                          suicidalThoughts: e.target.checked,
                        }))
                      }
                    />
                    <span className="text-sm font-light">
                      I have experienced suicidal thoughts
                    </span>
                  </label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="matching-preferences">
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label className="font-light mb-3 text-base">
                      Preferred Professional Gender
                    </Label>
                    <Select
                      value={matchingPreferencesData.preferredGender}
                      onValueChange={(value) =>
                        setMatchingPreferencesData((prev) => ({
                          ...prev,
                          preferredGender: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="noPreference">
                          No preference
                        </SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="font-light mb-3 text-base">
                      Preferred Age Range
                    </Label>
                    <Select
                      value={matchingPreferencesData.preferredAge}
                      onValueChange={(value) =>
                        setMatchingPreferencesData((prev) => ({
                          ...prev,
                          preferredAge: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Age</SelectItem>
                        <SelectItem value="younger">Younger (20-35)</SelectItem>
                        <SelectItem value="middle">
                          Middle-aged (36-55)
                        </SelectItem>
                        <SelectItem value="older">Older (56+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="languagePreference"
                    className="font-light mb-3 text-base"
                  >
                    Language Preference
                  </Label>
                  <Input
                    id="languagePreference"
                    name="languagePreference"
                    value={matchingPreferencesData.languagePreference}
                    onChange={(e) =>
                      setMatchingPreferencesData((prev) => ({
                        ...prev,
                        languagePreference: e.target.value,
                      }))
                    }
                    placeholder="Preferred language for sessions"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="culturalConsiderations"
                    className="font-light mb-3 text-base"
                  >
                    Cultural Considerations
                  </Label>
                  <Textarea
                    id="culturalConsiderations"
                    name="culturalConsiderations"
                    value={matchingPreferencesData.culturalConsiderations}
                    onChange={(e) =>
                      setMatchingPreferencesData((prev) => ({
                        ...prev,
                        culturalConsiderations: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Any cultural or religious considerations"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="sticky bottom-0 bg-background border-t border-border/40 px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
