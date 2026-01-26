"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("Footer");

  return (
    <footer className="w-full bg-primary text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Image
                width={256}
                height={256}
                src="/Logo.png"
                alt="Je Chemine"
                className="w-full"
              />
            </Link>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t("platform")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t("careers")}
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t("press")}
                </Link>
              </li>
              <li>
                <Link
                  href="/ios"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t("ios")}
                </Link>
              </li>
              <li>
                <Link
                  href="/android"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t("android")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t("contactUs")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex items-center justify-center text-sm text-white/70">
            <span>{t("copyright", { year: currentYear })}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
