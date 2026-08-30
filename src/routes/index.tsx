import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowRight, Clock, EyeOff, Map, Mic } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHOMER — Report an antisemitic incident, get a plan in 60 seconds" },
      {
        name: "description",
        content:
          "Describe what happened and get a severity read, a sequenced action plan, and who to call — before you file anything. Anonymous, location-private.",
      },
      { property: "og:title", content: "SHOMER — Incident to Action" },
      {
        property: "og:description",
        content:
          "Guidance first, reporting second. Severity triage, an hour-by-hour action plan, and a live 24-hour incident map for Manhattan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <section className="px-5 pt-10">
        <p className="label-caps">Incident to Action</p>
        <h1 className="display-title mt-3 text-5xl">
          Something happened.
          <br />
          <span className="text-primary">Here is what to do.</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Eight in ten people who experience an antisemitic incident tell no one — mostly because
          they don&apos;t believe anything will happen. SHOMER answers first and asks second.
          Describe what happened and get a severity read, a sequenced plan, and an ordered contact
          list. The report is a by-product of getting help.
        </p>

        <Link
          to="/report"
          className="mt-7 flex w-full items-center justify-between rounded-lg bg-primary px-5 py-4 text-primary-foreground"
        >
          <span className="text-base font-semibold">Start a report</span>
          <ArrowRight className="size-5" aria-hidden />
        </Link>

        <Link
          to="/map"
          className="mt-3 flex w-full items-center justify-between rounded-lg border border-border bg-surface px-5 py-4"
        >
          <span className="flex items-center gap-2 text-base font-medium">
            <Map className="size-4 text-primary" aria-hidden />
            See the last 24 hours
          </span>
          <ArrowRight className="size-5 text-muted-foreground" aria-hidden />
        </Link>
      </section>

      <section className="mt-10 space-y-3 px-5">
        <Promise
          icon={<Clock className="size-4" aria-hidden />}
          title="Guidance before account"
          body="No sign-up, no login. You can take the plan and leave, or log the incident anonymously with one tap."
        />
        <Promise
          icon={<EyeOff className="size-4" aria-hidden />}
          title="Your exact location is never published"
          body="Precise coordinates are used for routing only. The public map is blurred by 150–300 metres in the database itself, so no front-end mistake can leak it."
        />
        <Promise
          icon={<Mic className="size-4" aria-hidden />}
          title="Conduct, never a person"
          body="SHOMER classifies what happened and recommends process. It will never label a named individual, and it will not help identify an anonymous account."
        />
      </section>

      <section className="mt-10 px-5">
        <p className="label-caps">Log the small stuff</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A single deniable comment is unwinnable. Forty logged comments over eighteen months, with
          dates, witnesses and the institution&apos;s own non-responses attached, is a civil-rights
          file. SHOMER actively wants the ambiguous ones.
        </p>
      </section>

      <p className="mt-10 px-5 text-xs leading-relaxed text-muted-foreground">
        Not an emergency service. Demonstration build — all mapped data is fabricated.
      </p>
    </AppShell>
  );
}

function Promise({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
