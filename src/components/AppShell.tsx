import { Link } from "@tanstack/react-router";
import { Phone, ShieldCheck, Map, FileText } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" aria-hidden />
            <span className="display-title text-2xl">SHOMER</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/report"
              className="label-caps hover:text-foreground"
              activeProps={{ className: "label-caps text-primary" }}
            >
              <span className="flex items-center gap-1">
                <FileText className="size-3.5" aria-hidden /> Report
              </span>
            </Link>
            <Link
              to="/map"
              className="label-caps hover:text-foreground"
              activeProps={{ className: "label-caps text-primary" }}
            >
              <span className="flex items-center gap-1">
                <Map className="size-3.5" aria-hidden /> Map
              </span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 pb-20">{children}</main>

      <a
        href="tel:911"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-md items-center justify-center gap-2 border-t border-destructive/40 bg-destructive px-4 py-3 text-destructive-foreground"
      >
        <Phone className="size-4" aria-hidden />
        <span className="text-sm font-semibold tracking-wide">
          In danger right now? Call 911
        </span>
      </a>
    </div>
  );
}
