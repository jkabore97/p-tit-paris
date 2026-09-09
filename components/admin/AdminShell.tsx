"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo, Wordmark } from "@/components/Logo";
import { ToastProvider } from "./ui";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: "◫" },
  { href: "/admin/carte", label: "La carte", icon: "🍽" },
  { href: "/admin/annonces", label: "Annonces & pubs", icon: "📣" },
  { href: "/admin/infos", label: "Infos & réseaux", icon: "📍" },
  { href: "/admin/medias", label: "Photos", icon: "🖼" },
  { href: "/admin/securite", label: "Sécurité", icon: "🔐" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }
  const links = (
    <>
      <ul className="space-y-1">
        {nav.map((n) => {
          const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
          return (
            <li key={n.href}>
              <Link href={n.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${active ? "bg-wine text-white shadow-lg shadow-wine/20" : "text-ink/70 hover:bg-marble hover:text-ink"}`}>
                <span className="w-5 text-center">{n.icon}</span>
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 border-t border-ink/10 pt-4">
        <p className="px-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Raccourcis</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li><Link href="/" target="_blank" className="block rounded-2xl px-4 py-2 text-ink/70 hover:bg-marble">↗ Voir le site</Link></li>
          <li><Link href="/cuisine" target="_blank" className="block rounded-2xl px-4 py-2 text-ink/70 hover:bg-marble">↗ Écran cuisine</Link></li>
          <li><Link href="/cuisine/qr" target="_blank" className="block rounded-2xl px-4 py-2 text-ink/70 hover:bg-marble">↗ QR des tables</Link></li>
          <li><button onClick={logout} className="block w-full rounded-2xl px-4 py-2 text-left text-candy hover:bg-candy-soft">Se déconnecter</button></li>
        </ul>
      </div>
    </>
  );
  return (
    <ToastProvider>
      <div className="min-h-screen bg-marble md:grid md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-ink/10 bg-white p-5 md:sticky md:top-0 md:block md:h-screen md:overflow-y-auto">
          <Link href="/admin" className="mb-8 flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <div>
              <Wordmark className="text-base text-wine" />
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted">Centre de contrôle</p>
            </div>
          </Link>
          {links}
        </aside>
        <div className="md:hidden">
          <div className="flex items-center justify-between bg-white px-4 py-3 shadow">
            <Link href="/admin" className="flex items-center gap-2"><Logo className="h-8 w-8" /><Wordmark className="text-sm text-wine" /></Link>
            <button onClick={() => setOpen((o) => !o)} className="rounded-full bg-marble px-3 py-1.5 text-sm font-semibold">{open ? "Fermer" : "Menu"}</button>
          </div>
          {open && <div className="bg-white p-4 shadow-lg">{links}</div>}
        </div>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
