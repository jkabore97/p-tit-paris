import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DishCard } from "@/components/DishCard";
import { ShareButton } from "@/components/ShareButton";
import { allItems, findItem, formatPrice, TAG_LABEL } from "@/lib/menu";

export function generateStaticParams() {
  return allItems().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/menu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) return {};
  return {
    title: item.name,
    description: `${item.desc ?? item.sectionTitle} — ${formatPrice(item.price)} chez P'tit Paris, Ouagadougou.`,
  };
}

export default async function DishPage({ params }: PageProps<"/menu/[slug]">) {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) notFound();

  const siblings = allItems()
    .filter((i) => i.sectionId === item.sectionId && i.slug !== item.slug && i.photo)
    .slice(0, 3);

  return (
    <div className="velvet min-h-screen text-cream">
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-8">
        <Link href={`/menu?book=${item.bookId}#sec-${item.sectionId}`} className="text-xs uppercase tracking-[0.25em] text-gold hover:text-cream">
          ← {item.bookTitle} · {item.sectionTitle}
        </Link>
        <div className="mt-8 grid items-start gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
            {item.photo ? (
              <Image src={item.photo} alt={item.name} fill priority sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-bordeaux-deep font-display text-6xl text-gold/30">P</div>
            )}
          </div>
          <div>
            <div className="flex gap-2">
              {item.tags?.map((t) => (
                <span key={t} className="rounded-full border border-gold/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
                  {TAG_LABEL[t].emoji} {TAG_LABEL[t].label}
                </span>
              ))}
            </div>
            <h1 className="font-display mt-4 text-4xl leading-tight md:text-6xl">{item.name}</h1>
            <p className="font-display mt-4 text-3xl text-gold">{formatPrice(item.price)}</p>
            {item.desc && <p className="mt-6 text-lg leading-relaxed text-cream/80">{item.desc}</p>}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/reserver" className="rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-[0.2em] text-bordeaux-deep hover:bg-cream">
                Réserver une table
              </Link>
              <Link
                href={`/sommelier?q=${encodeURIComponent(`Que boire avec ${item.name} ?`)}`}
                className="rounded-full border border-cream/40 px-6 py-3 text-sm uppercase tracking-[0.2em] hover:bg-cream/10"
              >
                Que boire avec ?
              </Link>
              <ShareButton title={`${item.name} · P'tit Paris`} text={`${item.name} — ${formatPrice(item.price)}`} />
            </div>
          </div>
        </div>

        {siblings.length > 0 && (
          <div className="mt-20">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Dans la même rubrique</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((s) => (
                <DishCard key={s.slug} item={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
