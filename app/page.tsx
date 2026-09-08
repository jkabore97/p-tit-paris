import Image from "next/image";
import Link from "next/link";
import { DishCard } from "@/components/DishCard";
import { OpenStatus } from "@/components/OpenStatus";
import { Logo } from "@/components/Logo";
import { books, signatureItems } from "@/lib/menu";
import { site } from "@/lib/site";

const heroShots = [
  "/photos/poulet-wellington.jpg",
  "/photos/tortellini-fruits-de-mer.jpg",
  "/photos/ribs-bbq-burger.jpg",
  "/photos/blue-marguarita.jpg",
  "/photos/oeuf-benedicte.jpg",
  "/photos/pizza-fruits-de-mer.jpg",
];

export default function Home() {
  const signatures = signatureItems().slice(0, 9);
  const totalDishes = books.reduce((n, b) => n + b.sections.reduce((m, s) => m + s.items.length, 0), 0);

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <section className="velvet relative -mt-16 overflow-hidden pt-16 text-cream">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          {heroShots.map((src, i) => (
            <div
              key={src}
              className="animate-float absolute overflow-hidden rounded-[2rem] shadow-2xl"
              style={{
                width: `${22 + (i % 3) * 6}%`,
                aspectRatio: "4/3",
                left: `${[2, 68, 12, 74, 40, 55][i]}%`,
                top: `${[8, 4, 62, 58, 30, 78][i]}%`,
                animationDelay: `${i * -1.3}s`,
                opacity: 0.55,
              }}
            >
              <Image src={src} alt="" fill sizes="30vw" className="object-cover" priority={i < 2} />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-bordeaux-deep/70 via-bordeaux/40 to-bordeaux-deep" />
        </div>

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-5 py-24 text-center">
          <Logo className="animate-rise h-16 w-16 text-gold" stroke="var(--bordeaux-deep)" />
          <p className="animate-rise mt-6 text-xs uppercase tracking-[0.4em] text-gold" style={{ animationDelay: ".1s" }}>
            {site.tagline}
          </p>
          <h1
            className="font-display animate-rise mt-4 text-[17vw] leading-[0.85] md:text-[9rem]"
            style={{ animationDelay: ".2s" }}
          >
            <span className="gold-text">P&apos;tit</span>
            <br />
            Paris
          </h1>
          <p className="animate-rise mt-8 max-w-xl text-lg text-cream/80" style={{ animationDelay: ".3s" }}>
            Plus qu&apos;une dégustation, l&apos;âme de la papille pour enjouer vos matinées et soirées. Au cœur de{" "}
            {site.neighbourhood}, {site.city.split(",")[0]}.
          </p>
          <div className="animate-rise mt-8" style={{ animationDelay: ".4s" }}>
            <OpenStatus />
          </div>
          <div className="animate-rise mt-10 flex flex-wrap justify-center gap-4" style={{ animationDelay: ".5s" }}>
            <Link
              href="/menu"
              className="rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-bordeaux-deep transition hover:bg-cream"
            >
              Voir la carte
            </Link>
            <Link
              href="/reserver"
              className="rounded-full border border-cream/40 px-8 py-3 text-sm uppercase tracking-[0.2em] text-cream transition hover:border-cream hover:bg-cream/10"
            >
              Réserver
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- BOOKS */}
      <section className="paper py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs uppercase tracking-[0.3em] text-bordeaux">Trois cartes, une maison</p>
          <h2 className="font-display mt-3 text-4xl text-bordeaux-deep md:text-5xl">
            {totalDishes} références, du croissant au champagne.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {books.map((b, i) => (
              <Link
                key={b.id}
                href={`/menu?book=${b.id}`}
                className="card-hover group relative overflow-hidden rounded-3xl bg-bordeaux-deep p-8 text-cream"
              >
                <Image
                  src={["/photos/oeuf-benedicte.jpg", "/photos/poitrine-de-boeuf-48h.jpg", "/photos/aperol-spritz.jpg"][i]}
                  alt=""
                  fill
                  sizes="33vw"
                  className="object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bordeaux-deep via-bordeaux-deep/70 to-transparent" />
                <div className="relative flex min-h-64 flex-col justify-end">
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">{b.hours}</p>
                  <h3 className="font-display mt-2 text-3xl">{b.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-cream/70">{b.subtitle}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-cream/60">
                    {b.sections.length} rubriques →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- SIGNATURES */}
      <section className="velvet py-20 text-cream">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">👑 Spécialités maison</p>
              <h2 className="font-display mt-3 text-4xl md:text-5xl">Ce que le chef signe.</h2>
            </div>
            <Link href="/menu?tag=house" className="text-sm uppercase tracking-[0.2em] text-gold hover:text-cream">
              Toutes les spécialités →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signatures.map((it, i) => (
              <DishCard key={it.slug} item={it} priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- SOMMELIER */}
      <section className="paper py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image src="/photos/wines.jpg" alt="Cave P'tit Paris" fill sizes="50vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bordeaux-deep to-transparent p-8 text-cream">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Cave & cocktails</p>
              <p className="font-display mt-2 text-2xl">Du Château La Croix Montlabert au Hibiscus Gin Sour.</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-bordeaux">Nouveau</p>
            <h2 className="font-display mt-3 text-4xl text-bordeaux-deep md:text-5xl">
              Un sommelier qui connaît la carte par cœur.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">
              Dites-lui ce qui vous fait envie, votre budget ou ce que vous aimez. Il compose votre menu, vous propose l&apos;accord
              parfait de la cave et vous dit quoi commander pour quatre à 40 000 F.
            </p>
            <Link
              href="/sommelier"
              className="mt-8 inline-block rounded-full bg-bordeaux px-8 py-3 text-sm uppercase tracking-[0.2em] text-cream transition hover:bg-bordeaux-deep"
            >
              Demander conseil
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
