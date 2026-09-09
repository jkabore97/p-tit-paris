export function Logo({ className = "h-9 w-9", stroke = "#fff" }: { className?: string; stroke?: string }) {
  // Monogramme inspiré du médaillon rose P'tit Paris (deux « P » entrelacés)
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill="currentColor" />
      <path
        d="M20 40V24h10a7 7 0 0 1 0 14h-4M44 24v16H34a7 7 0 0 1 0-14h4"
        fill="none"
        stroke={stroke}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
