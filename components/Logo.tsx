/**
 * Le médaillon P'tit Paris : une boucle verticale traversée par une barre, tel qu'il est
 * peint sur le mur de la salle (rose) et imprimé sur les étiquettes pâtisserie (rouge bordeaux).
 */
export function Logo({
  className = "h-9 w-9",
  variant = "wine",
}: {
  className?: string;
  /** wine : disque bordeaux, trait crème (étiquettes). pink : disque rose, trait blanc (mur de la salle). */
  variant?: "wine" | "pink";
}) {
  const disc = variant === "pink" ? "#ff7fa3" : "#8c0f26";
  const ink = variant === "pink" ? "#ffffff" : "#fff2e4";
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="49" fill={disc} />
      <g fill="none" stroke={ink} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 53.5 H57" />
        <path d="M35 53.5 V25 A13 13 0 0 1 61 25 V62" />
        <path d="M93 46.5 H43" />
        <path d="M65 46.5 V75 A13 13 0 0 1 39 75 V38" />
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
