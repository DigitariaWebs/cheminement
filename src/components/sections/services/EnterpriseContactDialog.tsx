"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface EnterpriseContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EnterpriseContactDialog({
  open,
  onOpenChange,
}: EnterpriseContactDialogProps) {
  const t = useTranslations("Services.enterpriseCta");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    coordinates: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      coordinates: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/enterprise/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to submit form");
      resetForm();
      alert(t("successMessage"));
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(t("errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {t("formTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("firstName")}</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t("firstNamePlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("lastName")}</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t("lastNamePlaceholder")}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("emailPlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("phonePlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">{t("company")}</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder={t("companyPlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">{t("position")}</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder={t("positionPlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coordinates">{t("coordinates")}</Label>
            <Textarea
              id="coordinates"
              name="coordinates"
              value={formData.coordinates}
              onChange={handleChange}
              placeholder={t("coordinatesPlaceholder")}
              rows={2}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submitButton")
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
