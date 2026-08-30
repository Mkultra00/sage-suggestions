import { createFileRoute, Link } from "@tanstack/react-router";
import iacLogo from "@/assets/iac-logo.svg.asset.json";
import manhattan from "@/assets/manhattan.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manhattan Antisemitic Incident Tracker | IAC" },
      {
        name: "description",
        content:
          "A verified, mapped record of antisemitic incidents across Manhattan, an initiative of the Israeli-American Council.",
      },
      { property: "og:title", content: "Manhattan Antisemitic Incident Tracker | IAC" },
      {
        property: "og:description",
        content:
          "A verified, mapped record of antisemitic incidents across Manhattan, an initiative of the Israeli-American Council.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="landing min-h-screen bg-background font-sans">
      <header className="border-b border-primary-foreground/15 bg-primary">
        <div className="mx-auto flex max-w-5xl items-center px-5 py-3">
          <a
            href="https://iac360.org"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center"
          >
            <img
              src={iacLogo.url}
              alt="Israeli-American Council logo"
              className="h-9 w-auto"
              width={130}
              height={36}
            />
          </a>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
          <img
            src={manhattan.url}
            alt="High-contrast illustration of the Manhattan skyline at sunset"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]"
            width={768}
            height={1024}
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-primary/85 to-transparent"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-5xl px-5 pb-8 pt-8 md:pb-20 md:pt-20">
            <div className="max-w-md md:max-w-xl">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
                An IAC Initiative
              </p>
              <h1 className="mt-2 font-display text-2xl leading-tight md:text-5xl">
                SHOMER: Incident to Action
              </h1>
              <p className="mt-3 max-w-prose text-[0.8rem] leading-relaxed text-primary-foreground/85 md:mt-4 md:text-base">
                This platform collects, verifies, and maps reports of antisemitic incidents
                throughout Manhattan, turning scattered accounts into a clear public record. Every
                submission is reviewed before publication so residents, community leaders,
                journalists, and law enforcement can see where and how often these events occur.
              </p>
              <Link
                to="/map"
                className="mt-6 flex w-full items-center justify-center rounded-sm bg-marker px-8 py-4 text-base font-semibold uppercase tracking-[0.12em] text-marker-foreground transition-opacity hover:opacity-90 md:inline-flex md:w-auto"
              >
                View Incidents
              </Link>
              <p className="mt-2 text-center text-xs text-primary-foreground/60 md:text-left">
                Free to use. No account required to browse the map.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
            <h2 className="font-display text-2xl text-foreground md:text-3xl">About the IAC</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 md:gap-10">
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                The Israeli-American Council builds an engaged Israeli-American community that
                strengthens the Israeli and Jewish identity of its members, the American Jewish
                community, and the bond between the people of the United States and Israel.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                This incident tracker is part of that work: giving the community a reliable,
                verified record of antisemitic activity in Manhattan so that advocacy, education,
                and safety efforts are grounded in documented fact.
              </p>
            </div>
            <a
              href="https://iac360.org"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex border-b border-foreground/30 pb-0.5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
            >
              Visit iac360.org
            </a>
          </div>
        </section>

        <section className="border-b border-border bg-secondary">
          <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
            <h2 className="font-display text-2xl text-foreground md:text-3xl">What the app does</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  t: "Report an incident",
                  b: "Submit what happened, where, and when in a few minutes — anonymously if you prefer.",
                },
                {
                  t: "Browse the map",
                  b: "See incidents plotted by neighborhood, filtered by date, category, and severity.",
                },
                {
                  t: "Verified records",
                  b: "Every report is reviewed against supporting details before it appears publicly.",
                },
                {
                  t: "Community alerts",
                  b: "Opt in to notifications when activity is documented near where you live or work.",
                },
              ].map((f) => (
                <li key={f.t} className="border-l-2 border-marker bg-card px-5 py-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-card-foreground">
                    {f.t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.b}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
            <h2 className="font-display text-2xl text-foreground md:text-3xl">
              How reporting works
            </h2>
            <ol className="mt-6 space-y-6 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
              {[
                {
                  n: "01",
                  t: "Submit",
                  b: "A witness, victim, or community member files a report with the date, location, and description of what occurred.",
                },
                {
                  n: "02",
                  t: "Verify",
                  b: "Trained reviewers check the account against available evidence and corroborating reports before anything is published.",
                },
                {
                  n: "03",
                  t: "Publish",
                  b: "The verified incident is added to the public map and to the running record used for advocacy and safety planning.",
                },
              ].map((s) => (
                <li key={s.n} className="border-t border-border pt-4">
                  <span className="font-display text-3xl text-marker">{s.n}</span>
                  <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-foreground">
                    {s.t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
                </li>
              ))}
            </ol>
            <Link
              to="/report"
              className="mt-8 inline-flex items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a report
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between">
          <img
            src={iacLogo.url}
            alt="Israeli-American Council logo"
            className="h-8 w-auto"
            width={116}
            height={32}
          />
          <p className="max-w-md text-xs leading-relaxed text-primary-foreground/60">
            This site is informational and is not an emergency service. © 2026 Israeli-American
            Council. Demonstration build — all mapped data is fabricated.
          </p>
        </div>
      </footer>
    </div>
  );
}
