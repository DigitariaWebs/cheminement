"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MotifSearch } from "@/components/ui/MotifSearch";
import { Upload, X } from "lucide-react";

export interface AppointmentFormProps {
  userType: "client" | "professional" | "lovedOne";
  userInfo?: Partial<{
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    language: string;
    phone: string;
    location: string;
  }>;
  onSubmit: (formData: any) => void;
  disabledFields?: string[];
  initialValues?: Record<string, any>;
}

interface FormData {
  // Common fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  language: string;
  location: string;
  selectedMotifs: string[];
  message: string;
  // Client-specific
  gender: string;
  modality: string;
  sessionType: string;
  availability: string[];
  // Professional-specific
  referrerName: string;
  referrerPhone: string;
  referrerEmail: string;
  patientName: string;
  patientFirstName: string;
  patientDOB: string;
  patientPhone: string;
  patientEmail: string;
  approaches: string[];
  uploadedFile: File | null;
  // Loved One-specific
  requesterRelationship: string;
  clientDOB: string;
  clientLocation: string;
  clientLanguage: string;
}

const AppointmentForm = ({
  userType,
  userInfo,
  onSubmit,
  disabledFields = [],
  initialValues = {},
}: AppointmentFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    // Common fields
    firstName: userInfo?.firstName || initialValues.firstName || "",
    lastName: userInfo?.lastName || initialValues.lastName || "",
    email: userInfo?.email || initialValues.email || "",
    phone: userInfo?.phone || initialValues.phone || "",
    dateOfBirth: userInfo?.dateOfBirth || initialValues.dateOfBirth || "",
    language: userInfo?.language || initialValues.language || "FR",
    location: userInfo?.location || initialValues.location || "",
    selectedMotifs: initialValues.motifs || [],
    message: initialValues.message || "",
    // Client-specific
    gender: userInfo?.gender || initialValues.gender || "",
    modality: initialValues.modality || "in-person",
    sessionType: initialValues.sessionType || "individual",
    availability: initialValues.availability || [],
    // Professional-specific
    referrerName: initialValues.referrerName || "",
    referrerPhone: initialValues.referrerPhone || "",
    referrerEmail: initialValues.referrerEmail || "",
    patientName: initialValues.patientName || "",
    patientFirstName: initialValues.patientFirstName || "",
    patientDOB: initialValues.patientDOB || "",
    patientPhone: initialValues.patientPhone || "",
    patientEmail: initialValues.patientEmail || "",
    approaches: initialValues.approaches || [],
    uploadedFile: null,
    // Loved One-specific
    requesterRelationship: initialValues.requesterRelationship || "",
    clientDOB: initialValues.clientDOB || "",
    clientLocation: initialValues.clientLocation || "",
    clientLanguage: initialValues.clientLanguage || "FR",
  });

  // Helper function to update form data
  const updateField = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Check if field is disabled
  const isDisabled = (fieldName: string) => disabledFields.includes(fieldName);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      updateField("uploadedFile", e.target.files[0]);
    }
  };

  const removeFile = () => {
    updateField("uploadedFile", null);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData: any = {
      userType,
      ...formData,
    };

    onSubmit(submitData);
  };

  // CLIENT FORM
  if (userType === "client") {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Identity Section */}
          <div>
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              disabled={isDisabled("firstName")}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              placeholder="Nom"
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              disabled={isDisabled("lastName")}
              required
            />
          </div>
          <div>
            <Label htmlFor="dob">Date de naissance</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateField("dateOfBirth", e.target.value)}
              disabled={isDisabled("dateOfBirth")}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender">Genre</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => updateField("gender", value)}
            >
              <SelectTrigger disabled={isDisabled("gender")}>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Homme</SelectItem>
                <SelectItem value="F">Femme</SelectItem>
                <SelectItem value="Other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="language">Langue</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => updateField("language", value)}
            >
              <SelectTrigger disabled={isDisabled("language")}>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FR">Français</SelectItem>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="ES">Español</SelectItem>
                <SelectItem value="AR">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Ville ou Code Postal</Label>
            <Input
              id="location"
              placeholder="Ville ou Code Postal"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              disabled={isDisabled("location")}
              required
            />
          </div>
        </div>

        {/* Modality Section */}
        <div>
          <Label>Modalité</Label>
          <RadioGroup
            value={formData.modality}
            onValueChange={(value) => updateField("modality", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-person" id="in-person" />
              <Label htmlFor="in-person">Présentiel</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="remote" id="remote" />
              <Label htmlFor="remote">À distance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both">Ouvert aux deux</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Session Type */}
        <div>
          <Label htmlFor="sessionType">Pour</Label>
          <Select
            value={formData.sessionType}
            onValueChange={(value) => updateField("sessionType", value)}
          >
            <SelectTrigger id="sessionType">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individuel</SelectItem>
              <SelectItem value="couple">Couple</SelectItem>
              <SelectItem value="family">Famille</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Motif Search */}
        <div>
          <Label>Motif de Consultation</Label>
          <MotifSearch
            value={formData.selectedMotifs[0] || ""}
            onChange={(motif: string) =>
              updateField("selectedMotifs", motif ? [motif] : [])
            }
            placeholder="Tapez vos motifs ex: anxiété, burnout..."
          />
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Message ou détails additionnels"
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full">
          Soumettre
        </Button>
      </form>
    );
  }

  // PROFESSIONAL FORM
  if (userType === "professional") {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Referrer Section */}
        <div className="border-b pb-6">
          <h3 className="font-semibold mb-4">Le Référent</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="referrerName">Nom</Label>
              <Input
                id="referrerName"
                placeholder="Nom du professionnel"
                value={formData.referrerName}
                onChange={(e) => updateField("referrerName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="referrerFirstName">Prénom</Label>
              <Input
                id="referrerFirstName"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="referrerPhone">Téléphone (optionnel)</Label>
              <Input
                id="referrerPhone"
                type="tel"
                placeholder="Téléphone"
                value={formData.referrerPhone}
                onChange={(e) => updateField("referrerPhone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="referrerEmail">Email (optionnel)</Label>
              <Input
                id="referrerEmail"
                type="email"
                placeholder="Email"
                value={formData.referrerEmail}
                onChange={(e) => updateField("referrerEmail", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Patient Section */}
        <div className="border-b pb-6">
          <h3 className="font-semibold mb-4">Le Patient</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Nom</Label>
              <Input
                id="patientName"
                placeholder="Nom du patient"
                value={formData.patientName}
                onChange={(e) => updateField("patientName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="patientFirstName">Prénom</Label>
              <Input
                id="patientFirstName"
                placeholder="Prénom"
                value={formData.patientFirstName}
                onChange={(e) =>
                  updateField("patientFirstName", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="patientDOB">Date de naissance</Label>
              <Input
                id="patientDOB"
                type="date"
                value={formData.patientDOB}
                onChange={(e) => updateField("patientDOB", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="patientPhone">Téléphone ou Email</Label>
              <Input
                id="patientPhone"
                placeholder="Téléphone ou Email"
                value={formData.patientPhone}
                onChange={(e) => updateField("patientPhone", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="border-b pb-6">
          <Label>Document - Requête PDF</Label>
          <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
            {formData.uploadedFile ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {formData.uploadedFile.name}
                </span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="flex justify-center mb-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  required
                />
                <p className="text-sm text-gray-600">
                  Cliquez pour télécharger
                </p>
              </label>
            )}
          </div>
        </div>

        {/* Approaches */}
        <div className="border-b pb-6">
          <Label>Approches recommandées</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {[
              "TCC",
              "ACT",
              "Psychodynamique",
              "Humaniste",
              "Systémique",
              "Hypnose",
              "Pleine conscience",
            ].map((approach) => (
              <label key={approach} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.approaches.includes(approach)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateField("approaches", [
                        ...formData.approaches,
                        approach,
                      ]);
                    } else {
                      updateField(
                        "approaches",
                        formData.approaches.filter((a) => a !== approach),
                      );
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm">{approach}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Motif Search */}
        <div>
          <Label>Motif</Label>
          <MotifSearch
            value={formData.selectedMotifs[0] || ""}
            onChange={(motif: string) =>
              updateField("selectedMotifs", motif ? [motif] : [])
            }
            placeholder="Tapez vos motifs ex: anxiété, burnout..."
          />
        </div>

        <Button type="submit" className="w-full">
          Soumettre
        </Button>
      </form>
    );
  }

  // LOVED ONE FORM
  if (userType === "lovedOne") {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Requester Section */}
        <div className="border-b pb-6">
          <h3 className="font-semibold mb-4">Le Demandeur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="requesterFirstName">Prénom</Label>
              <Input
                id="requesterFirstName"
                placeholder="Votre prénom"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                disabled={isDisabled("firstName")}
                required
              />
            </div>
            <div>
              <Label htmlFor="requesterLastName">Nom</Label>
              <Input
                id="requesterLastName"
                placeholder="Votre nom"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                disabled={isDisabled("lastName")}
                required
              />
            </div>
            <div>
              <Label htmlFor="relationship">Lien de parenté</Label>
              <Select
                value={formData.requesterRelationship}
                onValueChange={(value) =>
                  updateField("requesterRelationship", value)
                }
              >
                <SelectTrigger id="relationship">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="spouse">Conjoint</SelectItem>
                  <SelectItem value="sibling">Frère/Sœur</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Client Section */}
        <div className="border-b pb-6">
          <h3 className="font-semibold mb-4">Le Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientFirstName">Prénom</Label>
              <Input
                id="clientFirstName"
                placeholder="Prénom du client"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientLastName">Nom</Label>
              <Input
                id="clientLastName"
                placeholder="Nom du client"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientDOB">Date de naissance</Label>
              <Input
                id="clientDOB"
                type="date"
                value={formData.clientDOB}
                onChange={(e) => updateField("clientDOB", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientLocation">Ville ou Code Postal</Label>
              <Input
                id="clientLocation"
                placeholder="Ville ou Code Postal"
                value={formData.clientLocation}
                onChange={(e) => updateField("clientLocation", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientLanguage">Langue</Label>
              <Select
                value={formData.clientLanguage}
                onValueChange={(value) => updateField("clientLanguage", value)}
              >
                <SelectTrigger id="clientLanguage">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FR">Français</SelectItem>
                  <SelectItem value="EN">English</SelectItem>
                  <SelectItem value="ES">Español</SelectItem>
                  <SelectItem value="AR">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Session Type */}
        <div>
          <Label htmlFor="sessionType">Type de suivi</Label>
          <Select
            value={formData.sessionType}
            onValueChange={(value) => updateField("sessionType", value)}
          >
            <SelectTrigger id="sessionType">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individuel</SelectItem>
              <SelectItem value="family">Familial</SelectItem>
              <SelectItem value="couple">Couple</SelectItem>
              <SelectItem value="evaluation">Évaluation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Motif Search */}
        <div>
          <Label>Motif de Consultation</Label>
          <MotifSearch
            value={formData.selectedMotifs[0] || ""}
            onChange={(motif: string) =>
              updateField("selectedMotifs", motif ? [motif] : [])
            }
            placeholder="Tapez vos motifs ex: anxiété, burnout..."
          />
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Précisions additionnelles"
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full">
          Soumettre
        </Button>
      </form>
    );
  }

  return null;
};

export default AppointmentForm;
