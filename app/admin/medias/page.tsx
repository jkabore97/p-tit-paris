import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { db } from "@/lib/db";
import { adminPassword } from "@/lib/staff";
import type { MediaInfo } from "@/lib/types";

export default async function MediasPage() {
  const pwd = (await adminPassword())!;
  const media = (await db.admin(pwd, "media")) as MediaInfo[];
  return <MediaLibrary initial={media} />;
}
