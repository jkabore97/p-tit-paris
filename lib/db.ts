import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Accès aux commandes (Supabase). La clé « publishable » est publique par conception :
 * les tables sont verrouillées (RLS sans policy) et tout passe par des fonctions SQL
 * SECURITY DEFINER qui valident chaque appel (PIN pour la cuisine, anti-spam côté client).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://uvcibhbslsvakmjcfzwx.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "sb_publishable_-g9D7EaYyyQVrT2HrhYNkw_bYSu_bLz";

const supabase = createClient(url, key, { auth: { persistSession: false } });

export type OrderStatus = "new" | "preparing" | "ready" | "served" | "cancelled";
export type OrderLine = { key: string; slug: string; name: string; qty: number; price: number };
export type Order = {
  id: string;
  code: string;
  table_no: number;
  guest_name: string;
  note: string | null;
  items: OrderLine[];
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

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

const realDb = {
  placeOrder: (table: number, name: string, items: OrderLine[], note?: string) =>
    rpc<Order>("ptp_place_order", { p_table: table, p_name: name, p_items: items, p_note: note ?? null }),
  getOrder: (id: string) => rpc<Order | null>("ptp_get_order", { p_id: id }),
  cancelOrder: (id: string) => rpc<Order | null>("ptp_cancel_order", { p_id: id }),
  verifyPin: (pin: string) => rpc<boolean>("ptp_verify_pin", { p_pin: pin }),
  kitchenOrders: (pin: string) => rpc<Order[]>("ptp_kitchen_orders", { p_pin: pin }),
  setStatus: (pin: string, id: string, status: OrderStatus) =>
    rpc<Order | null>("ptp_set_status", { p_pin: pin, p_id: id, p_status: status }),
  changePin: (pin: string, next: string) => rpc<boolean>("ptp_change_pin", { p_pin: pin, p_new: next }),
};

/** Mode bac à sable : `PTP_MOCK_DB=1 npm run dev` fait tourner les commandes en mémoire, sans Supabase. */
function mockDb(): typeof realDb {
  // Partagé via globalThis : les routes API et les pages sont des bundles distincts.
  const g = globalThis as unknown as { __ptpMock?: { orders: Map<string, Order>; pin: string } };
  g.__ptpMock ??= { orders: new Map<string, Order>(), pin: "240926" };
  const store = g.__ptpMock;
  const orders = store.orders;
  const check = (p: string) => {
    if (p !== store.pin) throw new Error("PIN invalide");
  };
  return {
    async placeOrder(table, name, items, note) {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const order: Order = {
        id,
        code: Math.random().toString(16).slice(2, 6).toUpperCase(),
        table_no: table,
        guest_name: name,
        note: note || null,
        items,
        total: items.reduce((n, l) => n + l.qty * l.price, 0),
        status: "new",
        created_at: now,
        updated_at: now,
      };
      orders.set(id, order);
      return order;
    },
    async getOrder(id) {
      return orders.get(id) ?? null;
    },
    async cancelOrder(id) {
      const o = orders.get(id);
      if (o && o.status === "new") o.status = "cancelled";
      return o ?? null;
    },
    async verifyPin(p) {
      return p === store.pin;
    },
    async kitchenOrders(p) {
      check(p);
      return [...orders.values()].filter((o) => o.status !== "cancelled").sort((a, b) => a.created_at.localeCompare(b.created_at));
    },
    async setStatus(p, id, status) {
      check(p);
      const o = orders.get(id);
      if (o) {
        o.status = status;
        o.updated_at = new Date().toISOString();
      }
      return o ?? null;
    },
    async changePin(p, next) {
      check(p);
      store.pin = next;
      return true;
    },
  };
}

export const db = process.env.PTP_MOCK_DB === "1" ? mockDb() : realDb;

export const STAFF_COOKIE = "ptp_staff";
