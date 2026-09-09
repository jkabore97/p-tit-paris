import Image from "next/image";
import Link from "next/link";
import { DishCard } from "@/components/DishCard";
import { OpenStatus } from "@/components/OpenStatus";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { Logo } from "@/components/Logo";
import { HeroParallax } from "@/components/HeroParallax";
import { books, formatPrice, signatureItems, allItems } from "@/lib/menu";
import { site } from "@/lib/site";

const interior = [
  { src: "/interior/grande-salle.jpg", alt: "La grande salle", w: 300 },
  { src: "/interior/comptoir.jpg", alt: "Le comptoir boulangerie, viennoiserie, gâteaux", w: 520 },
  { src: "/interior/mur-logo.jpg", alt: "Le mur P'tit Paris", w: 300 },
  { src: "/interior/salle-pastel.jpg", alt: "La véranda", w: 300 },
  { src: "/interior/buche-rouge.jpg", alt: "Bûche fruits rouges", w: 420 },
  { src: "/interior/buche-caramel.jpg", alt: "Bûche caramel", w: 420 },
];

export default function Home() {
  const signatures = signatureItems().slice(0, 6);
  const ticker = allItems().filter((i) => i.photo).slice(0, 26);
  const totalDishes = books.reduce((n, b) => n + b.sections.reduce((m, s) => m + s.items.length, 0), 0);

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <section className="marble relative -mt-16 overflow-hidden pt-16">
        <div className="blob left-[-10%] top-[-10%] h-[45vw] w-[45vw] bg-candy" />
        <div className="blob right-[-8%] top-[10%] h-[38vw] w-[38vw] bg-honey" style={{ animationDelay: "-6s" }} />
        <div className="blob bottom-[-15%] left-[25%] h-[40vw] w-[40vw] bg-mint" style={{ animationDelay: "-12s" }} />
        <div className="blob bottom-[5%] right-[15%] h-[24vw] w-[24vw] bg-azure" style={{ animationDelay: "-3s" }} />
        <HeroParallax />

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-5 py-24 text-center">
          <div className="animate-rise relative">
            <Logo className="h-24 w-24 drop-shadow-[0_16px_30px_rgba(140,15,38,.35)]" />
            <span className="absolute inset-0 -z-10 animate-ring rounded-full" />
          </div>
          <p className="animate-rise mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-wine" style={{ animationDelay: ".1s" }}>
            {site.tagline}
          </p>
          <h1 className="font-display animate-rise mt-3 text-[18vw] font-extrabold leading-[0.82] tracking-tight md:text-[9.5rem]" style={{ animationDelay: ".2s" }}>
            <span className="sunrise-text">P&apos;tit</span>
            <br />
            <span className="text-wine">Paris</span>
          </h1>
          <p className="animate-rise mt-8 max-w-xl text-lg text-ink/70" style={{ animationDelay: ".3s" }}>
            Boulangerie, brunch, burgers, pâtes, pizzas, grillades, pâtisserie et cocktails. Au cœur de {site.neighbourhood},{" "}
            {site.city.split(",")[0]}.
          </p>
          <div className="animate-rise mt-8" style={{ animationDelay: ".4s" }}>
            <OpenStatus />
          </div>
          <div className="animate-rise mt-10 flex flex-wrap justify-center gap-3" style={{ animationDelay: ".5s" }}>
            <Link href="/commander" className="btn-shine rounded-full bg-candy px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-xl shadow-candy/30 transition hover:-translate-y-1">
              Commander à table
            </Link>
            <Link href="/menu" className="btn-shine rounded-full bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-ink shadow-lg transition hover:-translate-y-1">
              Voir la carte
            </Link>
            <Link href="/reserver" className="rounded-full border-2 border-ink/15 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-candy hover:text-candy">
              Réserver
            </Link>
          </div>
          <a href="#decouvrir" className="animate-bounce-soft mt-16 text-2xl text-ink/40" aria-label="Découvrir">↓</a>
        </div>
      </section>

      {/* ---------------------------------------------------------- TICKER */}
      <div id="decouvrir" className="sunrise-bg py-3 text-white shadow-inner">
        <Marquee speed={60}>
          {ticker.map((i) => (
            <Link key={i.slug} href={`/menu/${i.slug}`} className="mx-5 flex items-center gap-3 whitespace-nowrap font-display text-lg font-bold transition hover:scale-110">
              <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/70">
                <Image src={i.photo!} alt="" fill sizes="36px" className="object-cover" />
              </span>
              {i.name} <span className="text-white/80">{formatPrice(i.price)}</span> <span className="text-white/60">✦</span>
            </Link>
          ))}
        </Marquee>
      </div>

      {/* ---------------------------------------------------------- QR ORDERING */}
      <section className="relative overflow-hidden py-24">
        <div className="dots absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wine">Nouveau · commande à table</p>
            <h2 className="font-display mt-3 text-4xl font-extrabold text-ink md:text-6xl">
              Scannez. Commandez. <span className="candy-text">Savourez.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              Plus besoin d&apos;attendre qu&apos;on passe : le QR de votre table ouvre la carte, vous choisissez, et la cuisine reçoit tout en direct.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { n: "1", t: "Scannez", d: "Le QR code sur votre table ouvre P'tit Paris avec votre numéro de table déjà rempli.", bg: "bg-candy-soft", ic: "📱" },
              { n: "2", t: "Choisissez", d: "Toute la carte avec photos, tailles et suppléments. Ajoutez, ajustez, indiquez votre prénom.", bg: "bg-mint-soft", ic: "🍽️" },
              { n: "3", t: "Détendez-vous", d: "Suivez votre commande en direct : reçue, en cuisine, prête. On vous l'apporte.", bg: "bg-azure-soft", ic: "✨" },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className={`card-hover h-full rounded-[2rem] ${s.bg} p-8`}>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-6xl font-extrabold text-ink/15">{s.n}</span>
                    <span className="animate-bounce-soft text-4xl" style={{ animationDelay: `${i * 0.4}s` }}>{s.ic}</span>
                  </div>
                  <h3 className="font-display mt-4 text-2xl font-bold text-ink">{s.t}</h3>
                  <p className="mt-2 text-muted">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center" delay={200}>
            <Link href="/commander" className="btn-shine inline-block rounded-full bg-ink px-9 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-xl transition hover:-translate-y-1 hover:bg-candy">
              Essayer la commande en ligne
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- INTERIOR */}
      <section className="marble overflow-hidden py-20">
        <Reveal className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-honey-deep">Le lieu</p>
          <h2 className="font-display mt-3 text-4xl font-extrabold text-ink md:text-5xl">Marbre, bois blond, lumière.</h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">Comptoir boulangerie, coin gâteaux, grande salle et véranda. Un endroit fait pour traîner.</p>
        </Reveal>
        <div className="mt-10 space-y-4">
          <Marquee speed={55}>
            {interior.map((p) => (
              <div key={p.src} className="tilt relative mx-2 h-64 shrink-0 overflow-hidden rounded-3xl shadow-xl" style={{ width: p.w }}>
                <Image src={p.src} alt={p.alt} fill sizes="520px" className="object-cover" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink">{p.alt}</span>
              </div>
            ))}
          </Marquee>
          <Marquee speed={70} reverse>
            {[...ticker].reverse().slice(0, 14).map((i) => (
              <Link key={i.slug} href={`/menu/${i.slug}`} className="tilt relative mx-2 h-44 w-60 shrink-0 overflow-hidden rounded-3xl shadow-lg">
                <Image src={i.photo!} alt={i.name} fill sizes="240px" className="object-cover" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink">{i.name}</span>
              </Link>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ---------------------------------------------------------- SIGNATURES */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wine">👑 Spécialités maison</p>
              <h2 className="font-display mt-3 text-4xl font-extrabold text-ink md:text-5xl">Ce que le chef signe.</h2>
            </div>
            <Link href="/menu?tag=house" className="text-sm font-semibold uppercase tracking-[0.2em] text-candy hover:text-ink">
              Toutes les spécialités →
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signatures.map((it, i) => (
              <Reveal key={it.slug} delay={i * 90}>
                <DishCard item={it} priority={i < 3} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- PÂTISSERIE */}
      <section className="relative overflow-hidden py-20">
        <div className="blob left-[-10%] top-0 h-[30vw] w-[30vw] bg-candy opacity-40" />
        <div className="blob bottom-0 right-[-10%] h-[30vw] w-[30vw] bg-honey opacity-40" style={{ animationDelay: "-9s" }} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-honey-deep">Pâtisserie & gâteaux</p>
            <h2 className="font-display mt-3 text-4xl font-extrabold text-ink md:text-5xl">Bûches, entremets, gâteaux d&apos;anniversaire.</h2>
            <p className="mt-4 text-lg text-muted">
              Notre atelier pâtisserie signe des bûches glacées, des entremets et des gâteaux sur commande pour vos fêtes. Dites-nous la date, le nombre de parts et l&apos;envie.
            </p>
            <Link href="/reserver" className="btn-shine mt-8 inline-block rounded-full bg-honey px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-ink shadow-lg shadow-honey/40 transition hover:-translate-y-1">
              Commander un gâteau
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {[
              { src: "/interior/buche-rouge.jpg", alt: "Bûche fruits rouges", rot: "-rotate-3" },
              { src: "/interior/buche-caramel.jpg", alt: "Bûche caramel matelassée", rot: "rotate-3 mt-10" },
            ].map((p, i) => (
              <Reveal key={p.src} delay={i * 150}>
                <div className={`tilt relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl ${p.rot}`}>
                  <Image src={p.src} alt={p.alt} fill sizes="40vw" className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- BOOKS */}
      <section className="marble py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wine">Trois cartes, une maison</p>
            <h2 className="font-display mt-3 text-4xl font-extrabold text-ink md:text-5xl">{totalDishes} références, du croissant au champagne.</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {books.map((b, i) => (
              <Reveal key={b.id} delay={i * 120}>
                <Link href={`/menu?book=${b.id}`} className="card-hover group relative block overflow-hidden rounded-[2rem] shadow-xl">
                  <div className="relative aspect-[4/5]">
                    <Image src={["/photos/oeuf-benedicte.jpg", "/photos/poitrine-de-boeuf-48h.jpg", "/photos/aperol-spritz.jpg"][i]} alt="" fill sizes="33vw" className="object-cover transition duration-700 group-hover:scale-110" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${["from-candy/90", "from-honey-deep/90", "from-sage/90"][i]} via-transparent to-transparent`} />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/80">{b.hours}</p>
                    <h3 className="font-display mt-1 text-3xl font-bold">{b.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/85">{b.subtitle}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- SOMMELIER */}
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <Reveal className="order-2 md:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sage">Sommelier IA</p>
            <h2 className="font-display mt-3 text-4xl font-extrabold text-ink md:text-5xl">Il connaît la carte par cœur.</h2>
            <p className="mt-5 text-lg text-muted">
              Un budget, une envie, une allergie : il compose votre menu, propose l&apos;accord de la cave et vous dit quoi commander pour quatre à 40 000 F.
            </p>
            <Link href="/sommelier" className="btn-shine mt-8 inline-block rounded-full bg-mint px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-ink shadow-lg shadow-mint/50 transition hover:-translate-y-1">
              Demander conseil
            </Link>
          </Reveal>
          <Reveal className="order-1 md:order-2" delay={100}>
            <div className="tilt relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
              <Image src="/photos/wines.jpg" alt="La cave" fill sizes="50vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-8 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-honey">Cave & cocktails</p>
                <p className="font-display mt-2 text-2xl font-bold">Du Château La Croix Montlabert au Hibiscus Gin Sour.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
