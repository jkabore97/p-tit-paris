"use client";

import { useState } from "react";
import { cart, useCart } from "@/lib/cart";
import type { Post } from "@/lib/types";

export function AddPostButton({ post }: { post: Post }) {
  const { lines } = useCart();
  const [flash, setFlash] = useState(false);
  const key = `post:${post.id}`;
  const q = lines.find((l) => l.key === key)?.qty ?? 0;
  return (
    <button
      onClick={() => {
        cart.add({ key, name: `Plat du jour · ${post.title}`, price: post.price ?? 0, photo: post.image ?? undefined });
        setFlash(true);
        setTimeout(() => setFlash(false), 500);
      }}
      className={`btn-shine rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] transition ${flash ? "animate-pop" : ""} ${q ? "bg-candy text-white shadow-lg shadow-candy/30" : "bg-ink text-white hover:bg-candy"}`}
    >
      {q ? `Ajouté · ${q}` : "Commander"} <span className="ml-1 text-base leading-none">+</span>
    </button>
  );
}
