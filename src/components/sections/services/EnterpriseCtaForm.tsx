"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EnterpriseCtaForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    coordinates: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact/business-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit business contact form");
      }

      setSubmitStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        coordinates: "",
        message: "",
      });
    } catch (error) {
      console.error("Business manager contact error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="enterprise-cta py-12">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold text-center mb-6 text-primary">
          Gestionnaire d'entreprise ?
        </h3>
        <p className="text-center text-muted-foreground mb-8">
          Intéressé par nos services de santé mentale en milieu de travail ?
          Contactez-nous pour en savoir plus.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-muted p-8 rounded-lg shadow-lg space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Prénom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Votre nom"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Courriel <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@courriel.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Téléphone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                pattern="[0-9\s\-\+\(\)]*"
                value={formData.phone}
                onChange={handleChange}
                placeholder="514-123-4567"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">
                Compagnie <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Nom de votre entreprise"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">
                Fonction <span className="text-red-500">*</span>
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Votre fonction"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinates">
              Coordonnées supplémentaires (Optionnel)
            </Label>
            <Input
              id="coordinates"
              name="coordinates"
              value={formData.coordinates}
              onChange={handleChange}
              placeholder="Adresse, bureau, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optionnel)</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Décrivez brièvement vos besoins..."
              rows={4}
            />
          </div>

          {submitStatus === "success" && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4 flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
              <CheckCircle2 className="h-5 w-5" />
              <span>
                Merci ! Votre demande a été envoyée avec succès. Nous vous
                contacterons bientôt.
              </span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4 flex items-center gap-2 text-sm text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <span>
                Une erreur s'est produite. Veuillez réessayer plus tard.
              </span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Contacter un conseiller
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
