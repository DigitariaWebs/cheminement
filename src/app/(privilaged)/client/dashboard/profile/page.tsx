"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { medicalProfileAPI } from "@/lib/api-client";
import { CheckCircle2, Edit } from "lucide-react";
import BasicInformation from "@/components/dashboard/BasicInformation";
import HealthBackgroundModal from "@/components/dashboard/HealthBackgroundModal";
import MentalHealthHistoryModal from "@/components/dashboard/MentalHealthHistoryModal";
import CurrentConcernsModal from "@/components/dashboard/CurrentConcernsModal";
import SymptomsImpactModal from "@/components/dashboard/SymptomsImpactModal";
import GoalsPreferencesModal from "@/components/dashboard/GoalsPreferencesModal";
import AppointmentPreferencesModal from "@/components/dashboard/AppointmentPreferencesModal";
import EmergencyInfoModal from "@/components/dashboard/EmergencyInfoModal";
import MatchingPreferencesModal from "@/components/dashboard/MatchingPreferencesModal";
import { Label } from "@/components/ui/label";
import { IMedicalProfile } from "@/models/MedicalProfile";

export default function ClientProfilePage() {
  const [profile, setProfile] = useState<IMedicalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHealthBackgroundModalOpen, setIsHealthBackgroundModalOpen] =
    useState(false);
  const [isMentalHealthHistoryModalOpen, setIsMentalHealthHistoryModalOpen] =
    useState(false);
  const [isCurrentConcernsModalOpen, setIsCurrentConcernsModalOpen] =
    useState(false);
  const [isSymptomsImpactModalOpen, setIsSymptomsImpactModalOpen] =
    useState(false);
  const [isGoalsPreferencesModalOpen, setIsGoalsPreferencesModalOpen] =
    useState(false);
  const [
    isAppointmentPreferencesModalOpen,
    setIsAppointmentPreferencesModalOpen,
  ] = useState(false);
  const [isEmergencyInfoModalOpen, setIsEmergencyInfoModalOpen] =
    useState(false);
  const [isMatchingPreferencesModalOpen, setIsMatchingPreferencesModalOpen] =
    useState(false);
  const t = useTranslations("Client.profile");

  const fetchProfile = async () => {
    try {
      const profileData = await medicalProfileAPI.get();
      if (profileData) {
        setProfile(profileData as IMedicalProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground font-light">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          {t("title")}
        </h1>
        <p className="text-muted-foreground font-light mt-2">{t("subtitle")}</p>
      </div>

      {/* Basic Information */}
      <BasicInformation isEditable={true} />

      {/* Platform Benefits */}
      <div className="rounded-xl bg-muted/30 p-6">
        <h3 className="font-serif font-light text-lg text-foreground mb-4">
          {t("benefits.title")}
        </h3>
        <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground font-light">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefits.benefit1")}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefits.benefit2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefits.benefit3")}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{t("benefits.benefit4")}</span>
          </li>
        </ul>
      </div>

      {/* Health Background */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            Health Background
          </h2>
          <button
            onClick={() => setIsHealthBackgroundModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Medical Conditions</Label>
            {profile.medicalConditions &&
            profile.medicalConditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.medicalConditions.map((condition, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-light"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">None reported</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Current Medications</Label>
            {profile.currentMedications &&
            profile.currentMedications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.currentMedications.map((medication, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-light"
                  >
                    {medication}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">None reported</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Allergies</Label>
              {profile.allergies && profile.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 rounded-full text-sm font-light"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">None reported</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Substance Use</Label>
              <p className="text-foreground">
                {profile.substanceUse || "Not reported"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mental Health History */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            Mental Health History
          </h2>
          <button
            onClick={() => setIsMentalHealthHistoryModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Previous Therapy Experience</Label>
              <p className="text-foreground">
                {profile.previousTherapy ? "Yes" : "No"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Psychiatric Hospitalization</Label>
              <p className="text-foreground">
                {profile.psychiatricHospitalization ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {profile.previousTherapy && (
            <div className="space-y-2">
              <Label>Previous Therapy Details</Label>
              <p className="text-foreground leading-relaxed">
                {profile.previousTherapyDetails || "No details provided"}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Diagnosed Conditions</Label>
            {profile.diagnosedConditions &&
            profile.diagnosedConditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.diagnosedConditions.map((condition, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-light"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">None reported</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Current Treatment</Label>
            <p className="text-foreground leading-relaxed">
              {profile.currentTreatment || "No current treatment"}
            </p>
          </div>
        </div>
      </section>

      {/* Current Concerns */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            Current Concerns
          </h2>
          <button
            onClick={() => setIsCurrentConcernsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Primary Issue</Label>
            <p className="text-foreground">
              {profile.primaryIssue || "Not specified"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Secondary Issues</Label>
            {profile.secondaryIssues && profile.secondaryIssues.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.secondaryIssues.map((issue, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 rounded-full text-sm font-light"
                  >
                    {issue}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">None reported</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Detailed Description</Label>
            <p className="text-foreground leading-relaxed">
              {profile.issueDescription || "No description provided"}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Severity Level</Label>
              <p className="text-foreground capitalize">
                {profile.severity || "Not specified"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <p className="text-foreground">
                {profile.duration
                  ? t(`issueDetails.${profile.duration}`)
                  : "Not specified"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Triggering Event</Label>
              <p className="text-foreground">
                {profile.triggeringSituation || "Not reported"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Symptoms & Impact */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            Symptoms & Daily Life Impact
          </h2>
          <button
            onClick={() => setIsSymptomsImpactModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Current Symptoms</Label>
            {profile.symptoms && profile.symptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 rounded-full text-sm font-light"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">None reported</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Impact on Daily Life</Label>
            <p className="text-foreground leading-relaxed">
              {profile.dailyLifeImpact || "Not specified"}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Sleep Quality</Label>
              <p className="text-foreground capitalize">
                {profile.sleepQuality || "Normal"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Appetite Changes</Label>
              <p className="text-foreground">
                {profile.appetiteChanges || "No changes reported"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Goals & Treatment Preferences */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            Treatment Goals & Preferences
          </h2>
          <button
            onClick={() => setIsGoalsPreferencesModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Treatment Goals</Label>
            {profile.treatmentGoals && profile.treatmentGoals.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.treatmentGoals.map((goal, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 rounded-full text-sm font-light"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Not specified</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Preferred Therapy Approach</Label>
            {profile.therapyApproach && profile.therapyApproach.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.therapyApproach.map((approach, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                  >
                    {approach}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No preference</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Concerns About Therapy</Label>
            <p className="text-foreground leading-relaxed">
              {profile.concernsAboutTherapy || "No concerns reported"}
            </p>
          </div>
        </div>
      </section>

      {/* Appointment Preferences */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            Appointment Preferences
          </h2>
          <button
            onClick={() => setIsAppointmentPreferencesModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Preferred Time Slots</Label>
              <div className="flex flex-wrap gap-2">
                {profile.availability && profile.availability.length > 0 ? (
                  profile.availability.map((time) => (
                    <span
                      key={time}
                      className="rounded-full px-4 py-2 text-sm font-medium bg-primary/10 text-primary"
                    >
                      {t(`preferences.${time}`)}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No preference</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Session Frequency</Label>
              <p className="text-foreground capitalize">
                {profile.sessionFrequency || "Weekly"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Session Modality</Label>
              <p className="text-foreground">
                {profile.modality
                  ? t(`preferences.${profile.modality}`)
                  : "Not specified"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Preferred Location</Label>
              <p className="text-foreground">
                {profile.location || "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <p className="text-foreground leading-relaxed">
              {profile.notes || "No additional notes"}
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Information */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-2xl font-light text-foreground">
            Emergency Contact Information
          </h2>
          <button
            onClick={() => setIsEmergencyInfoModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
        <p className="text-sm text-muted-foreground font-light mb-6">
          This information is kept confidential and used only in case of
          emergency
        </p>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <p className="text-foreground">
                {profile.emergencyContactName || "Not provided"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <p className="text-foreground">
                {profile.emergencyContactPhone || "Not provided"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Relationship</Label>
              <p className="text-foreground">
                {profile.emergencyContactRelation || "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Crisis Plan</Label>
            <p className="text-foreground leading-relaxed">
              {profile.crisisPlan || "No crisis plan specified"}
            </p>
          </div>

          {profile.suicidalThoughts && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 border border-red-200 dark:border-red-900">
              <p className="text-sm text-red-800 dark:text-red-200 font-light">
                ⚠️ Client has reported experiencing suicidal thoughts. Immediate
                attention may be required.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Matching Preferences */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-foreground">
            Professional Matching Preferences
          </h2>
          <button
            onClick={() => setIsMatchingPreferencesModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Preferred Professional Gender</Label>
              <p className="text-foreground capitalize">
                {profile.preferredGender === "noPreference"
                  ? "No preference"
                  : profile.preferredGender || "Not specified"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Preferred Age Range</Label>
              <p className="text-foreground">
                {profile.preferredAge === "any"
                  ? "Any Age"
                  : profile.preferredAge === "younger"
                    ? "Younger (20-35)"
                    : profile.preferredAge === "middle"
                      ? "Middle-aged (36-55)"
                      : profile.preferredAge === "older"
                        ? "Older (56+)"
                        : "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Language Preference</Label>
            <p className="text-foreground">
              {profile.languagePreference || "Not specified"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Cultural Considerations</Label>
            <p className="text-foreground leading-relaxed">
              {profile.culturalConsiderations || "None specified"}
            </p>
          </div>
        </div>
      </section>

      <HealthBackgroundModal
        isOpen={isHealthBackgroundModalOpen}
        onClose={() => setIsHealthBackgroundModalOpen(false)}
        setMedicalProfile={setProfile}
        profile={profile}
      />

      <MentalHealthHistoryModal
        isOpen={isMentalHealthHistoryModalOpen}
        onClose={() => setIsMentalHealthHistoryModalOpen(false)}
        setMedicalProfile={setProfile}
        profile={profile}
      />

      <CurrentConcernsModal
        isOpen={isCurrentConcernsModalOpen}
        onClose={() => setIsCurrentConcernsModalOpen(false)}
        setMedicalProfile={setProfile}
        profile={profile}
      />

      <SymptomsImpactModal
        isOpen={isSymptomsImpactModalOpen}
        onClose={() => setIsSymptomsImpactModalOpen(false)}
        setMedicalProfile={setProfile}
        profile={profile}
      />

      <GoalsPreferencesModal
        isOpen={isGoalsPreferencesModalOpen}
        onClose={() => setIsGoalsPreferencesModalOpen(false)}
        setMedicalProfile={setProfile}
        profile={profile}
      />

      <AppointmentPreferencesModal
        isOpen={isAppointmentPreferencesModalOpen}
        onClose={() => setIsAppointmentPreferencesModalOpen(false)}
        setMedicalProfile={setProfile}
        profile={profile}
      />

      <EmergencyInfoModal
        isOpen={isEmergencyInfoModalOpen}
        onClose={() => setIsEmergencyInfoModalOpen(false)}
        setMedicalProfile={setProfile}
        profile={profile}
      />

      <MatchingPreferencesModal
        isOpen={isMatchingPreferencesModalOpen}
        onClose={() => setIsMatchingPreferencesModalOpen(false)}
        setMedicalProfile={setProfile}
        profile={profile}
      />
    </div>
  );
}
