import Image from "next/image";
import Link from "next/link";
import { AddButton } from "./AddButton";
import { formatPrice, TAG_LABEL, type FlatItem } from "@/lib/menu";

const tints = ["from-candy-soft", "from-mint-soft", "from-azure-soft", "from-wood/60"];

export function DishCard({ item, priority = false, index = 0 }: { item: FlatItem; priority?: boolean; index?: number }) {
  return (
    <article className="card-hover group relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_40px_-28px_rgba(74,44,28,.5)] ring-1 ring-ink/5">
      <Link href={`/menu/${item.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          {item.photo ? (
            <Image src={item.photo} alt={item.name} fill priority={priority} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1" />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${tints[index % tints.length]} to-white`} />
          )}
          <div className="absolute left-4 top-4 flex gap-1.5">
            {item.tags?.map((t) => (
              <span key={t} title={TAG_LABEL[t].label} className="rounded-full bg-white/90 px-2 py-0.5 text-xs shadow">
                {TAG_LABEL[t].emoji}
              </span>
            ))}
          </div>
          <span className="absolute bottom-4 right-4 rounded-full bg-white px-3 py-1 font-display text-base font-bold text-candy shadow-lg">
            {formatPrice(item.price)}
          </span>
          {item.available === false && <span className="absolute inset-0 grid place-items-center bg-white/60 font-display text-2xl font-extrabold uppercase tracking-[0.2em] text-ink">Épuisé</span>}
        </div>
      </Link>
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-[0.25em] text-honey-deep">{item.sectionTitle}</p>
        <Link href={`/menu/${item.slug}`}>
          <h3 className="font-display mt-1 text-xl font-bold leading-tight text-ink transition group-hover:text-candy">{item.name}</h3>
        </Link>
        {item.desc && <p className="mt-2 line-clamp-2 text-sm text-muted">{item.desc}</p>}
        <div className="mt-4">
          <AddButton item={item} />
        </div>
      </div>
    </article>
  );
}
