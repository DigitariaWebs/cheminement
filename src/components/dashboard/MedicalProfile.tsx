"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Edit } from "lucide-react";
import { Label } from "@/components/ui/label";
import { IMedicalProfile } from "@/models/MedicalProfile";
import { medicalProfileAPI } from "@/lib/api-client";
import HealthBackgroundModal from "./HealthBackgroundModal";
import MentalHealthHistoryModal from "./MentalHealthHistoryModal";
import CurrentConcernsModal from "./CurrentConcernsModal";
import SymptomsImpactModal from "./SymptomsImpactModal";
import GoalsPreferencesModal from "./GoalsPreferencesModal";
import AppointmentPreferencesModal from "./AppointmentPreferencesModal";
import EmergencyInfoModal from "./EmergencyInfoModal";
import MatchingPreferencesModal from "./MatchingPreferencesModal";

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
  const [medicalProfile, setMedicalProfile] = useState<IMedicalProfile | null>(
    profile || null,
  );
  const [isLoading, setIsLoading] = useState(!profile);
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
        ? await medicalProfileAPI.get() // Assuming get by userId if needed, but API might not support
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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!medicalProfile) {
    return (
      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">No profile data available</p>
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
            Health Background
          </h2>
          {isEditable && (
            <button
              onClick={() => setIsHealthBackgroundModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Medical Conditions</Label>
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
              <p className="text-muted-foreground text-sm">None reported</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Current Medications</Label>
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
              <p className="text-muted-foreground text-sm">None reported</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Allergies</Label>
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
                <p className="text-muted-foreground text-sm">None reported</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Substance Use</Label>
              <p className="text-foreground">
                {medicalProfile.substanceUse || "Not reported"}
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
          {isEditable && (
            <button
              onClick={() => setIsMentalHealthHistoryModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Previous Therapy Experience</Label>
              <p className="text-foreground">
                {medicalProfile.previousTherapy ? "Yes" : "No"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Psychiatric Hospitalization</Label>
              <p className="text-foreground">
                {medicalProfile.psychiatricHospitalization ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {medicalProfile.previousTherapy && (
            <div className="space-y-2">
              <Label>Previous Therapy Details</Label>
              <p className="text-foreground leading-relaxed">
                {medicalProfile.previousTherapyDetails || "No details provided"}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Diagnosed Conditions</Label>
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
              <p className="text-muted-foreground text-sm">None reported</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Current Treatment</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.currentTreatment || "No current treatment"}
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
          {isEditable && (
            <button
              onClick={() => setIsCurrentConcernsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Primary Issue</Label>
            <p className="text-foreground">
              {medicalProfile.primaryIssue || "Not specified"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Secondary Issues</Label>
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
              <p className="text-muted-foreground text-sm">None reported</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Detailed Description</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.issueDescription || "No description provided"}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Severity Level</Label>
              <p className="text-foreground capitalize">
                {medicalProfile.severity || "Not specified"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <p className="text-foreground">
                {medicalProfile.duration
                  ? t(`issueDetails.${medicalProfile.duration}`)
                  : "Not specified"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Triggering Event</Label>
              <p className="text-foreground">
                {medicalProfile.triggeringSituation || "Not reported"}
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
          {isEditable && (
            <button
              onClick={() => setIsSymptomsImpactModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Current Symptoms</Label>
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
              <p className="text-muted-foreground text-sm">None reported</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Impact on Daily Life</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.dailyLifeImpact || "Not specified"}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Sleep Quality</Label>
              <p className="text-foreground capitalize">
                {medicalProfile.sleepQuality || "Normal"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Appetite Changes</Label>
              <p className="text-foreground">
                {medicalProfile.appetiteChanges || "No changes reported"}
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
          {isEditable && (
            <button
              onClick={() => setIsGoalsPreferencesModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Treatment Goals</Label>
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
              <p className="text-muted-foreground text-sm">Not specified</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Preferred Therapy Approach</Label>
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
              <p className="text-muted-foreground text-sm">No preference</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Concerns About Therapy</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.concernsAboutTherapy || "No concerns reported"}
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
          {isEditable && (
            <button
              onClick={() => setIsAppointmentPreferencesModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Preferred Time Slots</Label>
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
                  <p className="text-muted-foreground text-sm">No preference</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Session Frequency</Label>
              <p className="text-foreground capitalize">
                {medicalProfile.sessionFrequency || "Weekly"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Session Modality</Label>
              <p className="text-foreground">
                {medicalProfile.modality
                  ? t(`preferences.${medicalProfile.modality}`)
                  : "Not specified"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Preferred Location</Label>
              <p className="text-foreground">
                {medicalProfile.location || "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.notes || "No additional notes"}
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
          {isEditable && (
            <button
              onClick={() => setIsEmergencyInfoModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
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
                {medicalProfile.emergencyContactName || "Not provided"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <p className="text-foreground">
                {medicalProfile.emergencyContactPhone || "Not provided"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Relationship</Label>
              <p className="text-foreground">
                {medicalProfile.emergencyContactRelation || "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Crisis Plan</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.crisisPlan || "No crisis plan specified"}
            </p>
          </div>

          {medicalProfile.suicidalThoughts && (
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
          {isEditable && (
            <button
              onClick={() => setIsMatchingPreferencesModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Preferred Professional Gender</Label>
              <p className="text-foreground capitalize">
                {medicalProfile.preferredGender === "noPreference"
                  ? "No preference"
                  : medicalProfile.preferredGender || "Not specified"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Preferred Age Range</Label>
              <p className="text-foreground">
                {medicalProfile.preferredAge === "any"
                  ? "Any Age"
                  : medicalProfile.preferredAge === "younger"
                    ? "Younger (20-35)"
                    : medicalProfile.preferredAge === "middle"
                      ? "Middle-aged (36-55)"
                      : medicalProfile.preferredAge === "older"
                        ? "Older (56+)"
                        : "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Language Preference</Label>
            <p className="text-foreground">
              {medicalProfile.languagePreference || "Not specified"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Cultural Considerations</Label>
            <p className="text-foreground leading-relaxed">
              {medicalProfile.culturalConsiderations || "None specified"}
            </p>
          </div>
        </div>
      </section>

      <HealthBackgroundModal
        isOpen={isEditable && isHealthBackgroundModalOpen}
        onClose={() => setIsHealthBackgroundModalOpen(false)}
        setMedicalProfile={updateProfile}
        profile={medicalProfile}
      />

      <MentalHealthHistoryModal
        isOpen={isEditable && isMentalHealthHistoryModalOpen}
        onClose={() => setIsMentalHealthHistoryModalOpen(false)}
        setMedicalProfile={updateProfile}
        profile={medicalProfile}
      />

      <CurrentConcernsModal
        isOpen={isEditable && isCurrentConcernsModalOpen}
        onClose={() => setIsCurrentConcernsModalOpen(false)}
        setMedicalProfile={updateProfile}
        profile={medicalProfile}
      />

      <SymptomsImpactModal
        isOpen={isEditable && isSymptomsImpactModalOpen}
        onClose={() => setIsSymptomsImpactModalOpen(false)}
        setMedicalProfile={updateProfile}
        profile={medicalProfile}
      />

      <GoalsPreferencesModal
        isOpen={isEditable && isGoalsPreferencesModalOpen}
        onClose={() => setIsGoalsPreferencesModalOpen(false)}
        setMedicalProfile={updateProfile}
        profile={medicalProfile}
      />

      <AppointmentPreferencesModal
        isOpen={isEditable && isAppointmentPreferencesModalOpen}
        onClose={() => setIsAppointmentPreferencesModalOpen(false)}
        setMedicalProfile={updateProfile}
        profile={medicalProfile}
      />

      <EmergencyInfoModal
        isOpen={isEditable && isEmergencyInfoModalOpen}
        onClose={() => setIsEmergencyInfoModalOpen(false)}
        setMedicalProfile={updateProfile}
        profile={medicalProfile}
      />

      <MatchingPreferencesModal
        isOpen={isEditable && isMatchingPreferencesModalOpen}
        onClose={() => setIsMatchingPreferencesModalOpen(false)}
        setMedicalProfile={updateProfile}
        profile={medicalProfile}
      />
    </>
  );
}
