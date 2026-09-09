import Link from "next/link";
import { db } from "@/lib/db";
import { adminPassword } from "@/lib/staff";
import { formatPrice } from "@/lib/menu";
import type { Post, Stats } from "@/lib/types";
import { POST_KIND_LABEL } from "@/lib/types";

export default async function AdminHome() {
  const pwd = (await adminPassword())!;
  const [stats, posts] = await Promise.all([
    db.admin(pwd, "stats") as Promise<Stats>,
    db.admin(pwd, "posts") as Promise<Post[]>,
  ]);
  const active = posts.filter((p) => p.active);
  const tiles = [
    { label: "Commandes aujourd'hui", value: String(stats.today_orders), tint: "bg-candy-soft" },
    { label: "Encaissé (servies)", value: formatPrice(stats.today_total), tint: "bg-mint-soft" },
    { label: "En cours en cuisine", value: String(stats.open_orders), tint: "bg-wood/60" },
    { label: "Sur 7 jours", value: String(stats.week_orders), tint: "bg-azure-soft" },
  ];
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-ink md:text-4xl">Bonjour 👋</h1>
        <p className="mt-1 text-sm text-muted">Voici où en est P&apos;tit Paris aujourd&apos;hui.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t, i) => (
          <div key={t.label} className={`animate-rise rounded-[1.75rem] ${t.tint} p-5`} style={{ animationDelay: `${i * 70}ms` }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/60">{t.label}</p>
            <p className="font-display mt-2 text-3xl font-extrabold text-ink">{t.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.75rem] bg-white p-5 shadow ring-1 ring-ink/5 lg:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Actions rapides</p>
          <div className="mt-3 grid gap-2">
            <Link href="/admin/carte?new=item" className="btn-shine rounded-2xl bg-wine px-4 py-3 text-sm font-semibold text-white hover:bg-candy">+ Ajouter un plat</Link>
            <Link href="/admin/annonces?new=plat_du_jour" className="rounded-2xl bg-honey/30 px-4 py-3 text-sm font-semibold text-ink hover:bg-honey/50">☀️ Plat du jour</Link>
            <Link href="/admin/annonces?new=annonce" className="rounded-2xl bg-marble px-4 py-3 text-sm font-semibold text-ink hover:bg-wood/60">📣 Nouvelle annonce</Link>
            <Link href="/cuisine" target="_blank" className="rounded-2xl bg-marble px-4 py-3 text-sm font-semibold text-ink hover:bg-wood/60">👩‍🍳 Ouvrir la cuisine</Link>
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-white p-5 shadow ring-1 ring-ink/5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Top 5 sur 30 jours</p>
          {stats.top.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Pas encore de commandes.</p>
          ) : (
            <ol className="mt-3 space-y-2">
              {stats.top.map((t, i) => (
                <li key={t.name} className="flex items-center gap-3 text-sm">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-candy-soft font-bold text-candy">{i + 1}</span>
                  <span className="flex-1 truncate font-medium text-ink">{t.name}</span>
                  <span className="text-muted">× {t.qty}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="rounded-[1.75rem] bg-white p-5 shadow ring-1 ring-ink/5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">En ligne maintenant</p>
            <Link href="/admin/annonces" className="text-xs font-semibold text-wine hover:text-candy">Gérer →</Link>
          </div>
          {active.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Aucune annonce active. Un plat du jour ferait un bon début.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {active.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center gap-2 text-sm">
                  <span className="rounded-full bg-marble px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{POST_KIND_LABEL[p.kind]}</span>
                  <span className="truncate font-medium text-ink">{p.title}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-muted">{stats.sections} rubriques · {stats.items} plats · {stats.posts} annonces actives</p>
        </div>
      </div>
    </div>
  );
}
