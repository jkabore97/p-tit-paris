import Link from "next/link";
import { Logo, Wordmark } from "./Logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative mt-10">
      <div className="sunrise-bg px-5 py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/80">À table ?</p>
            <p className="font-display text-3xl font-bold leading-tight md:text-4xl">Scannez le QR de votre table, commandez, on arrive.</p>
          </div>
          <Link href="/commander" className="btn-shine rounded-full bg-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-candy shadow-xl transition hover:-translate-y-0.5">
            Commander maintenant
          </Link>
        </div>
      </div>
      <div className="velvet text-white/85">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-11 w-11" variant="pink" />
              <div>
                <p className="text-white"><Wordmark className="text-xl" /></p>
                <p className="text-xs uppercase tracking-[0.25em] text-honey">{site.tagline}</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              {site.neighbourhood}, {site.city}. Petit-déjeuner dès 6h30, déjeuner et dîner, pâtisserie, cocktails et cave jusque tard.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-honey">Explorer</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link className="hover:text-honey" href="/menu">La carte complète</Link></li>
              <li><Link className="hover:text-honey" href="/commander">Commander à table</Link></li>
              <li><Link className="hover:text-honey" href="/sommelier">Le sommelier IA</Link></li>
              <li><Link className="hover:text-honey" href="/reserver">Réserver une table</Link></li>
              <li><Link className="hover:text-honey" href="/cuisine">Espace équipe</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-honey">Suivez-nous</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {site.socials.map((s, i) => (
                <li key={s.label}>
                  <a
                    className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 ${["bg-candy-soft text-candy", "bg-mint-soft text-sage", "bg-azure-soft text-sky-700", "bg-wood/60 text-cocoa"][i % 4]}`}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {site.name} · Prix en francs CFA · Carte susceptible de changer
        </div>
      </div>
    </footer>
  );
}
