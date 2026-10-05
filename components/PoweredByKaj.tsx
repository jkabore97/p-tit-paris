import Image from "next/image";
import Link from "next/link";

/**
 * Signature du concepteur du site, KAJ Consulting LLC.
 * `tone="dark"` utilise le monogramme doré (variante officielle KAJ pour fonds sombres),
 * `tone="light"` le monogramme bleu-canard pour fonds clairs.
 * `href` est optionnel : sans lui, la mention s'affiche sans lien.
 */
export function PoweredByKaj({
  tone = "dark",
  href,
  className = "",
}: {
  tone?: "dark" | "light";
  href?: string;
  className?: string;
}) {
  const dark = tone === "dark";
  const inner = (
    <>
      <Image
        src={dark ? "/kaj/k-gold.png" : "/kaj/k-navy.png"}
        alt="KAJ Consulting LLC"
        width={234}
        height={256}
        className="h-9 w-auto shrink-0 opacity-90 transition duration-300 group-hover:scale-110 group-hover:opacity-100"
      />
      <span className={`text-[11px] uppercase tracking-[0.18em] ${dark ? "text-white/45" : "text-muted"}`}>
        Powered by{" "}
        <span className={`font-semibold ${dark ? "text-white/80" : "text-ink"}`}>KAJ</span>
      </span>
    </>
  );
  const cls = `group inline-flex items-center gap-2.5 ${className}`;
  return href ? (
    <Link href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </Link>
  ) : (
    <span className={cls}>{inner}</span>
  );
}
