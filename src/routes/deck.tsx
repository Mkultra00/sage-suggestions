import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
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
        content:
          "What SHOMER does, why it matters, who it is for, and the tech stack behind it.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DeckPage,
});

function DeckPage() {
  return (
    <AppShell>
      <div className="flex h-full flex-col px-5 pt-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
        <h1 className="display-title mt-2 text-2xl">SHOMER deck</h1>
        <div className="mt-4 mb-5 min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card">
          <iframe
            src="/SHOMER-Presentation.pdf"
            title="SHOMER presentation deck"
            className="h-full w-full"
          />
        </div>
      </div>
    </AppShell>
  );
}
