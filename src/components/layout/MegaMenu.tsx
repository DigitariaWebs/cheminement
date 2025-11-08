"use client";

import Link from "next/link";
import {
  Users,
  Zap,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle,
} from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
}

export function MegaMenu({ isOpen }: MegaMenuProps) {
  return (
    <div
      className={`absolute left-0 right-0 top-full w-full border-b border-border bg-card shadow-lg transition-all duration-300 ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Notre Mission */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-6 uppercase tracking-wide">
              Our Mission
            </h3>
            <div className="space-y-6">
              <Link
                href="/mission/faciliter"
                className="block group hover:bg-accent rounded-lg p-4 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      Facilitate the journey
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Inform and help each person find their path and adequately
                      respond to each client&apos;s needs.
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/mission/efficacite"
                className="block group hover:bg-accent rounded-lg p-4 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      Increase efficiency
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Optimize processes to deliver superior quality mental
                      health services.
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/mission/temps-attente"
                className="block group hover:bg-accent rounded-lg p-4 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      Reduce wait times
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Accelerate access to mental health care for those who need
                      it.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column - Nos Valeurs */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-6 uppercase tracking-wide">
              Our Values
            </h3>
            <div className="space-y-6">
              <Link
                href="/valeurs/eduquer"
                className="block group hover:bg-accent rounded-lg p-4 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      Educate
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Provide educational resources to understand and manage
                      mental health.
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/valeurs/professionnels"
                className="block group hover:bg-accent rounded-lg p-4 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      Highlight professionals
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Recognize and promote the expertise of mental health
                      professionals.
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/valeurs/donnees-probantes"
                className="block group hover:bg-accent rounded-lg p-4 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-primary">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      Promote evidence-based practices
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Use tools and methods based on academic research and
                      validated programs.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
