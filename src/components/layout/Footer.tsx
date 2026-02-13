"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("Footer");
  const tNav = useTranslations("Header.nav");

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                width={256}
                height={256}
                src="/Logo.png"
                alt="Je Chemine"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              {t("culture")}
            </p>
          </div>

          {/* Plateforme */}
          <div>
            <h4 className="font-bold text-primary-foreground mb-6 text-sm uppercase tracking-wide">
              {t("platform")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/who-we-are" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {tNav("whoWeAre")}
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {tNav("whyUs")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {tNav("services")}
                </Link>
              </li>
              <li>
                <Link href="/approaches" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {tNav("approaches")}
                </Link>
              </li>
              <li>
                <Link href="/professional" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {tNav("professional")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Aide */}
          <div>
            <h4 className="font-bold text-primary-foreground mb-6 text-sm uppercase tracking-wide">
              {t("contact")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t("helpCentre")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Suivez-nous */}
          <div>
            <h4 className="font-bold text-primary-foreground mb-6 text-sm uppercase tracking-wide">
              {t("partners")}
            </h4>
            <div className="flex gap-3">
              <Link
                href="https://instagram.com/jechemine"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground/70 hover:border-primary-foreground hover:text-primary-foreground transition-all"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="https://linkedin.com/company/jechemine"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground/70 hover:border-primary-foreground hover:text-primary-foreground transition-all"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/50 font-semibold uppercase tracking-widest">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex gap-6 text-xs text-primary-foreground/50 font-semibold">
            <Link href="/contact" className="hover:text-primary-foreground transition-colors uppercase">
              {t("privacyPolicy")}
            </Link>
            <Link href="/contact" className="hover:text-primary-foreground transition-colors uppercase">
              {t("termsOfUse")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
