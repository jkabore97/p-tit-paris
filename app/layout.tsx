import type { Metadata, Viewport } from "next";
import { Baloo_2, Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CartBar } from "@/components/CartBar";
import { site } from "@/lib/site";

const display = Baloo_2({ variable: "--font-display", subsets: ["latin"], display: "swap" });
const sans = Jost({ variable: "--font-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://p-tit-paris-ten.vercel.app"),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description:
    "P'tit Paris, Ouagadougou. Petit-déjeuner, déjeuner, dîner, pâtisserie, cocktails. Commandez à table en scannant le QR, ou laissez le sommelier IA composer votre menu.",
  openGraph: { type: "website", locale: "fr_FR", siteName: site.name },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#ff4f7f" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartBar />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
