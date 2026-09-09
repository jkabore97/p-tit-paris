import type { Metadata } from "next";
import { KitchenBoard } from "@/components/KitchenBoard";
import { PinGate } from "@/components/PinGate";
import { staffPin } from "@/lib/staff";

export const metadata: Metadata = { title: "Cuisine", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  const pin = await staffPin();
  if (!pin) return <PinGate />;
  return <KitchenBoard />;
}
