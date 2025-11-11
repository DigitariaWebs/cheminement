"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, UserCircle, Briefcase } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const locale = useLocale();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.whoWeAre") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/why-us", label: t("nav.whyUs") },
    { href: "/pathways", label: t("nav.pathways") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/20 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              tabIndex={-1}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Image
                width={256}
                height={256}
                src="/Logo.png"
                alt="Je Chemine"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-semibold transition-all duration-300 ease-in-out ${
                  pathname === link.href
                    ? "text-primary font-semibold underline underline-offset-4"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <LocaleSwitcher currentLocale={locale} />
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="hidden sm:inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-base font-semibold text-primary transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {t("login")}
                <ChevronDown className="w-4 h-4 transition-transform duration-300 data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link
                    href="/login/member"
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <UserCircle className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">{t("memberLogin")}</div>
                      <div className="text-xs text-muted-foreground">
                        {t("memberLoginDesc")}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/login/professional"
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Briefcase className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">
                        {t("professionalLogin")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t("professionalLoginDesc")}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/signup"
              className="hidden sm:inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("getStarted")}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
