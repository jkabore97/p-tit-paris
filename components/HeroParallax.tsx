"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const shots = [
  { src: "/interior/comptoir.jpg", w: 30, l: 1, t: 8, d: 0 },
  { src: "/photos/poulet-wellington.jpg", w: 20, l: 76, t: 4, d: -2 },
  { src: "/photos/tortellini-fruits-de-mer.jpg", w: 18, l: 2, t: 70, d: -4 },
  { src: "/interior/buche-rouge.jpg", w: 22, l: 76, t: 68, d: -6 },
  { src: "/photos/blue-marguarita.jpg", w: 11, l: 87, t: 40, d: -8 },
  { src: "/photos/pizza-fruits-de-mer.jpg", w: 13, l: 10, t: 40, d: -3 },
];

/** Photos flottantes qui glissent avec le défilement. */
export function HeroParallax() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block">
      {shots.map((s, i) => (
        <div
          key={s.src}
          className="animate-float absolute overflow-hidden rounded-[1.75rem] shadow-2xl ring-4 ring-white/80"
          style={{
            width: `${s.w}%`,
            aspectRatio: "4/3",
            left: `${s.l}%`,
            top: `${s.t}%`,
            animationDelay: `${s.d}s`,
            transform: `translateY(${y * (0.08 + (i % 3) * 0.06)}px)`,
            opacity: 0.9,
          }}
        >
          <Image src={s.src} alt="" fill sizes="30vw" className="object-cover" priority={i < 2} />
        </div>
      ))}
    </div>
  );
}
