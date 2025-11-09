import Link from "next/link";
import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img src="/Logo.png" alt="Je Chemine" className="h-16 w-auto" />
            </Link>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-6">
              Partners
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/partner"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Partner with us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="/culture"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Culture, care and community
                </Link>
              </li>
              <li>
                <Link
                  href="/brand"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Brand guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-6">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/platform"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Integrated Health Platform
                </Link>
              </li>
              <li>
                <Link
                  href="/eap"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Employee Assistance Program (EAP)
                </Link>
              </li>
              <li>
                <Link
                  href="/mental-health"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Mental Health+
                </Link>
              </li>
              <li>
                <Link
                  href="/primary-care"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Primary Care Wellness
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  EAP cost savings calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-6">Contact</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/ios"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Je Chemine for iOS
                </Link>
              </li>
              <li>
                <Link
                  href="/android"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Je Chemine for Android
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Help Centre
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Status
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
              <span>Je Chemine © {currentYear}</span>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Use
              </Link>
              <Link href="/aoda" className="hover:text-white transition-colors">
                AODA
              </Link>
              <Link
                href="/cookie-policy"
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href="/rights"
                className="hover:text-white transition-colors"
              >
                Rights and Responsibilities
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
