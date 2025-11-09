import type { Metadata } from "next";
import "./globals.css";
import { Petrona } from "next/font/google";

const petrona = Petrona({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Je Chemine - Integrated Health Platform",
  description: "Your journey to better health and wellness with our comprehensive platform featuring mental health support, primary care, and employee assistance programs.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${petrona.className} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
