import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-linear-to-br from-background via-muted to-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5"></div>

      {/* Logo/Brand - Top Left */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-4xl font-semibold text-primary hover:text-primary/80 transition-colors z-20"
      >
        Je Chemine
      </Link>

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}
