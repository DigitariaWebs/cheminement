"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, UserCircle, Briefcase } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Who We Are" },
  { href: "/blog", label: "Blog" },
  { href: "/why-us", label: "Why Us" },
  { href: "/pathways", label: "Pathways" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/20 bg-card/80 backdrop-blur supports-backdrop-filter:bg-card/40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img src="/Logo.png" alt="Cheminement" className="h-10 w-auto" />
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
                    ? "text-primary font-semibold underline underline-offset-4 animate-in slide-in-from-bottom-1 duration-300"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden sm:inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-base font-semibold text-primary transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Login
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
                      <div className="font-medium">Member Login</div>
                      <div className="text-xs text-muted-foreground">
                        Access your wellness journey
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
                      <div className="font-medium">Professional Login</div>
                      <div className="text-xs text-muted-foreground">
                        Access your dashboard
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
    </header>
  );
}
