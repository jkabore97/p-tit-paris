import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { DbSection } from "./menu";
import { seedSections, slugify } from "./menu";
import type { MediaInfo, Order, OrderLine, OrderStatus, Post, SiteData, Stats } from "./types";

export type { Order, OrderLine, OrderStatus, Post, SiteData };

/**
 * Accès aux données (Supabase). La clé « publishable » est publique par conception :
 * les tables sont verrouillées (RLS sans policy) et tout passe par des fonctions SQL
 * SECURITY DEFINER qui valident chaque appel (PIN cuisine, mot de passe admin, anti-spam).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://uvcibhbslsvakmjcfzwx.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "sb_publishable_-g9D7EaYyyQVrT2HrhYNkw_bYSu_bLz";

const supabase = createClient(url, key, { auth: { persistSession: false } });

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "Reçue",
  preparing: "En cuisine",
  ready: "Prête",
  served: "Servie",
  cancelled: "Annulée",
};

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(error.message);
  return data as T;
}

export type AdminOp =
  | "menu" | "section_upsert" | "section_delete" | "item_upsert" | "item_delete" | "item_toggle"
  | "reorder_sections" | "reorder_items" | "posts" | "post_upsert" | "post_delete"
  | "site" | "site_set" | "media" | "media_delete" | "set_password" | "set_staff_pin" | "stats";

const realDb = {
  // Commandes
  placeOrder: (table: number, name: string, items: OrderLine[], note?: string) =>
    rpc<Order>("ptp_place_order", { p_table: table, p_name: name, p_items: items, p_note: note ?? null }),
  getOrder: (id: string) => rpc<Order | null>("ptp_get_order", { p_id: id }),
  cancelOrder: (id: string) => rpc<Order | null>("ptp_cancel_order", { p_id: id }),
  verifyPin: (pin: string) => rpc<boolean>("ptp_verify_pin", { p_pin: pin }),
  kitchenOrders: (pin: string) => rpc<Order[]>("ptp_kitchen_orders", { p_pin: pin }),
  setStatus: (pin: string, id: string, status: OrderStatus) => rpc<Order | null>("ptp_set_status", { p_pin: pin, p_id: id, p_status: status }),
  changePin: (pin: string, next: string) => rpc<boolean>("ptp_change_pin", { p_pin: pin, p_new: next }),
  // Contenu public
  menu: () => rpc<DbSection[]>("ptp_menu", {}),
  posts: () => rpc<Post[]>("ptp_posts", {}),
  site: () => rpc<SiteData | null>("ptp_site", {}).then((d) => d ?? {}),
  mediaGet: (id: string) => rpc<{ mime: string; name: string; data: string } | null>("ptp_media_get", { p_id: id }),
  // Administration
  adminVerify: (pwd: string) => rpc<boolean>("ptp_admin_verify", { p_pwd: pwd }),
  admin: (pwd: string, op: AdminOp, payload: Record<string, unknown> = {}) => rpc<unknown>("ptp_admin", { p_pwd: pwd, p_op: op, p: payload }),
  adminMediaPut: (pwd: string, name: string, mime: string, b64: string) =>
    rpc<string>("ptp_admin_media_put", { p_pwd: pwd, p_name: name, p_mime: mime, p_b64: b64 }),
};

/* ------------------------------------------------------------------ */
/* Mode bac à sable : `PTP_MOCK_DB=1 npm run dev`, tout en mémoire.     */
/* ------------------------------------------------------------------ */

type MockStore = {
  orders: Map<string, Order>;
  pin: string;
  admin: string;
  sections: DbSection[];
  posts: Post[];
  site: SiteData;
  media: Map<string, { name: string; mime: string; data: string; size: number; created_at: string }>;
};

function mockDb(): typeof realDb {
  // Partagé via globalThis : les routes API et les pages sont des bundles distincts.
  const g = globalThis as unknown as { __ptpMock?: MockStore };
  g.__ptpMock ??= { orders: new Map(), pin: "240926", admin: "paris2026", sections: seedSections(), posts: [], site: {}, media: new Map() };
  const s = g.__ptpMock;
  const checkPin = (p: string) => {
    if (p !== s.pin) throw new Error("PIN invalide");
  };
  const checkAdmin = (p: string) => {
    if (p !== s.admin) throw new Error("Accès refusé");
  };
  const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
  const activePosts = () => {
    const today = new Date().toISOString().slice(0, 10);
    return s.posts.filter((p) => p.active && (!p.starts_at || p.starts_at <= today) && (!p.ends_at || p.ends_at >= today));
  };
  const str = (v: unknown) => (v == null || v === "" ? null : String(v));
  const num = (v: unknown) => (v == null || v === "" ? null : Number(v));

  return {
    async placeOrder(table, name, items, note) {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const order: Order = {
        id, code: Math.random().toString(16).slice(2, 6).toUpperCase(), table_no: table, guest_name: name, note: note || null, items,
        total: items.reduce((n, l) => n + l.qty * l.price, 0), status: "new", created_at: now, updated_at: now,
      };
      s.orders.set(id, order);
      return order;
    },
    async getOrder(id) { return s.orders.get(id) ?? null; },
    async cancelOrder(id) {
      const o = s.orders.get(id);
      if (o && o.status === "new") o.status = "cancelled";
      return o ?? null;
    },
    async verifyPin(p) { return p === s.pin; },
    async kitchenOrders(p) {
      checkPin(p);
      return [...s.orders.values()].filter((o) => o.status !== "cancelled").sort((a, b) => a.created_at.localeCompare(b.created_at));
    },
    async setStatus(p, id, status) {
      checkPin(p);
      const o = s.orders.get(id);
      if (o) { o.status = status; o.updated_at = new Date().toISOString(); }
      return o ?? null;
    },
    async changePin(p, next) { checkPin(p); s.pin = next; return true; },
    async menu() { return clone(s.sections); },
    async posts() { return clone(activePosts()); },
    async site() { return clone(s.site); },
    async mediaGet(id) { return s.media.get(id) ?? null; },
    async adminVerify(p) { return p === s.admin; },
    async adminMediaPut(p, name, mime, b64) {
      checkAdmin(p);
      const id = crypto.randomUUID();
      s.media.set(id, { name, mime, data: b64, size: Math.round((b64.length * 3) / 4), created_at: new Date().toISOString() });
      return id;
    },
    async admin(p, op, payload = {}) {
      checkAdmin(p);
      const P = payload as Record<string, unknown>;
      const findSec = (id: unknown) => s.sections.find((x) => x.id === id);
      switch (op) {
        case "menu": return clone(s.sections);
        case "section_upsert": {
          const id = String(P.id || slugify(String(P.title)));
          let sec = findSec(id);
          if (!sec) { sec = { id, books: [], title: "", tagline: null, note: null, dual: null, gallery: [], position: s.sections.length, visible: true, items: [] }; s.sections.push(sec); }
          Object.assign(sec, { books: (P.books as DbSection["books"]) ?? ["diner"], title: String(P.title), tagline: str(P.tagline), note: str(P.note), dual: str(P.dual), visible: P.visible ?? true });
          return { id };
        }
        case "section_delete": s.sections = s.sections.filter((x) => x.id !== P.id); return { ok: true };
        case "item_upsert": {
          const id = str(P.id);
          const all = s.sections.flatMap((x) => x.items);
          let item = id ? all.find((i) => i.id === id) : undefined;
          if (!item) {
            const sec = findSec(P.section_id);
            if (!sec) throw new Error("Rubrique inconnue");
            let slug = slugify(String(P.name)); let n = 2; const base = slug;
            while (all.some((i) => i.slug === slug)) slug = `${base}-${n++}`;
            item = { id: crypto.randomUUID(), slug, name: "", description: null, price: 0, price2: null, tags: [], photo: null, position: sec.items.length, available: true, visible: true };
            sec.items.push(item);
          } else if (P.section_id && !findSec(P.section_id)?.items.includes(item)) {
            for (const sec of s.sections) sec.items = sec.items.filter((i) => i !== item);
            findSec(P.section_id)!.items.push(item);
          }
          Object.assign(item, { name: String(P.name ?? item.name), description: str(P.description), price: Number(P.price ?? item.price), price2: num(P.price2), tags: (P.tags as string[]) ?? [], photo: str(P.photo), available: P.available ?? item.available, visible: P.visible ?? item.visible });
          return { id: item.id, slug: item.slug };
        }
        case "item_delete": for (const sec of s.sections) sec.items = sec.items.filter((i) => i.id !== P.id); return { ok: true };
        case "item_toggle": {
          const item = s.sections.flatMap((x) => x.items).find((i) => i.id === P.id);
          if (item) { if (P.available != null) item.available = Boolean(P.available); if (P.visible != null) item.visible = Boolean(P.visible); }
          return { ok: true };
        }
        case "reorder_sections": (P.ids as string[]).forEach((id, i) => { const sec = findSec(id); if (sec) sec.position = i; }); s.sections.sort((a, b) => a.position - b.position); return { ok: true };
        case "reorder_items": { const ids = P.ids as string[]; for (const sec of s.sections) { sec.items.forEach((it) => { const i = ids.indexOf(it.id); if (i >= 0) it.position = i; }); sec.items.sort((a, b) => a.position - b.position); } return { ok: true }; }
        case "posts": return clone(s.posts);
        case "post_upsert": {
          const id = str(P.id);
          let post = id ? s.posts.find((x) => x.id === id) : undefined;
          if (!post) { post = { id: crypto.randomUUID(), kind: "annonce", title: "", body: null, image: null, link: null, cta: null, price: null, starts_at: null, ends_at: null, active: true, position: s.posts.length, created_at: new Date().toISOString() }; s.posts.push(post); }
          Object.assign(post, { kind: (P.kind as Post["kind"]) ?? post.kind, title: String(P.title ?? post.title), body: str(P.body), image: str(P.image), link: str(P.link), cta: str(P.cta), price: num(P.price), starts_at: str(P.starts_at), ends_at: str(P.ends_at), active: P.active ?? post.active });
          return { id: post.id };
        }
        case "post_delete": s.posts = s.posts.filter((x) => x.id !== P.id); return { ok: true };
        case "site": return clone(s.site);
        case "site_set": s.site = clone(P as SiteData); return { ok: true };
        case "media": return [...s.media.entries()].map(([id, m]) => ({ id, name: m.name, mime: m.mime, size: m.size, created_at: m.created_at }) as MediaInfo);
        case "media_delete": s.media.delete(String(P.id)); return { ok: true };
        case "set_password": if (String(P.next).length < 6) throw new Error("Mot de passe : 6 caractères minimum"); s.admin = String(P.next); return { ok: true };
        case "set_staff_pin": if (!/^[0-9]{4,8}$/.test(String(P.next))) throw new Error("Le PIN doit contenir 4 à 8 chiffres"); s.pin = String(P.next); return { ok: true };
        case "stats": {
          const orders = [...s.orders.values()];
          const today = new Date().toISOString().slice(0, 10);
          const top = new Map<string, number>();
          for (const o of orders) if (o.status !== "cancelled") for (const l of o.items) top.set(l.name, (top.get(l.name) ?? 0) + l.qty);
          const stats: Stats = {
            today_orders: orders.filter((o) => o.created_at.startsWith(today) && o.status !== "cancelled").length,
            today_total: orders.filter((o) => o.created_at.startsWith(today) && o.status === "served").reduce((n, o) => n + o.total, 0),
            open_orders: orders.filter((o) => ["new", "preparing", "ready"].includes(o.status)).length,
            week_orders: orders.filter((o) => o.status !== "cancelled").length,
            items: s.sections.reduce((n, x) => n + x.items.length, 0), sections: s.sections.length, posts: s.posts.filter((p) => p.active).length,
            top: [...top.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty })),
          };
          return stats;
        }
      }
      throw new Error(`Opération inconnue : ${op}`);
    },
  };
}

export const db = process.env.PTP_MOCK_DB === "1" ? mockDb() : realDb;

export const STAFF_COOKIE = "ptp_staff";
export const ADMIN_COOKIE = "ptp_admin";
