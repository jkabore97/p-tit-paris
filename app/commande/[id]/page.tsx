import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderTracker } from "@/components/OrderTracker";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Ma commande", robots: { index: false } };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function OrderPage({ params }: PageProps<"/commande/[id]">) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const order = await db.getOrder(id).catch(() => null);
  if (!order) notFound();
  return (
    <div className="marble relative min-h-screen overflow-hidden">
      <div className="blob left-[-10%] top-[-10%] h-[40vw] w-[40vw] bg-mint opacity-40" />
      <div className="blob bottom-[-10%] right-[-10%] h-[40vw] w-[40vw] bg-candy opacity-30" style={{ animationDelay: "-7s" }} />
      <div className="relative mx-auto max-w-2xl px-5 pb-24 pt-8">
        <OrderTracker initial={order} />
      </div>
    </div>
  );
}
