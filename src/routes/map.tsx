import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { TIERS, TIER_ORDER, type Tier } from "@/lib/tiers";
import type { MapPoint } from "@/components/IncidentMap";

const IncidentMap = lazy(() => import("@/components/IncidentMap"));

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Live 24-hour incident map — SHOMER" },
      {
        name: "description",
        content:
          "A blurred, de-identified view of reported antisemitic incidents across Manhattan in the last 24 hours, colored by response tier.",
      },
      { property: "og:title", content: "Live 24-hour incident map — SHOMER" },
      {
        property: "og:description",
        content:
          "Is this happening to other people, near me, right now? Locations are deliberately imprecise and timestamps are truncated to the hour.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<Tier[]>([...TIER_ORDER]);

  useEffect(() => setMounted(true), []);

  const { data, isLoading } = useQuery({
    queryKey: ["public-incidents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_incidents")
        .select("id, tier, category, location_type, occurred_hour, lat, lng, synthetic")
        .order("occurred_hour", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as MapPoint[];
    },
  });

  const points = useMemo(
    () => (data ?? []).filter((p) => active.includes(p.tier)),
    [data, active],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { T1: 0, T2: 0, T3: 0, T4: 0 };
    (data ?? []).forEach((p) => (c[p.tier] = (c[p.tier] ?? 0) + 1));
    return c;
  }, [data]);

  const toggle = (t: Tier) =>
    setActive((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <AppShell>
      <div className="px-5 pt-5">
        <p className="label-caps">Manhattan · last 24 hours</p>
        <h1 className="display-title mt-1 text-3xl">
          {isLoading ? "—" : (data?.length ?? 0)} reported incidents
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Points are blurred 150–300 m and times are rounded to the hour.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 px-5">
        {TIER_ORDER.map((t) => {
          const on = active.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggle(t)}
              className="rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity"
              style={{
                color: on ? TIERS[t].colorVar : "var(--muted-foreground)",
                backgroundColor: on
                  ? `color-mix(in oklch, ${TIERS[t].colorVar} 18%, transparent)`
                  : "var(--surface)",
                border: `1px solid ${on ? `color-mix(in oklch, ${TIERS[t].colorVar} 45%, transparent)` : "var(--border)"}`,
              }}
            >
              {t} · {counts[t] ?? 0}
            </button>
          );
        })}
      </div>

      <div className="relative mt-4 h-[58vh] w-full overflow-hidden border-y border-border">
        {mounted ? (
          <Suspense fallback={<MapSkeleton />}>
            <IncidentMap points={points} />
          </Suspense>
        ) : (
          <MapSkeleton />
        )}
        <div className="pointer-events-none absolute left-3 top-3 rounded bg-background/85 px-2 py-1 text-[10px] font-bold tracking-widest text-primary">
          DEMONSTRATION DATA
        </div>
      </div>

      <div className="space-y-2 px-5 py-5">
        {TIER_ORDER.map((t) => (
          <div key={t} className="flex gap-3">
            <span
              className="mt-1.5 size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: TIERS[t].colorVar }}
              aria-hidden
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">{TIERS[t].label}</span> —{" "}
              {TIERS[t].blurb}
            </p>
          </div>
        ))}
        <p className="pt-2 text-xs text-muted-foreground">
          Every record shown is fabricated for demonstration. No point corresponds to a real person,
          place, or event.
        </p>
      </div>
    </AppShell>
  );
}

function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface text-sm text-muted-foreground">
      Loading map…
    </div>
  );
}
