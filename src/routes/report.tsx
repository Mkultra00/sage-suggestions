import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Check,
  Crosshair,
  Loader2,
  Mic,
  MicOff,
  Phone,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TierBadge } from "@/components/TierBadge";
import { analyzeIncident, type IncidentPlan } from "@/lib/incidents.functions";
import { LOCATION_TYPES, TIERS } from "@/lib/tiers";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an incident — SHOMER" },
      {
        name: "description",
        content:
          "Photograph what happened, confirm where, and say what you saw. Get a severity read, an action plan, and an ordered contact list in under 90 seconds.",
      },
      { property: "og:title", content: "Report an incident — SHOMER" },
      {
        property: "og:description",
        content:
          "Anonymous intake. Guidance is returned before anything is saved, and your exact location is never published.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportPage,
});

type Step = "safety" | "capture" | "locate" | "describe" | "plan";

const DANGER_TERMS = [
  "knife",
  "gun",
  "weapon",
  "bleeding",
  "stabbed",
  "shot",
  "attacking",
  "chasing",
  "following me",
  "right now",
  "injured",
  "hit me",
];

function ReportPage() {
  const [step, setStep] = useState<Step>("safety");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationType, setLocationType] = useState<string>("street");
  const [institution, setInstitution] = useState("");
  const [description, setDescription] = useState("");
  const [plan, setPlan] = useState<IncidentPlan | null>(null);
  const [saved, setSaved] = useState(true);

  const analyze = useServerFn(analyzeIncident);
  const mutation = useMutation({
    mutationFn: async (save: boolean) =>
      analyze({
        data: {
          description,
          locationType,
          institution: institution.trim() || null,
          lat: coords?.lat ?? 40.7831,
          lng: coords?.lng ?? -73.9712,
          occurredAt: new Date().toISOString(),
          evidenceNote: photoName ? `Reporter attached a photo named ${photoName}.` : null,
          save,
        },
      }),
    onSuccess: (result) => {
      setPlan(result);
      setStep("plan");
    },
  });

  const dangerFlag = DANGER_TERMS.some((t) => description.toLowerCase().includes(t));

  return (
    <AppShell>
      {step === "safety" && <SafetyGate onContinue={() => setStep("capture")} />}

      {step === "capture" && (
        <CaptureStep
          photo={photo}
          onPhoto={(url, name) => {
            setPhoto(url);
            setPhotoName(name);
          }}
          onClear={() => {
            setPhoto(null);
            setPhotoName(null);
          }}
          onNext={() => setStep("locate")}
        />
      )}

      {step === "locate" && (
        <LocateStep
          coords={coords}
          locating={locating}
          onLocate={() => {
            setLocating(true);
            navigator.geolocation?.getCurrentPosition(
              (pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLocating(false);
              },
              () => setLocating(false),
              { enableHighAccuracy: true, timeout: 8000 },
            );
          }}
          locationType={locationType}
          setLocationType={setLocationType}
          institution={institution}
          setInstitution={setInstitution}
          onNext={() => setStep("describe")}
        />
      )}

      {step === "describe" && (
        <DescribeStep
          description={description}
          setDescription={setDescription}
          dangerFlag={dangerFlag}
          pending={mutation.isPending}
          error={mutation.error as Error | null}
          onSubmit={() => mutation.mutate(true)}
        />
      )}

      {step === "plan" && plan && (
        <PlanStep
          plan={plan}
          saved={saved}
          onDiscard={() => setSaved(false)}
        />
      )}
    </AppShell>
  );
}

function StepFrame({
  index,
  title,
  subtitle,
  children,
}: {
  index: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 pt-6">
      <p className="label-caps">{index}</p>
      <h1 className="display-title mt-1 text-3xl">{title}</h1>
      {subtitle ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="mt-6 flex w-full items-center justify-between rounded-lg bg-primary px-5 py-4 text-primary-foreground disabled:opacity-40"
    >
      <span className="text-base font-semibold">{children}</span>
      <ArrowRight className="size-5" aria-hidden />
    </button>
  );
}

function SafetyGate({ onContinue }: { onContinue: () => void }) {
  return (
    <StepFrame
      index="Step 1 of 4 · Safety"
      title="Are you safe right now?"
      subtitle="Nothing on this page comes before your safety. Never photograph an active scene."
    >
      <p className="w-full rounded-lg border border-destructive/50 bg-destructive/15 px-5 py-4 text-base font-semibold text-destructive">
        If someone is hurt or it&apos;s still happening, stop here and get to safety first.
      </p>
      <button
        onClick={onContinue}
        className="mt-3 flex w-full items-center justify-between rounded-lg border border-border bg-surface px-5 py-4"
      >
        <span className="text-base font-medium">Yes — I&apos;m safe, continue</span>
        <ArrowRight className="size-5 text-muted-foreground" aria-hidden />
      </button>
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        You do not need an account. Guidance is returned before anything is saved, and you can take
        the plan and leave.
      </p>
    </StepFrame>
  );
}

function CaptureStep({
  photo,
  onPhoto,
  onClear,
  onNext,
}: {
  photo: string | null;
  onPhoto: (url: string, name: string) => void;
  onClear: () => void;
  onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <StepFrame
      index="Step 2 of 4 · Capture"
      title="Evidence, if you have it"
      subtitle="A photo of graffiti, a screenshot, a note. Optional — skip it if photographing isn't safe or there's nothing to photograph."
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPhoto(URL.createObjectURL(f), f.name);
        }}
      />

      {photo ? (
        <div className="relative overflow-hidden rounded-lg border border-border">
          <img src={photo} alt="Attached evidence preview" className="w-full object-cover" />
          <button
            onClick={onClear}
            aria-label="Remove photo"
            className="absolute right-2 top-2 rounded-full bg-background/85 p-2"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface"
        >
          <Camera className="size-7 text-primary" aria-hidden />
          <span className="text-sm font-medium">Take or upload a photo</span>
          <span className="text-xs text-muted-foreground">
            Location metadata is stripped before storage
          </span>
        </button>
      )}

      <PrimaryButton onClick={onNext}>{photo ? "Continue" : "Skip — nothing to attach"}</PrimaryButton>
    </StepFrame>
  );
}

function LocateStep({
  coords,
  locating,
  onLocate,
  locationType,
  setLocationType,
  institution,
  setInstitution,
  onNext,
}: {
  coords: { lat: number; lng: number } | null;
  locating: boolean;
  onLocate: () => void;
  locationType: string;
  setLocationType: (v: string) => void;
  institution: string;
  setInstitution: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <StepFrame
      index="Step 3 of 4 · Locate"
      title="Where did it happen?"
      subtitle="Your exact position is used to route the report. Only a blurred point is ever shown publicly."
    >
      <button
        onClick={onLocate}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3.5"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Crosshair className="size-4 text-primary" aria-hidden />
          {coords
            ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
            : "Use my current location"}
        </span>
        {locating ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden />
        ) : coords ? (
          <Check className="size-4 text-primary" aria-hidden />
        ) : null}
      </button>
      {!coords && (
        <p className="mt-2 text-xs text-muted-foreground">
          If you skip this, the report is routed to Manhattan generally.
        </p>
      )}

      <div className="mt-6">
        <p className="label-caps">Setting</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {LOCATION_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setLocationType(t)}
              className={
                locationType === t
                  ? "rounded-full border border-primary bg-primary/15 px-3 py-1.5 text-xs font-semibold capitalize text-primary"
                  : "rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium capitalize text-muted-foreground"
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="institution" className="label-caps">
          Institution or employer (optional)
        </label>
        <input
          id="institution"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="University, employer, transit system…"
          className="mt-2 w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Naming the institution is what makes pattern evidence work later. Do not name individuals
          — SHOMER does not act on people.
        </p>
      </div>

      <PrimaryButton onClick={onNext}>Continue</PrimaryButton>
    </StepFrame>
  );
}

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
};

function DescribeStep({
  description,
  setDescription,
  dangerFlag,
  pending,
  error,
  onSubmit,
}: {
  description: string;
  setDescription: (v: string) => void;
  dangerFlag: boolean;
  pending: boolean;
  error: Error | null;
  onSubmit: () => void;
}) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const baseText = useRef("");

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    setSupported(true);
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    recognition.current = rec;
    return () => rec.stop();
  }, []);

  const toggleVoice = () => {
    const rec = recognition.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      setListening(false);
      return;
    }
    baseText.current = description ? description + " " : "";
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i]?.[0]?.transcript ?? "";
      setDescription(baseText.current + text);
    };
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  };

  return (
    <StepFrame
      index="Step 4 of 4 · Describe"
      title="What happened?"
      subtitle="Speak or type. What was said or done, when, who else was present, and whether this has happened before at this place."
    >
      {supported && (
        <button
          onClick={toggleVoice}
          className={
            listening
              ? "flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-primary-foreground"
              : "flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-3.5"
          }
        >
          {listening ? <MicOff className="size-4" aria-hidden /> : <Mic className="size-4 text-primary" aria-hidden />}
          <span className="text-sm font-medium">
            {listening ? "Listening — tap to stop" : "Speak instead of typing"}
          </span>
        </button>
      )}

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={8}
        placeholder="A man on the platform started shouting at my family after he saw my son's kippah…"
        className="mt-3 w-full resize-none rounded-lg border border-input bg-surface px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus:border-primary"
      />

      {dangerFlag && (
        <div className="mt-3 flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/15 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <div>
            <p className="text-sm font-semibold">This sounds like it may be ongoing.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Stop filling this in if there is a weapon, an injury, or the encounter is
              still happening.
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg border border-destructive/50 bg-destructive/15 p-3 text-xs text-foreground">
          {error.message || "Something went wrong generating your plan. Try again."}
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={description.trim().length < 10 || pending}
        className="mt-6 flex w-full items-center justify-between rounded-lg bg-primary px-5 py-4 text-primary-foreground disabled:opacity-40"
      >
        <span className="text-base font-semibold">
          {pending ? "Reading your report…" : "Get my plan"}
        </span>
        {pending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden />
        ) : (
          <ArrowRight className="size-5" aria-hidden />
        )}
      </button>
      <p className="mt-3 text-xs text-muted-foreground">
        SHOMER classifies conduct, not people. It will never label a named individual, and it will
        not help identify an anonymous account.
      </p>
    </StepFrame>
  );
}

const URGENCY_LABEL: Record<string, string> = {
  now: "Now",
  today: "Today",
  this_week: "This week",
};

function PlanStep({
  plan,
  saved,
  onDiscard,
}: {
  plan: IncidentPlan;
  saved: boolean;
  onDiscard: () => void;
}) {
  const tier = TIERS[plan.tier];
  return (
    <section className="px-5 pt-6">
      <TierBadge tier={plan.tier} />
      <h1 className="display-title mt-3 text-3xl">{plan.headline}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.summary}</p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Why this tier: </span>
        {plan.rationale}
        {plan.confidence < 0.6 && (
          <span className="ml-1 text-primary">
            Confidence is low — treat this classification as provisional.
          </span>
        )}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{tier.blurb}</p>

      {plan.immediate.length > 0 && (
        <div className="mt-6 rounded-lg border border-primary/40 bg-primary/10 p-4">
          <p className="label-caps text-primary">Do this first</p>
          <ul className="mt-2 space-y-2">
            {plan.immediate.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed">
                <span className="font-mono text-primary">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <p className="label-caps">The sequence</p>
        <ol className="mt-3 space-y-3">
          {plan.steps.map((s, i) => (
            <li key={i} className="panel p-4">
              <p className="label-caps text-primary">{s.window}</p>
              <p className="mt-1 text-sm font-medium leading-relaxed">{s.action}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.why}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6">
        <p className="label-caps">Who to contact, in order</p>
        <ul className="mt-3 space-y-2">
          {plan.contacts.map((c, i) => (
            <li key={i} className="panel flex items-start justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.what}</p>
                <p className="mt-1 font-mono text-xs text-primary">{c.detail}</p>
              </div>
              <span className="label-caps shrink-0 pt-0.5">
                {URGENCY_LABEL[c.urgency] ?? c.urgency}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {plan.deadlines.length > 0 && (
        <div className="mt-6">
          <p className="label-caps">Clocks that are already running</p>
          <ul className="mt-3 space-y-2">
            {plan.deadlines.map((d, i) => (
              <li key={i} className="flex justify-between gap-3 border-b border-border py-2 text-sm">
                <span>{d.label}</span>
                <span className="shrink-0 font-mono text-xs text-primary">{d.window}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 panel p-4">
        {saved ? (
          <>
            <p className="text-sm font-semibold">Logged anonymously.</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              This incident now sits in the 24-hour map as a blurred point, and counts toward the
              pattern evidence for this setting. No account, no name, no exact location.
            </p>
            <button
              onClick={onDiscard}
              className="mt-3 text-xs font-semibold text-muted-foreground underline"
            >
              I just needed the advice — don&apos;t count it
            </button>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            Understood. You can log it anonymously at any time — the ambiguous ones are exactly what
            makes the serious ones provable later.
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-3 pb-4">
        <Link
          to="/map"
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-center text-sm font-medium"
        >
          See the map
        </Link>
        <Link
          to="/report"
          reloadDocument
          className="flex-1 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
        >
          New report
        </Link>
      </div>

      <p className="pb-2 text-xs leading-relaxed text-muted-foreground">
        This is guidance, not legal advice. SHOMER surfaces deadlines and routes you to counsel; it
        does not advise, and it never publishes anything identifying another person.
      </p>
    </section>
  );
}
