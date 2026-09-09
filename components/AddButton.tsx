"use client";

import { useState } from "react";
import { cart, useCart } from "@/lib/cart";
import { formatPrice, type FlatItem } from "@/lib/menu";

/** Bouton « Ajouter » ; pour les prix doubles (moyenne / grande, verre / bouteille) propose les deux tailles. */
export function AddButton({ item, dual, size = "sm" }: { item: FlatItem; dual?: string; size?: "sm" | "lg" }) {
  const { lines } = useCart();
  const [flash, setFlash] = useState<string | null>(null);
  const labels = (dual ?? "Moyenne / Grande").split("/").map((s) => s.trim());
  const qtyOf = (key: string) => lines.find((l) => l.key === key)?.qty ?? 0;

  function add(key: string, name: string, price: number) {
    cart.add({ key, name, price, photo: item.photo });
    setFlash(key);
    setTimeout(() => setFlash(null), 500);
  }

  if (item.available === false) {
    return <span className={`inline-block rounded-full bg-marble px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted ${size === "lg" ? "px-6 py-3 text-sm" : ""}`}>Épuisé</span>;
  }

  const base =
    size === "lg"
      ? "rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em]"
      : "rounded-full px-3.5 py-1.5 text-xs font-semibold";

  if (Array.isArray(item.price)) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {item.price.map((p, i) => {
          const key = `${item.slug}:${i}`;
          const q = qtyOf(key);
          return (
            <button
              key={key}
              onClick={(e) => {
                e.preventDefault();
                add(key, `${item.name} (${labels[i] ?? ""})`, p);
              }}
              className={`${base} btn-shine border transition ${flash === key ? "animate-pop" : ""} ${q ? "border-candy bg-candy text-white" : "border-ink/15 bg-white text-ink hover:border-candy hover:text-candy"}`}
            >
              {labels[i]} · {formatPrice(p)}
              {q > 0 && <span className="ml-1.5 rounded-full bg-white/25 px-1.5">{q}</span>}
            </button>
          );
        })}
      </div>
    );
  }
  const key = item.slug;
  const q = qtyOf(key);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        add(key, item.name, item.price as number);
      }}
      className={`${base} btn-shine transition ${flash === key ? "animate-pop" : ""} ${q ? "bg-candy text-white shadow-lg shadow-candy/30" : "bg-ink text-white hover:bg-candy"}`}
    >
      {q ? `Ajouté · ${q}` : size === "lg" ? "Ajouter à ma commande" : "Ajouter"}
      <span className="ml-1.5 text-base leading-none">+</span>
    </button>
  );
}
