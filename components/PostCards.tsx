import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatPrice } from "@/lib/menu";
import { AddPostButton } from "./AddPostButton";

/** Le plat du jour : grande carte commandable. */
export function PlatDuJourCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  return (
    <article className={`card-hover relative overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_-30px_rgba(92,12,22,.45)] ring-1 ring-ink/5 ${compact ? "md:flex" : "md:grid md:grid-cols-2"}`}>
      {post.image && (
        <div className={`relative ${compact ? "aspect-[16/9] md:aspect-auto md:w-72" : "aspect-[4/3] md:aspect-auto md:min-h-[360px]"}`}>
          <Image src={post.image} alt={post.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
          <span className="absolute left-4 top-4 rounded-full bg-wine px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow">Plat du jour</span>
        </div>
      )}
      <div className={`flex flex-col justify-center ${compact ? "p-6" : "p-8 md:p-10"}`}>
        {!post.image && <span className="mb-3 w-fit rounded-full bg-wine px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">Plat du jour</span>}
        <h3 className={`font-display font-extrabold leading-tight text-ink ${compact ? "text-2xl" : "text-3xl md:text-5xl"}`}>{post.title}</h3>
        {post.body && <p className={`mt-3 text-muted ${compact ? "text-sm" : "text-lg"}`}>{post.body}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-4">
          {post.price != null && <span className="font-display text-3xl font-extrabold text-candy">{formatPrice(post.price)}</span>}
          {post.price != null && <AddPostButton post={post} />}
          {post.link && (
            <Link href={post.link} className="text-sm font-semibold uppercase tracking-[0.15em] text-wine hover:text-candy">
              {post.cta || "En savoir plus"} →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/** Publicité ou mise en avant : image, titre, texte, lien. */
export function AdCard({ post, index = 0 }: { post: Post; index?: number }) {
  const tints = ["from-candy-soft", "from-mint-soft", "from-azure-soft", "from-wood/60"];
  const inner = (
    <>
      {post.image ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image src={post.image} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
        </div>
      ) : (
        <div className={`aspect-[16/10] bg-gradient-to-br ${tints[index % tints.length]} to-white`} />
      )}
      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">Sponsorisé</p>
        <h3 className="font-display mt-1 text-xl font-bold leading-tight text-ink group-hover:text-candy">{post.title}</h3>
        {post.body && <p className="mt-1.5 line-clamp-2 text-sm text-muted">{post.body}</p>}
        {post.link && <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-wine">{post.cta || "Découvrir"} →</span>}
      </div>
    </>
  );
  const cls = "card-hover group block overflow-hidden rounded-[1.75rem] bg-white shadow-lg ring-1 ring-ink/5";
  return post.link ? (
    <Link href={post.link} target={post.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls}>{inner}</Link>
  ) : (
    <article className={cls}>{inner}</article>
  );
}

/** Rangée de partenaires : logo + nom. */
export function PartnersRow({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {posts.map((p) => {
        const inner = (
          <span className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:shadow-lg">
            {p.image && (
              <span className="relative h-9 w-9 overflow-hidden rounded-full bg-marble">
                <Image src={p.image} alt="" fill sizes="36px" className="object-cover" />
              </span>
            )}
            <span className="text-sm font-semibold text-ink">{p.title}</span>
          </span>
        );
        return p.link ? (
          <Link key={p.id} href={p.link} target="_blank" rel="noreferrer">{inner}</Link>
        ) : (
          <span key={p.id}>{inner}</span>
        );
      })}
    </div>
  );
}
