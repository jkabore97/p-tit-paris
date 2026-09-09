import { MenuEditor } from "@/components/admin/MenuEditor";
import { db } from "@/lib/db";
import type { DbSection } from "@/lib/menu";
import { adminPassword } from "@/lib/staff";

export default async function CartePage({ searchParams }: PageProps<"/admin/carte">) {
  const pwd = (await adminPassword())!;
  const sp = await searchParams;
  const sections = (await db.admin(pwd, "menu")) as DbSection[];
  return <MenuEditor initial={sections} openNew={sp.new === "item"} />;
}
