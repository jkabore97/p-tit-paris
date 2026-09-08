import Image from "next/image";
import Link from "next/link";
import { formatPrice, TAG_LABEL, type FlatItem } from "@/lib/menu";

export function DishCard({ item, priority = false }: { item: FlatItem; priority?: boolean }) {
  return (
    <Link
      href={`/menu/${item.slug}`}
      className="card-hover group relative block overflow-hidden rounded-2xl bg-bordeaux-deep text-cream"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {item.photo ? (
          <Image
            src={item.photo}
            alt={item.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="velvet h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bordeaux-deep via-bordeaux-deep/20 to-transparent" />
        <div className="absolute left-4 top-4 flex gap-1.5">
          {item.tags?.map((t) => (
            <span key={t} title={TAG_LABEL[t].label} className="rounded-full bg-cream/90 px-2 py-0.5 text-xs">
              {TAG_LABEL[t].emoji}
            </span>
          ))}
        </div>
      </div>
      <div className="relative -mt-10 px-5 pb-5">
        <p className="text-[11px] uppercase tracking-[0.25em] text-gold">{item.sectionTitle}</p>
        <h3 className="font-display mt-1 text-xl leading-tight">{item.name}</h3>
        {item.desc && <p className="mt-2 line-clamp-2 text-sm text-cream/70">{item.desc}</p>}
        <p className="mt-3 font-display text-lg text-gold">{formatPrice(item.price)}</p>
      </div>
    </Link>
  );
}
