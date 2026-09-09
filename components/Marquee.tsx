export function Marquee({
  children,
  reverse = false,
  className = "",
  speed = 40,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
  speed?: number;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`marquee ${reverse ? "marquee-reverse" : ""}`} style={{ animationDuration: `${speed}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
