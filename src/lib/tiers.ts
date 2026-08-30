export type Tier = "T1" | "T2" | "T3" | "T4";

export const TIERS: Record<
  Tier,
  { label: string; clock: string; blurb: string; colorVar: string }
> = {
  T1: {
    label: "Tier 1 — Emergency",
    clock: "Act now",
    blurb: "Violence, weapons, credible threats, doxxing. Law enforcement and security immediately.",
    colorVar: "var(--tier-1)",
  },
  T2: {
    label: "Tier 2 — Urgent",
    clock: "Within hours",
    blurb: "Vandalism, targeted threats online, property damage. Police report plus organizational escalation.",
    colorVar: "var(--tier-2)",
  },
  T3: {
    label: "Tier 3 — Standard",
    clock: "Within days",
    blurb: "Harassment, slurs, defaced materials. Document, report to the responsible institution, follow up.",
    colorVar: "var(--tier-3)",
  },
  T4: {
    label: "Tier 4 — Pattern",
    clock: "Log and build",
    blurb: "Ambiguous, deniable, or low-grade conduct. One entry is unwinnable; forty entries are a civil-rights file.",
    colorVar: "var(--tier-4)",
  },
};

export const TIER_ORDER: Tier[] = ["T1", "T2", "T3", "T4"];

export const CATEGORY_LABELS: Record<string, string> = {
  physical_assault: "Physical assault",
  threatening_message: "Threatening message",
  graffiti_vandalism: "Graffiti / vandalism",
  property_damage: "Property damage",
  online_threat: "Online threat",
  verbal_harassment: "Verbal harassment",
  slur_public: "Slur in public",
  campus_incident: "Campus incident",
  exclusion_workplace: "Workplace exclusion",
  microaggression: "Coded / deniable conduct",
  unspecified: "Unspecified",
};

export function categoryLabel(key: string) {
  return CATEGORY_LABELS[key] ?? key.replace(/_/g, " ");
}

export const LOCATION_TYPES = [
  "street",
  "subway",
  "campus",
  "workplace",
  "synagogue",
  "retail",
  "residential",
  "park",
  "online",
] as const;
