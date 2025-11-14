"use client";

import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data - replace with real data from API
const mockUserData = {
  firstName: "Jean",
  lastName: "Pierre",
  email: "jean.pierre@email.com",
  phone: "+1 (514) 555-0123",
  language: "Français",
  gender: "Homme",
  age: 37,
  concernedPerson: "myself",
  primaryIssue: "Anxiété",
  secondaryIssues: ["Sommeil", "Stress"],
  issueDescription:
    "Je ressens de l'anxiété au quotidien, particulièrement en situation de stress au travail. Cela affecte également mon sommeil.",
  severity: "moderate",
  duration: "threeToSix",
  availability: ["morning", "evening", "weekend"],
  modality: "online",
  location: "Montréal, QC",
  notes: "Préférence pour un suivi bilingue",
  preferredGender: "noPreference",
  preferredAge: "any",
  preferredApproach: "TCC",
};

export default function ClientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockUserData);
  const t = useTranslations("Client.profile");

  const handleSave = () => {
    // TODO: Save to API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(mockUserData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="gap-2 rounded-full"
          >
            <Pencil className="h-4 w-4" />
            {t("edit")}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="gap-2 rounded-full"
            >
              <X className="h-4 w-4" />
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} className="gap-2 rounded-full">
              <Save className="h-4 w-4" />
              {t("save")}
            </Button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <h2 className="font-serif text-2xl font-light text-foreground">
          {t("personalInfo.title")}
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t("personalInfo.firstName")}</Label>
            {isEditing ? (
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            ) : (
              <p className="text-foreground">{formData.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">{t("personalInfo.lastName")}</Label>
            {isEditing ? (
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            ) : (
              <p className="text-foreground">{formData.lastName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("personalInfo.email")}</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            ) : (
              <p className="text-foreground">{formData.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("personalInfo.phone")}</Label>
            {isEditing ? (
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            ) : (
              <p className="text-foreground">{formData.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">{t("personalInfo.language")}</Label>
            {isEditing ? (
              <select
                id="language"
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Français">Français</option>
                <option value="English">English</option>
              </select>
            ) : (
              <p className="text-foreground">{formData.language}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">{t("personalInfo.gender")}</Label>
            {isEditing ? (
              <Input
                id="gender"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
            ) : (
              <p className="text-foreground">{formData.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">{t("personalInfo.age")}</Label>
            {isEditing ? (
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: parseInt(e.target.value) })
                }
              />
            ) : (
              <p className="text-foreground">
                {formData.age} {t("personalInfo.years")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="concernedPerson">
              {t("personalInfo.concernedPerson")}
            </Label>
            {isEditing ? (
              <select
                id="concernedPerson"
                value={formData.concernedPerson}
                onChange={(e) =>
                  setFormData({ ...formData, concernedPerson: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="myself">{t("personalInfo.myself")}</option>
                <option value="myChild">{t("personalInfo.myChild")}</option>
                <option value="myPartner">{t("personalInfo.myPartner")}</option>
                <option value="other">{t("personalInfo.other")}</option>
              </select>
            ) : (
              <p className="text-foreground">
                {t(`personalInfo.${formData.concernedPerson}`)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Issue Details */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <h2 className="font-serif text-2xl font-light text-foreground">
          {t("issueDetails.title")}
        </h2>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="primaryIssue">
              {t("issueDetails.primaryIssue")}
            </Label>
            {isEditing ? (
              <Input
                id="primaryIssue"
                value={formData.primaryIssue}
                onChange={(e) =>
                  setFormData({ ...formData, primaryIssue: e.target.value })
                }
              />
            ) : (
              <p className="text-foreground">{formData.primaryIssue}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDescription">
              {t("issueDetails.description")}
            </Label>
            {isEditing ? (
              <Textarea
                id="issueDescription"
                value={formData.issueDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({
                    ...formData,
                    issueDescription: e.target.value,
                  })
                }
                placeholder={t("issueDetails.descriptionPlaceholder")}
                rows={4}
              />
            ) : (
              <p className="text-foreground">{formData.issueDescription}</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="severity">{t("issueDetails.severity")}</Label>
              {isEditing ? (
                <select
                  id="severity"
                  value={formData.severity}
                  onChange={(e) =>
                    setFormData({ ...formData, severity: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="mild">{t("issueDetails.mild")}</option>
                  <option value="moderate">{t("issueDetails.moderate")}</option>
                  <option value="severe">{t("issueDetails.severe")}</option>
                </select>
              ) : (
                <p className="text-foreground">
                  {t(`issueDetails.${formData.severity}`)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">{t("issueDetails.duration")}</Label>
              {isEditing ? (
                <select
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="lessThanMonth">
                    {t("issueDetails.lessThanMonth")}
                  </option>
                  <option value="oneToThree">
                    {t("issueDetails.oneToThree")}
                  </option>
                  <option value="threeToSix">
                    {t("issueDetails.threeToSix")}
                  </option>
                  <option value="moreThanSix">
                    {t("issueDetails.moreThanSix")}
                  </option>
                </select>
              ) : (
                <p className="text-foreground">
                  {t(`issueDetails.${formData.duration}`)}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Preferences */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <h2 className="font-serif text-2xl font-light text-foreground">
          {t("preferences.title")}
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("preferences.availability")}</Label>
            <div className="flex flex-wrap gap-2">
              {["morning", "afternoon", "evening", "weekend"].map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    if (!isEditing) return;
                    const newAvailability = formData.availability.includes(time)
                      ? formData.availability.filter((t) => t !== time)
                      : [...formData.availability, time];
                    setFormData({ ...formData, availability: newAvailability });
                  }}
                  disabled={!isEditing}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    formData.availability.includes(time)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  } ${isEditing ? "cursor-pointer hover:opacity-80" : ""}`}
                >
                  {t(`preferences.${time}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modality">{t("preferences.modality")}</Label>
            {isEditing ? (
              <select
                id="modality"
                value={formData.modality}
                onChange={(e) =>
                  setFormData({ ...formData, modality: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="online">{t("preferences.online")}</option>
                <option value="inPerson">{t("preferences.inPerson")}</option>
                <option value="both">{t("preferences.both")}</option>
              </select>
            ) : (
              <p className="text-foreground">
                {t(`preferences.${formData.modality}`)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t("preferences.location")}</Label>
            {isEditing ? (
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder={t("preferences.locationPlaceholder")}
              />
            ) : (
              <p className="text-foreground">{formData.location}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">{t("preferences.notes")}</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({
                    ...formData,
                    notes: e.target.value,
                  })
                }
                placeholder={t("preferences.notesPlaceholder")}
                rows={3}
              />
            ) : (
              <p className="text-foreground">{formData.notes}</p>
            )}
          </div>
        </div>
      </section>

      {/* Professional Matching Preferences */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <h2 className="font-serif text-2xl font-light text-foreground">
          {t("matching.title")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("matching.approachNote")}
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="preferredGender">
              {t("matching.preferredGender")}
            </Label>
            {isEditing ? (
              <select
                id="preferredGender"
                value={formData.preferredGender}
                onChange={(e) =>
                  setFormData({ ...formData, preferredGender: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="noPreference">
                  {t("matching.noPreference")}
                </option>
                <option value="male">{t("matching.male")}</option>
                <option value="female">{t("matching.female")}</option>
              </select>
            ) : (
              <p className="text-foreground">
                {t(`matching.${formData.preferredGender}`)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredAge">{t("matching.preferredAge")}</Label>
            {isEditing ? (
              <select
                id="preferredAge"
                value={formData.preferredAge}
                onChange={(e) =>
                  setFormData({ ...formData, preferredAge: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="any">{t("matching.any")}</option>
                <option value="younger">{t("matching.younger")}</option>
                <option value="middle">{t("matching.middle")}</option>
                <option value="older">{t("matching.older")}</option>
              </select>
            ) : (
              <p className="text-foreground">
                {t(`matching.${formData.preferredAge}`)}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
