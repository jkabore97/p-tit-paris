import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddButton } from "@/components/AddButton";
import { Logo } from "@/components/Logo";
import { DishCard } from "@/components/DishCard";
import { Reveal } from "@/components/Reveal";
import { ShareButton } from "@/components/ShareButton";
import { allItems, books, findItem, formatPrice, TAG_LABEL } from "@/lib/menu";

export function generateStaticParams() {
  return allItems().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/menu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) return {};
  return { title: item.name, description: `${item.desc ?? item.sectionTitle} — ${formatPrice(item.price)} chez P'tit Paris, Ouagadougou.` };
}

export default async function DishPage({ params }: PageProps<"/menu/[slug]">) {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) notFound();
  const section = books.flatMap((b) => b.sections).find((s) => s.id === item.sectionId);
  const siblings = allItems().filter((i) => i.sectionId === item.sectionId && i.slug !== item.slug && i.photo).slice(0, 3);

  return (
    <div className="marble min-h-screen">
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-6">
        <Link href={`/menu?book=${item.bookId}#sec-${item.sectionId}`} className="text-xs font-semibold uppercase tracking-[0.25em] text-candy hover:text-ink">
          ← {item.bookTitle} · {item.sectionTitle}
        </Link>
        <div className="mt-8 grid items-start gap-10 md:grid-cols-2">
          <div className="animate-rise tilt relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl ring-8 ring-white">
            {item.photo ? (
              <Image src={item.photo} alt={item.name} fill priority sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-candy-soft to-mint-soft"><Logo className="h-32 w-32" /></div>
            )}
          </div>
          <div className="animate-rise" style={{ animationDelay: ".15s" }}>
            <div className="flex gap-2">
              {item.tags?.map((t) => (
                <span key={t} className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-ink shadow">
                  {TAG_LABEL[t].emoji} {TAG_LABEL[t].label}
                </span>
              ))}
            </div>
            <h1 className="font-display mt-4 text-4xl font-extrabold leading-tight text-ink md:text-6xl">{item.name}</h1>
            <p className="font-display mt-4 text-3xl font-bold text-candy">{formatPrice(item.price)}</p>
            {item.desc && <p className="mt-6 text-lg leading-relaxed text-muted">{item.desc}</p>}
            <div className="mt-8">
              <AddButton item={item} dual={section?.dual} size="lg" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/sommelier?q=${encodeURIComponent(`Que boire avec ${item.name} ?`)}`} className="rounded-full bg-mint-soft px-5 py-2.5 text-sm font-semibold text-sage transition hover:bg-mint hover:text-ink">
                🍷 Que boire avec ?
              </Link>
              <ShareButton title={`${item.name} · P'tit Paris`} text={`${item.name} — ${formatPrice(item.price)}`} />
            </div>
          </div>
        </div>

        {siblings.length > 0 && (
          <div className="mt-20">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-honey-deep">Dans la même rubrique</p>
            </Reveal>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((s, i) => (
                <Reveal key={s.slug} delay={i * 100}>
                  <DishCard item={s} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
