import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/deck")({
  head: () => ({
    meta: [
      { title: "SHOMER — Pitch deck" },
      {
        name: "description",
        content:
          "The SHOMER pitch: the problem, the data, the solution, and how a 90-second report becomes a personal action plan and a public safety map.",
      },
      { property: "og:title", content: "SHOMER — Pitch deck" },
      {
        property: "og:description",
        content:
          "Incident to Action: a living record of antisemitism in New York, and the AI triage that turns reports into response.",
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
  numbered?: { label: string; text: string }[];
  columns?: { heading: string; text: string }[];
};

const slides: Slide[] = [
  {
    title: "SHOMER",
    kicker: "Incident to Action",
    body: "A living record of antisemitism in New York.",
  },
  {
    kicker: "Which track?",
    title: "Incident to Action",
    body: "Helping communities respond faster — and building the evidence that makes response possible.",
  },
  {
    kicker: "The problem",
    title: "A New Yorker is harassed for being Jewish. What are their options?",
    body: "Call 911 for something that isn't a 911 emergency. Or tell no one. Most choose the second. The incident is never recorded — so the pattern that would prove a campus, a subway line, or a block needs attention never gets built.",
    quote:
      "NYPD logged 2,113 anti-Jewish hate crime complaints since 2019. 71% closed with no arrest. Reporting feels like reporting into a void, so people stop.",
  },
  {
    kicker: "Section",
    title: "How It Works",
    body: "From a 90-second report to a personal action plan and a public safety map.",
  },
  {
    kicker: "The data",
    title: "The evidence that exists — and what's missing",
    bullets: [
      "NYPD hate crime complaints, 77 precincts: 2,113 anti-Jewish incidents 2019–2026 YTD. 252 in 2019, peaking at 371 in 2024. 187 already in 2026.",
      "Case outcomes: 1,374 felonies, 726 misdemeanors, 611 arrests. 71% of reported incidents end with no arrest — and these are only the reported ones.",
      "Geography: concentration is local, not citywide. Four of the six worst precincts are in Brooklyn (90th, 66th, 70th, 61st). Response must be local.",
    ],
  },
  {
    kicker: "The solution",
    title: "A 90-second report becomes an action plan and a public safety map",
    body: "SHOMER runs on AI that classifies conduct, never people — it will not label a named individual. Reports publish blurred: a coarsened location, an hour instead of a timestamp. Nothing traces back to the reporter.",
    quote:
      "Incidents never reported anywhere become evidence a resident can take to a precinct, a dean, or a council member.",
  },
  {
    kicker: "The user",
    title: "Built for the person who assumes it doesn't count",
    bullets: [
      "The New Yorker who just had something happen and assumes it does not count.",
      "They will never file a police report. They will spend 90 seconds on their phone.",
      "And the IAC MAGEN volunteer who needs a pattern, not anecdotes.",
    ],
  },
  {
    kicker: "How it works",
    title: "Four steps from incident to action",
    numbered: [
      {
        label: "Safety first",
        text: '"Are you safe right now?" If it is still happening, we stop and route to emergency help.',
      },
      {
        label: "Capture",
        text: "Optional photo, location metadata stripped. Skip it if photographing is not safe.",
      },
      {
        label: "Locate and describe",
        text: "Tag the setting — subway, campus, synagogue. Name the institution, never a person.",
      },
      {
        label: "Plan, then map",
        text: "AI returns an action plan in seconds. Only then does a blurred point join the map.",
      },
    ],
  },
  {
    kicker: "How success looks",
    title: "Output and impact",
    columns: [
      {
        heading: "The Output",
        text: "A concrete next step in under two minutes, no account and no login. Plus a live map of where antisemitism is actually happening in New York — filtered by setting, category, and severity, free and open to all.",
      },
      {
        heading: "The Impact",
        text: "Reports that would otherwise not exist. Targets at 6 months: 500 first-hand reports across NYC, 60% from people who would not have called police, and 3 IAC MAGEN chapters using SHOMER data with precincts, campuses, or elected officials.",
      },
    ],
  },
  {
    kicker: "Our team",
    title: "The people behind SHOMER",
    bullets: [
      "[Name 1] — [Role]",
      "[Name 2] — [Role]",
      "[Name 3] — [Role]",
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
  const slide = slides[index] ?? slides[0]!;

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
            {slide.numbered && (
              <ol className="mt-5 max-w-2xl space-y-4">
                {slide.numbered.map((step, i) => (
                  <li key={step.label} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/50 text-sm font-semibold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground md:text-base">
                        {step.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            {slide.columns && (
              <div className="mt-5 grid max-w-3xl gap-6 md:grid-cols-2">
                {slide.columns.map((col) => (
                  <div
                    key={col.heading}
                    className="rounded-lg border border-border bg-background/50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                      {col.heading}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {col.text}
                    </p>
                  </div>
                ))}
              </div>
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
                  key={s.title + i}
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
