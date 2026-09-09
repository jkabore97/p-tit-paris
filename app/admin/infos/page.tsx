import { SiteEditor } from "@/components/admin/SiteEditor";
import { db } from "@/lib/db";
import { adminPassword } from "@/lib/staff";
import { site } from "@/lib/site";
import type { SiteData } from "@/lib/types";

export default async function InfosPage() {
  const pwd = (await adminPassword())!;
  const data = (await db.admin(pwd, "site")) as SiteData;
  const initial: SiteData = { tagline: site.tagline, socials: site.socials, ...data };
  return <SiteEditor initial={initial} />;
}
