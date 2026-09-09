import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminPassword } from "@/lib/staff";

export const metadata: Metadata = { title: "Centre de contrôle", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pwd = await adminPassword();
  if (!pwd) return <AdminLogin />;
  return <AdminShell>{children}</AdminShell>;
}
