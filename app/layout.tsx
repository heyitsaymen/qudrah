import type { Metadata } from "next";
import { Bebas_Neue, Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qudrah — L'organisation sportive, enfin pensée pour vous.",
  description:
    "Créez vos séances, planifiez vos semaines, suivez vos progrès — sans PDF, sans captures d'écran, sans friction.",
  keywords: ["musculation", "calisthénie", "coach", "workout", "Algérie"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${bebasNeue.variable} ${barlowCondensed.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
