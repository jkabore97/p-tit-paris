import Link from "next/link";
import type { Post } from "@/lib/types";
import { Marquee } from "./Marquee";

/** Bandeau d'annonces sous la navigation (kind = annonce, actives aujourd'hui). */
export function AnnouncementBar({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  const items = posts.map((p) => {
    const text = (
      <span className="mx-8 inline-flex items-center gap-3 whitespace-nowrap text-sm font-medium">
        <span className="text-honey">📣</span>
        <span className="font-semibold">{p.title}</span>
        {p.body && <span className="text-white/75">— {p.body}</span>}
        {p.link && <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs uppercase tracking-[0.15em]">{p.cta || "En savoir plus"} →</span>}
        <span className="text-white/30">✦</span>
      </span>
    );
    return p.link ? (
      <Link key={p.id} href={p.link} className="hover:text-honey">{text}</Link>
    ) : (
      <span key={p.id}>{text}</span>
    );
  });
  return (
    <div className="velvet text-white">
      <Marquee speed={posts.length > 1 ? 35 : 25} className="py-2">{items}</Marquee>
    </div>
  );
}
