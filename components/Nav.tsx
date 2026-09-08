"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { site } from "@/lib/site";

const links = [
  { href: "/menu", label: "La carte" },
  { href: "/sommelier", label: "Sommelier IA" },
  { href: "/reserver", label: "Réserver" },
] as const;

export function Nav() {
  const path = usePathname();
  const isHome = path === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled || open || !isHome
          ? "bg-bordeaux-deep/95 backdrop-blur-md shadow-[0_10px_40px_-20px_rgba(0,0,0,.8)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-3 text-gold">
          <Logo className="h-9 w-9 text-bordeaux-soft" />
          <span className="font-display text-xl tracking-wide text-cream">{site.name}</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm uppercase tracking-[0.2em] transition-colors ${
                path.startsWith(l.href) ? "text-gold" : "text-cream/80 hover:text-cream"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/reserver"
            className="rounded-full border border-gold/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold transition hover:bg-gold hover:text-bordeaux-deep"
          >
            Une table
          </Link>
        </nav>
        <button
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-0.5 w-6 bg-cream transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-cream transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-cream transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>
      {open && (
        <nav className="border-t border-cream/10 px-5 pb-6 pt-2 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 font-display text-2xl text-cream">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
