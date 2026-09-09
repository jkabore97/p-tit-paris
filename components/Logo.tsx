/**
 * Le médaillon P'tit Paris, redessiné d'après le logo officiel : une onde faite d'un U et d'une
 * arche décalés, barres plates de part et d'autre. Bordeaux et or sur fond clair, rose et blanc sur fond sombre.
 */
export function Logo({
  className = "h-9 w-9",
  variant = "wine",
}: {
  className?: string;
  /** wine : disque bordeaux, trait crème (étiquettes). pink : disque rose, trait blanc (mur de la salle). */
  variant?: "wine" | "pink";
}) {
  const disc = variant === "pink" ? "#ff7fa3" : "#8b1421";
  const ink = variant === "pink" ? "#ffffff" : "#d9c49d";
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="49" fill={disc} />
      <g fill="none" stroke={ink} strokeWidth="9.3" strokeLinecap="butt" strokeLinejoin="round">
        <path d="M10.5 54.2 H34 V68.7 A10.75 10.75 0 0 0 55.5 68.7 V50" />
        <path d="M44.5 50 V31.3 A10.75 10.75 0 0 1 66 31.3 V45.8 H89.5" />
      </g>
    </svg>
  );
}

/** Le mot-marque, en capitales espacées comme l'enseigne. */
export function Wordmark({ className = "text-2xl" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold uppercase tracking-[0.12em] ${className}`}>
      P&apos;tit Paris
    </span>
  );
}
