"use client";
import MoteurRechercheMotifs from "./moteur_motif";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  Users,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Home,
  Calendar,
  Upload,
  FileText,
  X,
  Heart,
  Stethoscope,
  UserCircle2,
  CalendarDays,
  Search,
  HeartHandshake,
  GraduationCap,
  Baby,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Interface pour le formulaire CLIENT (Individuel/Adulte)
interface ClientFormData {
  // Identité
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  language: string;
  // Localisation
  cityOrPostal: string;
  // Modalité
  modality: string;
  // Disponibilités
  availability: string[];
  // Besoin
  notes: string;
  // Pour
  sessionFor: string;
  // Message
  message: string;
  email: string;
  phone: string;
  selectedMotifs: string[];
}

// Interface pour le formulaire PROCHE
interface LovedOneFormData {
  // Le Demandeur
  requesterFirstName: string;
  requesterLastName: string;
  relationship: string;
  requesterEmail: string;
  requesterPhone: string;
  // Le Client
  clientFirstName: string;
  clientLastName: string;
  clientDateOfBirth: string;
  clientCityOrPostal: string;
  clientLanguage: string;
  // Type de suivi
  followUpType: string;
  evaluationType: string;
  message: string;
  selectedMotifs: string[];
}

// Interface pour le formulaire PROFESSIONNEL
interface ProfessionalFormData {
  // Le Référent
  referrerFirstName: string;
  referrerLastName: string;
  referrerPhone: string;
  referrerEmail: string;
  // Le Patient
  patientFirstName: string;
  patientLastName: string;
  patientDateOfBirth: string;
  patientContact: string;
  // Document
  documentUrl: string;
  documentName: string;
  // Approches recommandées
  selectedApproaches: string[];
  selectedMotifs: string[];
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const { status } = useSession();

  // Récupérer le type depuis l'URL (self, patient, loved-one)
  const [bookingFor, setBookingFor] = useState<"self" | "patient" | "loved-one" | null>(null);

  // Auth state - simplifié, toujours en guest pour l'instant
  const [isGuest] = useState(true);
  const [authCheckDone, setAuthCheckDone] = useState(true);

  // Step management
  // Steps: 0 = Formulaire, 1 = Confirmation, 2 = Success
  const [currentStep, setCurrentStep] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // File upload state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ========== FORMULAIRE CLIENT ==========
  const [clientForm, setClientForm] = useState<ClientFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    language: "",
    cityOrPostal: "",
    modality: "",
    availability: [],
    notes: "",
    sessionFor: "individuel",
    message: "",
    email: "",
    phone: "",
    selectedMotifs: [],
  });

  // ========== FORMULAIRE PROCHE ==========
  const [lovedOneForm, setLovedOneForm] = useState<LovedOneFormData>({
    requesterFirstName: "",
    requesterLastName: "",
    relationship: "",
    requesterEmail: "",
    requesterPhone: "",
    clientFirstName: "",
    clientLastName: "",
    clientDateOfBirth: "",
    clientCityOrPostal: "",
    clientLanguage: "",
    followUpType: "",
    evaluationType: "",
    message: "",
    selectedMotifs: [],
  });

  // ========== FORMULAIRE PROFESSIONNEL ==========
  const [professionalForm, setProfessionalForm] = useState<ProfessionalFormData>({
    referrerFirstName: "",
    referrerLastName: "",
    referrerPhone: "",
    referrerEmail: "",
    patientFirstName: "",
    patientLastName: "",
    patientDateOfBirth: "",
    patientContact: "",
    documentUrl: "",
    documentName: "",
    selectedApproaches: [],
    selectedMotifs: [],
  });

  // Récupérer le type depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forParam = params.get("for");
    
    if (forParam === "self" || forParam === "patient" || forParam === "loved-one") {
      setBookingFor(forParam);
    } else {
      // Rediriger vers la page de choix si pas de paramètre
      router.push("/");
    }
  }, [router]);

  // ========== VALIDATIONS ==========
  const validateClientForm = (): boolean => {
    if (!clientForm.firstName || !clientForm.lastName || !clientForm.dateOfBirth || 
        !clientForm.gender || !clientForm.language || !clientForm.cityOrPostal || 
        !clientForm.modality || !clientForm.selectedMotifs || clientForm.selectedMotifs.length === 0 || 
        !clientForm.sessionFor || !clientForm.email || !clientForm.phone) {
      setError("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    setError("");
    return true;
  };

  const validateLovedOneForm = (): boolean => {
    if (!lovedOneForm.requesterFirstName || !lovedOneForm.requesterLastName || 
        !lovedOneForm.relationship || !lovedOneForm.requesterEmail || 
        !lovedOneForm.requesterPhone || !lovedOneForm.clientFirstName || 
        !lovedOneForm.clientLastName || !lovedOneForm.clientDateOfBirth || 
        !lovedOneForm.clientCityOrPostal || !lovedOneForm.clientLanguage || 
        !lovedOneForm.followUpType || !lovedOneForm.selectedMotifs || 
        lovedOneForm.selectedMotifs.length === 0) {
      setError("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    setError("");
    return true;
  };

  const validateProfessionalForm = (): boolean => {
    if (!professionalForm.referrerFirstName || !professionalForm.referrerLastName ||
        !professionalForm.patientFirstName || !professionalForm.patientLastName ||
        !professionalForm.patientDateOfBirth || !professionalForm.patientContact ||
        !professionalForm.selectedMotifs || professionalForm.selectedMotifs.length === 0) {
      setError("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    setError("");
    return true;
  };

  // ========== SOUMISSION ==========
  const handleClientSubmit = () => {
    if (validateClientForm()) {
      setCurrentStep(1); // Aller à la confirmation
    }
  };

  const handleLovedOneSubmit = () => {
    if (validateLovedOneForm()) {
      setCurrentStep(1);
    }
  };

  const handleProfessionalSubmit = () => {
    if (validateProfessionalForm()) {
      setCurrentStep(1);
    }
  };

  // SIMULATION - À SUPPRIMER QUAND LE BACKEND SERA CORRIGÉ
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log("=== SIMULATION DE SOUMISSION ===");
      console.log("Type:", bookingFor);
      if (bookingFor === "self") {
        console.log("Données client:", clientForm);
      } else if (bookingFor === "patient") {
        console.log("Données professionnel:", professionalForm);
      } else if (bookingFor === "loved-one") {
        console.log("Données proche:", lovedOneForm);
      }
      console.log("================================");

      setSuccessMessage("✅ Votre demande a été soumise avec succès !");
      setCurrentStep(2); // Success step

    } catch (err) {
      console.error("Erreur:", err);
      setError("Une erreur est survenue lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  // ========== UPLOAD FICHIER (simulé) ==========
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Fichier trop volumineux (max 10MB)");
      return;
    }

    try {
      setUploading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfessionalForm({
        ...professionalForm,
        documentUrl: "simulation",
        documentName: file.name,
      });
    } catch (err) {
      setError("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDocument = () => {
    setProfessionalForm({
      ...professionalForm,
      documentUrl: "",
      documentName: "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ========== RENDU ==========
  const renderSummary = () => (
    <div className="bg-card rounded-xl border border-border/40 p-6 space-y-6 sticky top-8">
      <h3 className="font-serif text-lg font-medium border-b border-border/40 pb-4 mb-4">
        Résumé de la demande
      </h3>

      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Type de demande
        </p>
        <div className="flex items-center gap-2 text-sm">
          {bookingFor === "self" && <UserCircle2 className="h-4 w-4 text-primary" />}
          {bookingFor === "patient" && <Stethoscope className="h-4 w-4 text-blue-500" />}
          {bookingFor === "loved-one" && <Heart className="h-4 w-4 text-pink-500" />}
          <span className="font-medium">
            {bookingFor === "self" && "Client (Individuel / Adulte)"}
            {bookingFor === "patient" && "Professionnel (Référence)"}
            {bookingFor === "loved-one" && "Proche"}
          </span>
        </div>
      </div>

      {/* Coordonnées de contact */}
      {bookingFor === "self" && clientForm.email && currentStep >= 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Contact
          </p>
          <div className="text-sm">
            <p className="font-medium">{clientForm.firstName} {clientForm.lastName}</p>
            <p className="text-muted-foreground text-xs">{clientForm.email}</p>
            <p className="text-muted-foreground text-xs">{clientForm.phone}</p>
          </div>
        </div>
      )}

      {bookingFor === "loved-one" && lovedOneForm.requesterEmail && currentStep >= 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Contact
          </p>
          <div className="text-sm">
            <p className="font-medium">{lovedOneForm.requesterFirstName} {lovedOneForm.requesterLastName}</p>
            <p className="text-muted-foreground text-xs">{lovedOneForm.requesterEmail}</p>
            <p className="text-muted-foreground text-xs">{lovedOneForm.requesterPhone}</p>
          </div>
        </div>
      )}

      {bookingFor === "patient" && professionalForm.referrerEmail && currentStep >= 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Contact
          </p>
          <div className="text-sm">
            <p className="font-medium">{professionalForm.referrerFirstName} {professionalForm.referrerLastName}</p>
            <p className="text-muted-foreground text-xs">{professionalForm.referrerEmail}</p>
            <p className="text-muted-foreground text-xs">{professionalForm.referrerPhone}</p>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
          Comment ça fonctionne :
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
          Après l'envoi de votre demande, un professionnel qualifié l'examinera 
          et vous contactera pour planifier votre rendez-vous.
        </p>
      </div>

      {/* Mode simulation */}
      <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-4 border border-yellow-200 dark:border-yellow-800">
        <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium">
          ⚠️ Mode Simulation
        </p>
        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
          Le backend est en maintenance. Les données ne sont pas sauvegardées.
        </p>
      </div>
    </div>
  );

  // Afficher un loader pendant le chargement
  if (!bookingFor || !authCheckDone) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background to-muted/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-4xl font-serif font-light text-foreground mb-2">
            Demande de rendez-vous
          </h1>
          <p className="text-muted-foreground text-lg">
            {bookingFor === "self" && "Formulaire CLIENT (Individuel / Adulte)"}
            {bookingFor === "patient" && "Formulaire PROFESSIONNEL (Référence médecin/intervenant)"}
            {bookingFor === "loved-one" && "Formulaire PROCHE (Parent pour enfant, conjoint, etc.)"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Summary */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
            {renderSummary()}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* Error Display */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 p-4">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && currentStep === 2 && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/30 p-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            {/* ========== FORMULAIRE CLIENT (Individuel / Adulte) ========== */}
            {bookingFor === "self" && currentStep === 0 && (
              <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
                <div className="p-6 border-b border-border/40">
                  <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                    <UserCircle2 className="h-5 w-5 text-primary" />
                    Formulaire CLIENT (Individuel / Adulte)
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Identité */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <User className="h-4 w-4" />
                      Identité
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientLastName">Nom *</Label>
                        <Input
                          id="clientLastName"
                          value={clientForm.lastName}
                          onChange={(e) => setClientForm({ ...clientForm, lastName: e.target.value })}
                          placeholder="Votre nom"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientFirstName">Prénom *</Label>
                        <Input
                          id="clientFirstName"
                          value={clientForm.firstName}
                          onChange={(e) => setClientForm({ ...clientForm, firstName: e.target.value })}
                          placeholder="Votre prénom"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientDob">Date de naissance *</Label>
                        <Input
                          id="clientDob"
                          type="date"
                          value={clientForm.dateOfBirth}
                          onChange={(e) => setClientForm({ ...clientForm, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientGender">Genre *</Label>
                        <Select
                          value={clientForm.gender}
                          onValueChange={(value) => setClientForm({ ...clientForm, gender: value })}
                        >
                          <SelectTrigger id="clientGender">
                            <SelectValue placeholder="Sélectionnez" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="H">Homme</SelectItem>
                            <SelectItem value="F">Femme</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientLanguage">Langue *</Label>
                      <Select
                        value={clientForm.language}
                        onValueChange={(value) => setClientForm({ ...clientForm, language: value })}
                      >
                        <SelectTrigger id="clientLanguage">
                          <SelectValue placeholder="Sélectionnez votre langue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">Anglais</SelectItem>
                          <SelectItem value="es">Espagnol</SelectItem>
                          <SelectItem value="ar">Arabe</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Localisation */}
                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <MapPin className="h-4 w-4" />
                      Localisation
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="clientLocation">Ville ou Code Postal *</Label>
                      <Input
                        id="clientLocation"
                        value={clientForm.cityOrPostal}
                        onChange={(e) => setClientForm({ ...clientForm, cityOrPostal: e.target.value })}
                        placeholder="Ville ou code postal"
                      />
                    </div>
                  </div>

                  {/* Modalité */}
                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <Video className="h-4 w-4" />
                      Modalité
                    </h3>
                    <Select
                      value={clientForm.modality}
                      onValueChange={(value) => setClientForm({ ...clientForm, modality: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez votre modalité préférée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Présentiel">Présentiel</SelectItem>
                        <SelectItem value="À distance">À distance</SelectItem>
                        <SelectItem value="Ouvert aux deux">Ouvert aux deux</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Coordonnées de contact */}
                  <div className="space-y-4 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <Mail className="h-4 w-4" />
                      Coordonnées de contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientEmail">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="clientEmail"
                            type="email"
                            value={clientForm.email}
                            onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                            placeholder="votre.email@exemple.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientPhone">Téléphone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="clientPhone"
                            type="tel"
                            value={clientForm.phone}
                            onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                            placeholder="+33 6 12 34 56 78"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Disponibilités */}
                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <CalendarDays className="h-4 w-4" />
                      Disponibilités
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Sélection pour la semaine suivante
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        "Lundi matin",
                        "Lundi après-midi",
                        "Mardi matin",
                        "Mardi après-midi",
                        "Mercredi matin",
                        "Mercredi après-midi",
                        "Jeudi matin",
                        "Jeudi après-midi",
                        "Vendredi matin",
                        "Vendredi après-midi",
                        "Samedi",
                      ].map((option) => (
                        <Button
                          key={option}
                          type="button"
                          variant={clientForm.availability.includes(option) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (clientForm.availability.includes(option)) {
                              setClientForm({
                                ...clientForm,
                                availability: clientForm.availability.filter((a) => a !== option),
                              });
                            } else {
                              setClientForm({
                                ...clientForm,
                                availability: [...clientForm.availability, option],
                              });
                            }
                          }}
                          className="text-xs"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Besoin - AVEC MOTEUR DE RECHERCHE */}
                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <Search className="h-4 w-4" />
                      Besoin
                    </h3>
                    <div className="space-y-4">
                      <MoteurRechercheMotifs
                        selectedMotifs={clientForm.selectedMotifs}
                        onMotifsChange={(motifs) => setClientForm({ 
                          ...clientForm, 
                          selectedMotifs: motifs
                        })}
                        maxSelections={3}
                        placeholder="Recherchez un motif (ex: anxiété, stress, couple)..."
                      />
                      <div className="space-y-2">
                        <Label htmlFor="clientNotes">Zone de texte libre (message)</Label>
                        <Textarea
                          id="clientNotes"
                          value={clientForm.notes}
                          onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                          placeholder="Décrivez votre besoin plus en détail..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pour (individuel/couple/famille) */}
                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <Users className="h-4 w-4" />
                      Pour
                    </h3>
                    <Select
                      value={clientForm.sessionFor}
                      onValueChange={(value) => setClientForm({ ...clientForm, sessionFor: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individuel">Individuel</SelectItem>
                        <SelectItem value="couple">Couple</SelectItem>
                        <SelectItem value="famille">Famille</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <Mail className="h-4 w-4" />
                      Message
                    </h3>
                    <Textarea
                      value={clientForm.message}
                      onChange={(e) => setClientForm({ ...clientForm, message: e.target.value })}
                      placeholder="Votre message..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleClientSubmit} size="lg">
                      Continuer
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ========== FORMULAIRE PROFESSIONNEL ========== */}
            {bookingFor === "patient" && currentStep === 0 && (
              <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
                <div className="p-6 border-b border-border/40">
                  <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-blue-500" />
                    Formulaire PROFESSIONNEL
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Le Référent */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <User className="h-4 w-4" />
                      Le Référent
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="referrerLastName">Nom *</Label>
                        <Input
                          id="referrerLastName"
                          value={professionalForm.referrerLastName}
                          onChange={(e) =>
                            setProfessionalForm({ ...professionalForm, referrerLastName: e.target.value })
                          }
                          placeholder="Nom du médecin/professionnel"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referrerFirstName">Prénom *</Label>
                        <Input
                          id="referrerFirstName"
                          value={professionalForm.referrerFirstName}
                          onChange={(e) =>
                            setProfessionalForm({ ...professionalForm, referrerFirstName: e.target.value })
                          }
                          placeholder="Prénom du médecin/professionnel"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="referrerPhone">Téléphone (optionnel)</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="referrerPhone"
                            type="tel"
                            value={professionalForm.referrerPhone}
                            onChange={(e) =>
                              setProfessionalForm({ ...professionalForm, referrerPhone: e.target.value })
                            }
                            placeholder="+33 6 12 34 56 78"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referrerEmail">Courriel (optionnel)</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="referrerEmail"
                            type="email"
                            value={professionalForm.referrerEmail}
                            onChange={(e) =>
                              setProfessionalForm({ ...professionalForm, referrerEmail: e.target.value })
                            }
                            placeholder="medecin@clinique.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Le Patient */}
                  <div className="space-y-4 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <User className="h-4 w-4" />
                      Le Patient
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientLastName">Nom *</Label>
                        <Input
                          id="patientLastName"
                          value={professionalForm.patientLastName}
                          onChange={(e) =>
                            setProfessionalForm({ ...professionalForm, patientLastName: e.target.value })
                          }
                          placeholder="Nom du patient"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientFirstName">Prénom *</Label>
                        <Input
                          id="patientFirstName"
                          value={professionalForm.patientFirstName}
                          onChange={(e) =>
                            setProfessionalForm({ ...professionalForm, patientFirstName: e.target.value })
                          }
                          placeholder="Prénom du patient"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientDob">Date de naissance *</Label>
                        <Input
                          id="patientDob"
                          type="date"
                          value={professionalForm.patientDateOfBirth}
                          onChange={(e) =>
                            setProfessionalForm({ ...professionalForm, patientDateOfBirth: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientContact">Téléphone ou Courriel *</Label>
                        <Input
                          id="patientContact"
                          value={professionalForm.patientContact}
                          onChange={(e) =>
                            setProfessionalForm({ ...professionalForm, patientContact: e.target.value })
                          }
                          placeholder="Téléphone ou email du patient"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document */}
                  <div className="space-y-3 pt-4">
                    <Label htmlFor="referral-upload" className="font-medium">
                      Requête PDF *
                      <span className="text-xs text-muted-foreground ml-2">
                        (Important pour faciliter l&apos;extraction de données)
                      </span>
                    </Label>
                    <div className="border-2 border-dashed border-border/60 rounded-xl p-6">
                      {professionalForm.documentUrl ? (
                        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-medium text-sm">{professionalForm.documentName}</p>
                              <p className="text-xs text-muted-foreground">Document téléchargé</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveDocument}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="referral-upload"
                          />
                          <label
                            htmlFor="referral-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            {uploading ? (
                              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                            ) : (
                              <Upload className="h-10 w-10 text-muted-foreground" />
                            )}
                            <p className="mt-2 text-sm text-muted-foreground">
                              {uploading ? "Téléchargement..." : "Cliquez pour télécharger ou glissez-déposez"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (max 10MB)</p>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Approches recommandées */}
                  <div className="space-y-2 pt-4">
                    <Label>Approches recommandées</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "TCC",
                        "ACT",
                        "Psychodynamique",
                        "Humaniste",
                        "Systémique",
                        "Hypnose",
                        "Pleine conscience",
                      ].map((approach) => (
                        <Button
                          key={approach}
                          type="button"
                          variant={professionalForm.selectedApproaches.includes(approach) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (professionalForm.selectedApproaches.includes(approach)) {
                              setProfessionalForm({
                                ...professionalForm,
                                selectedApproaches: professionalForm.selectedApproaches.filter((a) => a !== approach),
                              });
                            } else {
                              setProfessionalForm({
                                ...professionalForm,
                                selectedApproaches: [...professionalForm.selectedApproaches, approach],
                              });
                            }
                          }}
                          className="text-xs"
                        >
                          {approach}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Motif - AVEC MOTEUR DE RECHERCHE */}
                  <div className="space-y-2 pt-4">
                    <MoteurRechercheMotifs
                      selectedMotifs={professionalForm.selectedMotifs}
                      onMotifsChange={(motifs) => setProfessionalForm({ 
                        ...professionalForm, 
                        selectedMotifs: motifs
                      })}
                      maxSelections={3}
                      placeholder="Recherchez le motif de référence..."
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleProfessionalSubmit} size="lg" disabled={uploading}>
                      Continuer
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ========== FORMULAIRE PROCHE ========== */}
            {bookingFor === "loved-one" && currentStep === 0 && (
              <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
                <div className="p-6 border-b border-border/40">
                  <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    Formulaire PROCHE
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Le Demandeur */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <User className="h-4 w-4" />
                      Le Demandeur
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="requesterLastName">Nom *</Label>
                        <Input
                          id="requesterLastName"
                          value={lovedOneForm.requesterLastName}
                          onChange={(e) =>
                            setLovedOneForm({ ...lovedOneForm, requesterLastName: e.target.value })
                          }
                          placeholder="Votre nom"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="requesterFirstName">Prénom *</Label>
                        <Input
                          id="requesterFirstName"
                          value={lovedOneForm.requesterFirstName}
                          onChange={(e) =>
                            setLovedOneForm({ ...lovedOneForm, requesterFirstName: e.target.value })
                          }
                          placeholder="Votre prénom"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relationship">Lien de parenté *</Label>
                      <Select
                        value={lovedOneForm.relationship}
                        onValueChange={(value) => setLovedOneForm({ ...lovedOneForm, relationship: value })}
                      >
                        <SelectTrigger id="relationship">
                          <SelectValue placeholder="Sélectionnez le lien" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="conjoint">Conjoint</SelectItem>
                          <SelectItem value="enfant">Enfant</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="requesterEmail">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="requesterEmail"
                            type="email"
                            value={lovedOneForm.requesterEmail}
                            onChange={(e) =>
                              setLovedOneForm({ ...lovedOneForm, requesterEmail: e.target.value })
                            }
                            placeholder="votre.email@exemple.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="requesterPhone">Téléphone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="requesterPhone"
                            type="tel"
                            value={lovedOneForm.requesterPhone}
                            onChange={(e) =>
                              setLovedOneForm({ ...lovedOneForm, requesterPhone: e.target.value })
                            }
                            placeholder="+33 6 12 34 56 78"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Le Client */}
                  <div className="space-y-4 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <User className="h-4 w-4" />
                      Le Client
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientLastName">Nom *</Label>
                        <Input
                          id="clientLastName"
                          value={lovedOneForm.clientLastName}
                          onChange={(e) =>
                            setLovedOneForm({ ...lovedOneForm, clientLastName: e.target.value })
                          }
                          placeholder="Nom du client"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientFirstName">Prénom *</Label>
                        <Input
                          id="clientFirstName"
                          value={lovedOneForm.clientFirstName}
                          onChange={(e) =>
                            setLovedOneForm({ ...lovedOneForm, clientFirstName: e.target.value })
                          }
                          placeholder="Prénom du client"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientDob">Date de naissance *</Label>
                        <Input
                          id="clientDob"
                          type="date"
                          value={lovedOneForm.clientDateOfBirth}
                          onChange={(e) =>
                            setLovedOneForm({ ...lovedOneForm, clientDateOfBirth: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientCity">Ville/Code Postal *</Label>
                        <Input
                          id="clientCity"
                          value={lovedOneForm.clientCityOrPostal}
                          onChange={(e) =>
                            setLovedOneForm({ ...lovedOneForm, clientCityOrPostal: e.target.value })
                          }
                          placeholder="Ville ou code postal"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientLanguage">Langue *</Label>
                      <Select
                        value={lovedOneForm.clientLanguage}
                        onValueChange={(value) => setLovedOneForm({ ...lovedOneForm, clientLanguage: value })}
                      >
                        <SelectTrigger id="clientLanguage">
                          <SelectValue placeholder="Sélectionnez la langue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">Anglais</SelectItem>
                          <SelectItem value="es">Espagnol</SelectItem>
                          <SelectItem value="ar">Arabe</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Type de suivi */}
                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <CalendarDays className="h-4 w-4" />
                      Type de suivi
                    </h3>
                    <Select
                      value={lovedOneForm.followUpType}
                      onValueChange={(value) => setLovedOneForm({ ...lovedOneForm, followUpType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type de suivi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individuel">Individuel</SelectItem>
                        <SelectItem value="familial">Familial</SelectItem>
                        <SelectItem value="couple">Couple</SelectItem>
                        <SelectItem value="evaluation">Évaluation</SelectItem>
                      </SelectContent>
                    </Select>

                    {lovedOneForm.followUpType === "evaluation" && (
                      <div className="mt-4">
                        <Label htmlFor="evaluationType">Type d'évaluation</Label>
                        <Select
                          value={lovedOneForm.evaluationType}
                          onValueChange={(value) => setLovedOneForm({ ...lovedOneForm, evaluationType: value })}
                        >
                          <SelectTrigger id="evaluationType">
                            <SelectValue placeholder="Sélectionnez le type d'évaluation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="psycho-scolaire">Psycho-scolaire</SelectItem>
                            <SelectItem value="neuropsychologique">Neuropsychologique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Motif de consultation - AVEC MOTEUR DE RECHERCHE */}
                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <Search className="h-4 w-4" />
                      Motif de consultation
                    </h3>
                    <MoteurRechercheMotifs
                      selectedMotifs={lovedOneForm.selectedMotifs}
                      onMotifsChange={(motifs) => setLovedOneForm({ 
                        ...lovedOneForm, 
                        selectedMotifs: motifs 
                      })}
                      maxSelections={3}
                      placeholder="Recherchez le motif de consultation..."
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                      <Mail className="h-4 w-4" />
                      Message
                    </h3>
                    <Textarea
                      value={lovedOneForm.message}
                      onChange={(e) => setLovedOneForm({ ...lovedOneForm, message: e.target.value })}
                      placeholder="Précisions additionnelles..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleLovedOneSubmit} size="lg">
                      Continuer
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ========== CONFIRMATION ========== */}
            {currentStep === 1 && (
              <div className="max-w-4xl mx-auto rounded-xl bg-card border border-border/40">
                <div className="p-6 border-b border-border/40">
                  <h2 className="text-xl font-serif font-light text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Vérifiez votre demande
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4 bg-muted/30 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Type de demande</p>
                        <p className="font-medium">
                          {bookingFor === "self" ? "Client (Individuel)" : 
                           bookingFor === "patient" ? "Professionnel (Référence)" : 
                           "Proche"}
                        </p>
                      </div>

                      {bookingFor === "self" && (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Client</p>
                            <p className="font-medium">{clientForm.firstName} {clientForm.lastName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Modalité</p>
                            <p className="font-medium">{clientForm.modality}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Pour</p>
                            <p className="font-medium capitalize">{clientForm.sessionFor}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs text-muted-foreground mb-1">Motifs</p>
                            <div className="flex flex-wrap gap-1">
                              {clientForm.selectedMotifs.map((motif, idx) => (
                                <span key={idx} className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                                  {motif}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Email</p>
                            <p className="font-medium">{clientForm.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
                            <p className="font-medium">{clientForm.phone}</p>
                          </div>
                        </>
                      )}

                      {bookingFor === "patient" && (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Référent</p>
                            <p className="font-medium">
                              {professionalForm.referrerFirstName} {professionalForm.referrerLastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Patient</p>
                            <p className="font-medium">
                              {professionalForm.patientFirstName} {professionalForm.patientLastName}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs text-muted-foreground mb-1">Motifs</p>
                            <div className="flex flex-wrap gap-1">
                              {professionalForm.selectedMotifs.map((motif, idx) => (
                                <span key={idx} className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                                  {motif}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {bookingFor === "loved-one" && (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Demandeur</p>
                            <p className="font-medium">
                              {lovedOneForm.requesterFirstName} {lovedOneForm.requesterLastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Client</p>
                            <p className="font-medium">
                              {lovedOneForm.clientFirstName} {lovedOneForm.clientLastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Type de suivi</p>
                            <p className="font-medium capitalize">{lovedOneForm.followUpType}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs text-muted-foreground mb-1">Motifs</p>
                            <div className="flex flex-wrap gap-1">
                              {lovedOneForm.selectedMotifs.map((motif, idx) => (
                                <span key={idx} className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                                  {motif}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Email</p>
                            <p className="font-medium">{lovedOneForm.requesterEmail}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
                            <p className="font-medium">{lovedOneForm.requesterPhone}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 p-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">
                          Prochaines étapes :
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Après l'envoi de votre demande, un professionnel qualifié l'examinera 
                          et vous contactera dans les plus brefs délais.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(0)}>
                      Retour
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} size="lg">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        "Confirmer la demande"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ========== SUCCÈS ========== */}
            {currentStep === 2 && (
              <div className="max-w-2xl mx-auto text-center">
                <div className="rounded-xl bg-card border border-border/40 p-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-light text-foreground mb-2">
                    Demande envoyée avec succès !
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {successMessage || "Votre demande de rendez-vous a été soumise avec succès."}
                  </p>

                  <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/30 p-4 mb-6">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Merci pour votre confiance !</strong>
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Un professionnel qualifié examinera votre demande et vous contactera 
                      dans les plus brefs délais.
                    </p>
                  </div>

                  <Button variant="outline" onClick={() => router.push("/")} className="gap-2">
                    <Home className="h-4 w-4" />
                    Retour à l'accueil
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}