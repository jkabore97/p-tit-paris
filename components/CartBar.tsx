"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/menu";

export function CartBar() {
  const path = usePathname();
  const { count, total } = useCart();
  if (count === 0 || path.startsWith("/commander") || path.startsWith("/commande/") || path.startsWith("/cuisine")) return null;
  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <Link
        href="/commander"
        className="animate-pop btn-shine flex w-full max-w-md items-center justify-between gap-4 velvet rounded-full px-6 py-3.5 text-white shadow-2xl shadow-wine/40 transition hover:-translate-y-0.5"
      >
        <span className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-candy text-sm font-bold">{count}</span>
          <span className="text-sm font-medium">Voir ma commande</span>
        </span>
        <span className="font-display text-lg font-bold text-honey">{formatPrice(total)}</span>
      </Link>
    </div>
  );
}
