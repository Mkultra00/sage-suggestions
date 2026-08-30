import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/deck")({
  head: () => ({
    meta: [
      { title: "SHOMER — Presentation deck" },
      {
        name: "description",
        content:
          "The SHOMER briefing deck: what the app does, why it matters, who it is for, and the tech stack behind it.",
      },
      { property: "og:title", content: "SHOMER — Presentation deck" },
      {
        property: "og:description",
        content: "What SHOMER does, why it matters, who it is for, and the tech stack behind it.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DeckPage,
});

type Slide = {
  kicker?: string;
  title: string;
  body?: string;
  bullets?: string[];
  quote?: string;
};

const slides: Slide[] = [
  {
    kicker: "An IAC Initiative",
    title: "SHOMER: Incident to Action",
    body: "A living record of antisemitic incidents in Manhattan — collecting reports, creating visualizations, and turning reports into safety-first action. Free and open to all.",
  },
  {
    kicker: "What the app does",
    title: "From report to response",
    bullets: [
      "Report an incident in minutes — anonymously if you prefer.",
      "Every report is AI-triaged into severity tiers T1–T4 with a safety-first action plan.",
      "Incidents are plotted on a live Manhattan map with fuzzed coordinates to protect privacy.",
      "Browse, filter, and understand patterns by neighborhood, category, and severity.",
    ],
  },
  {
    kicker: "Triage tiers",
    title: "T1–T4 severity triage",
    bullets: [
      "T1 — Critical: imminent danger; safety routing and immediate guidance.",
      "T2 — High: assaults, threats, vandalism; priority action plan with contacts and deadlines.",
      "T3 — Moderate: harassment and intimidation; documentation and support resources.",
      "T4 — Informational: lower-severity reports kept on the record.",
    ],
    body: "SHOMER addresses conduct and process — it never identifies, names, or adjudicates a person.",
  },
  {
    kicker: "Why it matters",
    title: "Speak up, and listen",
    quote:
      "Every New Yorker deserves to feel safe and welcome in our city. Jews are no exception.",
    bullets: [
      "Antisemitism is on the rise; unreported incidents stay invisible.",
      "A verified, mapped record turns isolated experiences into shared understanding.",
      "Data empowers communities, institutions, and policymakers to act.",
    ],
  },
  {
    kicker: "Who it is for",
    title: "Built for the community",
    bullets: [
      "Community members who witness or experience antisemitic incidents.",
      "Community organizations tracking and responding to local activity.",
      "Researchers and journalists seeking verified, mapped data.",
      "Policymakers and civic leaders making informed decisions.",
    ],
  },
  {
    kicker: "How it works",
    title: "Report → triage → act",
    bullets: [
      "Submit: describe what happened, where, and when — voice input supported.",
      "Triage: AI classifies severity and drafts an action plan with rationale.",
      "Publish: privacy-preserving location appears on the public map.",
      "Act: clear next steps, contacts, and deadlines for each report.",
    ],
  },
  {
    kicker: "Tech stack",
    title: "How it's built",
    bullets: [
      "React 19 + TanStack Start (SSR) with Tailwind CSS v4.",
      "TanStack server functions on Cloudflare Workers.",
      "Lovable AI Gateway — Gemini 3.7 Flash for triage and action plans.",
      "PostgreSQL via Lovable Cloud with strict row-level security.",
      "MapLibre GL + Carto basemaps for the incident map.",
      "Private evidence storage with EXIF stripping for uploads.",
    ],
  },
  {
    kicker: "Get involved",
    title: "Open Shomer",
    body: "Browse the live map, start a report, or share the record. Free and open to all — no account required to browse.",
  },
];

function DeckPage() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const go = useCallback(
    (delta: number) => setIndex((i) => Math.min(slides.length - 1, Math.max(0, i + delta))),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <AppShell>
      <div className="flex h-full flex-col px-5 pt-5">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
          <span className="text-xs text-muted-foreground">
            Slide {index + 1} of {slides.length}
          </span>
        </div>

        <div className="mt-4 mb-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex min-h-0 flex-1 flex-col justify-center px-6 py-8 md:px-14">
            {slide.kicker && (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {slide.kicker}
              </p>
            )}
            <h1 className="display-title mt-2 text-3xl md:text-4xl">{slide.title}</h1>
            {slide.body && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {slide.body}
              </p>
            )}
            {slide.quote && (
              <blockquote className="mt-4 max-w-2xl border-l-2 border-primary pl-4 text-base italic leading-relaxed text-foreground md:text-lg">
                {slide.quote}
              </blockquote>
            )}
            {slide.bullets && (
              <ul className="mt-5 max-w-2xl space-y-3">
                {slide.bullets.map((b) => (
                  <li
                    key={b}
                    className="border-l-2 border-primary/40 pl-3 text-sm leading-relaxed text-muted-foreground md:text-base"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <div className="flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 w-5 rounded-full transition-colors ${
                    i === index ? "bg-primary" : "bg-border hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index === slides.length - 1}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
