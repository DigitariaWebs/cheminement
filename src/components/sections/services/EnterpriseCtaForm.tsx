"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function EnterpriseCtaForm() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/enterprise/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        coordinates: "",
      });
      
      alert(t("successMessage"));
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(t("errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute left-0 top-20 h-80 w-80 -translate-x-1/3 rounded-full bg-primary blur-3xl" />
        <div className="absolute right-0 bottom-0 h-104 w-104 translate-x-1/3 translate-y-1/3 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal variant="fade-down" duration={700}>
            <div className="text-center mb-12">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <Briefcase className="h-7 w-7" />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-4">
                {t("title")}
              </h3>
              <p className="text-base text-muted-foreground">
                {t("subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Enterprise Contact Form */}
            <ScrollReveal variant="slide-right" delayMs={200} duration={700}>
              <div className="rounded-4xl border border-border/20 bg-card/85 p-8 shadow-xl">
                <h4 className="text-xl font-serif font-medium text-foreground mb-6">
                  {t("formTitle")}
                </h4>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4"
                  >
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
              </div>
            </ScrollReveal>

            {/* Parent / Pour mon jeune Button */}
            <ScrollReveal variant="slide-left" delayMs={400} duration={700}>
              <div className="rounded-4xl border border-border/20 bg-card/85 p-8 shadow-xl flex flex-col items-center justify-center text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <Users className="h-7 w-7" />
                </div>
                <h4 className="text-xl font-serif font-medium text-foreground mb-4">
                  {t("parentTitle")}
                </h4>
                <p className="text-sm text-muted-foreground mb-8">
                  {t("parentDescription")}
                </p>
                <Link href="/appointment?for=loved-one" className="w-full">
                  <Button size="lg" className="w-full">
                    {t("parentButton")}
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
