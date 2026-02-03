"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SchoolManagerPage() {
  const t = useTranslations("SchoolManagerForm");

  return (
    <main className="bg-background">
      <section className="container mx-auto max-w-3xl px-6 py-24">
        <div className="rounded-4xl border border-border/20 bg-card/80 p-10 shadow-xl backdrop-blur">
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
              {t("badge")}
            </p>
            <h1 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
              {t("title")}
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <form className="mt-10 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("fields.name")}</Label>
              <Input id="name" placeholder={t("placeholders.name")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">{t("fields.school")}</Label>
              <Input id="school" placeholder={t("placeholders.school")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="function">{t("fields.function")}</Label>
              <Input id="function" placeholder={t("placeholders.function")} />
            </div>

            <div className="space-y-2">
              <Label>{t("fields.serviceType")}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t("placeholders.serviceType")} />
                </SelectTrigger>
                <SelectContent>
                  {t.raw("serviceTypes").map((type: string) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              {t("submit")}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
