import type { Metadata, Viewport } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"], display: "swap" });
const sans = Jost({ variable: "--font-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ptitparis.vercel.app"),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description:
    "P'tit Paris, Ouagadougou. Petit-déjeuner, déjeuner, dîner, cocktails et cave. La carte complète, un sommelier IA et la réservation en un geste.",
  openGraph: { type: "website", locale: "fr_FR", siteName: site.name },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#5c0c16" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
