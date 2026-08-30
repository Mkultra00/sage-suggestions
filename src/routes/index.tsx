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
                Every New Yorker deserves to feel safe and welcome in our city. Jews are no
                exception. With anti-semitism on the rise, now more than ever it's important to
                speak up and to listen. Shomer is a living record, collecting reports and creating
                visualizations, free and open to all.
              </p>
              <div className="mt-6 flex w-full flex-col items-center gap-3 md:flex-row">
                <Link
                  to="/map"
                  className="flex w-full items-center justify-center rounded-sm bg-marker px-8 py-4 text-base font-semibold uppercase tracking-[0.12em] text-marker-foreground transition-opacity hover:opacity-90 md:inline-flex md:w-auto"
                >
                  Open Shomer — View Incidents
                </Link>
                <a
                  href="/incident-map/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-sm border border-primary-foreground/40 px-8 py-4 text-base font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-primary-foreground/10 md:inline-flex md:w-auto"
                >
                  See Incident Map
                </a>
              </div>
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
                The mission of the Israeli-American Council (IAC) is to build an engaged and united
                Israeli-American community that strengthens the Israeli and Jewish identity of our
                next generation, the American Jewish community, and the bond between the peoples of
                the United States and the State of Israel.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                The scourge of antisemitism and Israel hatred both in our physical world and online,
                reminds us to stay united and use our voices to stand up for each other. Amidst
                hostility, the IAC takes action against hate through our individual programs and civic
                engagement initiatives. We also continue to provide educational and communal resources
                to empower each other during these difficult times.
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
