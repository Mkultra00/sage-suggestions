import { TIERS, type Tier } from "@/lib/tiers";

export function TierBadge({ tier, showClock = true }: { tier: Tier; showClock?: boolean }) {
  const t = TIERS[tier];
  return (
    <span
      className="inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-semibold"
      style={{
        color: t.colorVar,
        backgroundColor: `color-mix(in oklch, ${t.colorVar} 18%, transparent)`,
        border: `1px solid color-mix(in oklch, ${t.colorVar} 40%, transparent)`,
      }}
    >
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: t.colorVar }}
        aria-hidden
      />
      {t.label}
      {showClock ? <span className="opacity-70">· {t.clock}</span> : null}
    </span>
  );
}
