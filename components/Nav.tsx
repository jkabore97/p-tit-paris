"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, Wordmark } from "./Logo";
import { site } from "@/lib/site";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/menu", label: "La carte" },
  { href: "/commander", label: "Commander" },
  { href: "/sommelier", label: "Sommelier IA" },
  { href: "/reserver", label: "Réserver" },
] as const;

export function Nav() {
  const path = usePathname();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (path.startsWith("/cuisine")) return null;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled || open ? "glass shadow-[0_10px_40px_-24px_rgba(74,44,28,.5)]" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-10 w-10 transition-transform duration-500 hover:rotate-12" />
          <Wordmark className="text-xl text-wine" />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-sm font-medium uppercase tracking-[0.18em] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-wine after:transition-all ${
                path.startsWith(l.href) ? "text-wine after:w-full" : "text-ink/70 after:w-0 hover:text-wine hover:after:w-full"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/commander"
            className="btn-shine relative rounded-full bg-wine px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-wine/30 transition hover:-translate-y-0.5 hover:bg-candy"
          >
            Ma commande
            {count > 0 && (
              <span key={count} className="animate-wiggle absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-honey px-1 text-[11px] font-bold text-ink">
                {count}
              </span>
            )}
          </Link>
        </nav>
        <button aria-label="Menu" onClick={() => setOpen((o) => !o)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden">
          <span className={`h-0.5 w-6 rounded bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 rounded bg-ink transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 rounded bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>
      {open && (
        <nav className="border-t border-ink/10 px-5 pb-6 pt-2 md:hidden">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="animate-rise block py-3 font-display text-3xl font-bold text-ink" style={{ animationDelay: `${i * 60}ms` }}>
              {l.label}
              {l.href === "/commander" && count > 0 && <span className="ml-3 rounded-full bg-honey px-2 py-0.5 text-sm">{count}</span>}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
