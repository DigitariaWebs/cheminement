"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronDown,
  UserCircle,
  Briefcase,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const locale = useLocale();
  const { data: session, status } = useSession();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/who-we-are", label: t("nav.whoWeAre") },
    { href: "/why-us", label: t("nav.whyUs") },
    { href: "/approaches", label: t("nav.approaches") },
    { href: "/services", label: t("nav.services") },

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

            {status === "loading" ? (
              // Loading state
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
              </div>
            ) : session?.user ? (
              // Authenticated user
              <>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="hidden sm:inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-semibold text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <User className="w-4 h-4" />
                    {session.user.name || session.user.email}
                    <ChevronDown className="w-4 h-4 transition-transform duration-300 data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                      Signed in as {session.user.email}
                    </div>
                    <DropdownMenuSeparator />

                    {/* Role-based dashboard links */}
                    {session.user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <Settings className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {session.user.role === "professional" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/professional/dashboard"
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <Briefcase className="w-4 h-4" />
                          Professional Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {session.user.role === "client" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/client/dashboard"
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <UserCircle className="w-4 h-4" />
                          Client Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-3 cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Unauthenticated user
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center justify-center rounded-md px-5 py-2.5 text-base font-semibold text-primary transition-all duration-300 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t("getStarted")}
                </Link>
              </>
            )}

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
