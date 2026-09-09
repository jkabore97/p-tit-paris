"use client";

import { useSyncExternalStore } from "react";

export type CartLine = { key: string; name: string; price: number; qty: number; photo?: string };
type CartState = { lines: CartLine[]; table: number | null; name: string };

const KEY = "ptp-cart-v1";
const empty: CartState = { lines: [], table: null, name: "" };
let state: CartState = empty;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...empty, ...(JSON.parse(raw) as Partial<CartState>) };
  } catch {
    state = empty;
  }
}
function commit(next: CartState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* stockage indisponible */
  }
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot() {
  load();
  return state;
}
function getServerSnapshot() {
  return empty;
}

export function useCart() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = s.lines.reduce((n, l) => n + l.qty, 0);
  const total = s.lines.reduce((n, l) => n + l.qty * l.price, 0);
  return { ...s, count, total };
}

export const cart = {
  add(line: Omit<CartLine, "qty">, qty = 1) {
    load();
    const lines = [...state.lines];
    const i = lines.findIndex((l) => l.key === line.key);
    if (i >= 0) lines[i] = { ...lines[i], qty: Math.min(20, lines[i].qty + qty) };
    else lines.push({ ...line, qty });
    commit({ ...state, lines });
  },
  setQty(key: string, qty: number) {
    load();
    const lines = state.lines.map((l) => (l.key === key ? { ...l, qty } : l)).filter((l) => l.qty > 0);
    commit({ ...state, lines });
  },
  clear() {
    load();
    commit({ ...state, lines: [] });
  },
  setTable(table: number | null) {
    load();
    commit({ ...state, table });
  },
  setName(name: string) {
    load();
    commit({ ...state, name });
  },
};
