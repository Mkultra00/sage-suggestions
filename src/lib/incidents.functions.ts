import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const IntakeInput = z.object({
  description: z.string().min(3).max(4000),
  locationType: z.string().min(1).max(40),
  institution: z.string().max(120).optional().nullable(),
  lat: z.number(),
  lng: z.number(),
  occurredAt: z.string().optional(),
  evidenceNote: z.string().max(2000).optional().nullable(),
  save: z.boolean().default(true),
});

const PlanSchema = z.object({
  tier: z.enum(["T1", "T2", "T3", "T4"]),
  category: z.string(),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
  rationale: z.string(),
  headline: z.string(),
  immediate: z.array(z.string()).max(4),
  steps: z.array(
    z.object({
      window: z.string(),
      action: z.string(),
      why: z.string(),
    }),
  ),
  contacts: z.array(
    z.object({
      name: z.string(),
      what: z.string(),
      detail: z.string(),
      urgency: z.enum(["now", "today", "this_week"]),
    }),
  ),
  deadlines: z.array(z.object({ label: z.string(), window: z.string() })),
});

export type IncidentPlan = z.infer<typeof PlanSchema> & { incidentId: string | null };

const SYSTEM_PROMPT = `You are SHOMER, a triage and guidance engine for reports of antisemitic incidents in New York City.

You classify CONDUCT and recommend PROCESS. The tier describes the response required, not the moral gravity of what happened.

Tiers:
T1 — Emergency. Violence, weapons, credible threats to a person or building, doxxing of a home address, workplace or school. Response measured in minutes.
T2 — Urgent. Vandalism, swastikas or hate symbols on property, targeted online threats, property damage. Response measured in hours.
T3 — Standard. Harassment, slurs, defaced materials, hostile confrontation without violence. Response measured in days.
T4 — Pattern. Ambiguous, coded, deniable, or low-grade conduct. Individually unwinnable; valuable only as logged pattern evidence.

ABSOLUTE RULES — these override everything else:
1. Never state or imply that a named or identifiable individual is antisemitic. Never adjudicate a person. Describe conduct only.
2. Never help identify, unmask, name, or track an anonymous account or unknown individual.
3. Never name a suspect, even if the reporter names one. Refer to "the individual involved" or "the other party".
4. If the report indicates ongoing danger, injury, a weapon, or an active encounter, classify T1 and make the first immediate item calling 911.
5. Do not give legal advice. Surface deadlines and route to counsel.
6. If confidence is below 0.6, say plainly in the rationale that the classification is uncertain.

Guidance style: concrete, sequenced, time-bounded, no rhetoric. Preserve evidence, do not engage online accounts, aggregate reporting outperforms individual reporting.

Contacts should be drawn from the real routing rails for New York City, chosen for the tier and setting:
911; NYPD Hate Crime Task Force (646-610-5267); Secure Community Network Duty Desk (844-SCN-DESK); UJA-Federation of New York; ADL New York/New Jersey; the campus Title VI coordinator and Dean of Students for campus settings; employer HR plus the EEOC (300-day filing window) for workplace settings; the platform's reporting flow for online settings; a civil-rights attorney where a filing deadline exists.

Return 2 to 5 immediate items, 3 to 6 sequenced steps, 3 to 6 contacts, and any real deadlines.`;

export const analyzeIncident = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => IntakeInput.parse(input))
  .handler(async ({ data }): Promise<IncidentPlan> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured for this app.");

    const gateway = createLovableAiGatewayProvider(key);

    const prompt = [
      `Setting: ${data.locationType}`,
      data.institution ? `Institution or employer named by the reporter: ${data.institution}` : null,
      data.occurredAt ? `Occurred at: ${data.occurredAt}` : null,
      `Reporter's account: ${data.description}`,
      data.evidenceNote ? `Notes about attached evidence: ${data.evidenceNote}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const jsonInstruction = `Respond with ONLY a JSON object, no markdown fences, matching exactly:
{"tier":"T1|T2|T3|T4","category":"snake_case_category","confidence":0.0-1.0,"summary":"...","rationale":"...","headline":"...","immediate":["..."],"steps":[{"window":"Next 30 minutes","action":"...","why":"..."}],"contacts":[{"name":"...","what":"...","detail":"phone/url/office","urgency":"now|today|this_week"}],"deadlines":[{"label":"...","window":"..."}]}`;

    const result = await generateText({
      model: gateway("google/gemini-3.7-flash"),
      system: `${SYSTEM_PROMPT}\n\n${jsonInstruction}`,
      prompt,
    });

    const raw = result.text.replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/, "").trim();
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("Could not read a plan from the model.");
    const plan = PlanSchema.parse(JSON.parse(raw.slice(start, end + 1)));



    let incidentId: string | null = null;

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: row, error } = await supabaseAdmin
        .from("incidents")
        .insert({
          occurred_at: data.occurredAt ?? new Date().toISOString(),
          tier: plan.tier,
          category: plan.category,
          location_type: data.locationType,
          institution: data.institution || null,
          description: data.description,
          ai_summary: plan.summary,
          ai_confidence: plan.confidence,
          ai_rationale: plan.rationale,
          lat: data.lat,
          lng: data.lng,
          synthetic: false,
          saved: data.save,
        })
        .select("id")
        .single();

      if (error) throw error;
      incidentId = row.id;

      await supabaseAdmin.from("action_plans").insert({
        incident_id: incidentId,
        headline: plan.headline,
        immediate: plan.immediate,
        steps: plan.steps,
        contacts: plan.contacts,
        deadlines: plan.deadlines,
      });
    } catch (err) {
      console.error("Failed to persist incident", err);
    }

    return { ...plan, incidentId };
  });
