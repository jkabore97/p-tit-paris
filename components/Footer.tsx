import Link from "next/link";
import { Logo } from "./Logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="velvet text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10 text-gold" stroke="var(--bordeaux-deep)" />
            <div>
              <p className="font-display text-2xl text-cream">{site.name}</p>
              <p className="text-xs uppercase tracking-[0.25em] text-gold">{site.tagline}</p>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            {site.neighbourhood}, {site.city}. Petit-déjeuner dès 6h30, déjeuner et dîner, cocktails et cave jusque tard.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Explorer</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-cream" href="/menu">La carte complète</Link></li>
            <li><Link className="hover:text-cream" href="/menu?book=dej">P&apos;tit Déjeuner</Link></li>
            <li><Link className="hover:text-cream" href="/menu?book=bar">Bar &amp; Cave</Link></li>
            <li><Link className="hover:text-cream" href="/sommelier">Le sommelier IA</Link></li>
            <li><Link className="hover:text-cream" href="/reserver">Réserver une table</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Suivez-nous</p>
          <ul className="mt-4 space-y-2 text-sm">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a className="hover:text-cream" href={s.href} target="_blank" rel="noreferrer">
                  {s.label} · <span className="text-cream/60">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {site.name} · Prix en francs CFA · Carte susceptible de changer
      </div>
    </footer>
  );
}
