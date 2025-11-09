"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, LogIn, ChevronDown } from "lucide-react";
import { MegaMenu } from "./MegaMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const handleMouseEnter = (menu: string) => {
    if (menu === "services") {
      setIsMegaMenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsMegaMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/20 bg-card/80 backdrop-blur supports-backdrop-filter:bg-card/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Cheminement
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <button
              onMouseEnter={() => handleMouseEnter("services")}
              className={`text-base font-medium transition-colors inline-flex items-center gap-1 ${
                isMegaMenuOpen
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Our Commitments
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isMegaMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <Link
              href="/contact"
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            {/* Login Dropdown */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-base font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <LogIn className="h-4 w-4" />
                  Login
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/login/member">Member</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login/professional">Professional</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login/admin">Admin</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Get Started
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

      {/* Mega Menu */}
      <div onMouseLeave={handleMouseLeave}>
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onMouseEnter={() => handleMouseEnter("services")}
        />
      </div>
    </header>
  );
}
