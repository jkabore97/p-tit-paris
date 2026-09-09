import { PostsEditor } from "@/components/admin/PostsEditor";
import { db } from "@/lib/db";
import { adminPassword } from "@/lib/staff";
import type { Post, PostKind } from "@/lib/types";

export default async function AnnoncesPage({ searchParams }: PageProps<"/admin/annonces">) {
  const pwd = (await adminPassword())!;
  const sp = await searchParams;
  const posts = (await db.admin(pwd, "posts")) as Post[];
  const kinds: PostKind[] = ["plat_du_jour", "annonce", "partenaire", "pub"];
  const openNew = typeof sp.new === "string" && kinds.includes(sp.new as PostKind) ? (sp.new as PostKind) : null;
  return <PostsEditor initial={posts} openNew={openNew} />;
}
