import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "@/lib/ai-gateway";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(DEFAULT_MODEL);
}

export const generateEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      recipient: z.string().max(200).optional().default(""),
      subject: z.string().max(300).optional().default(""),
      tone: z.string().max(40).default("professional"),
      intent: z.string().min(3).max(4000),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a workplace email writing assistant. Produce a clear, well-structured email. Respond only with the email body (no preamble, no markdown code fences). Include a Subject line at the very top in the format: Subject: <subject>.",
      prompt: `Recipient: ${data.recipient || "(unspecified)"}
Suggested subject: ${data.subject || "(none — write one)"}
Tone: ${data.tone}
What I want to communicate:
${data.intent}`,
    });
    return { text };
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      notes: z.string().min(10).max(20000),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a meeting notes summarizer. Output Markdown with sections: ## Summary, ## Key Decisions, ## Action Items (as a checklist with owner if mentioned), ## Open Questions. Be concise and faithful to the source.",
      prompt: data.notes,
    });
    return { text };
  });

export const planTasks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      goal: z.string().min(5).max(4000),
      deadline: z.string().max(100).optional().default(""),
      context: z.string().max(4000).optional().default(""),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an AI task planner. Break the goal into a prioritized plan. Output Markdown: a brief ## Strategy paragraph, then ## Tasks as a numbered list. Each task: title, why it matters, estimated effort (S/M/L), and suggested due date relative to today. End with ## Risks.",
      prompt: `Goal: ${data.goal}
Deadline: ${data.deadline || "(none)"}
Context: ${data.context || "(none)"}`,
    });
    return { text };
  });

export const research = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      topic: z.string().min(3).max(2000),
      depth: z.enum(["brief", "standard", "deep"]).default("standard"),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an AI research assistant for professionals. Produce a structured Markdown briefing: ## Overview, ## Key Points (bulleted), ## Considerations / Trade-offs, ## Suggested Next Steps. Be neutral. If you are not certain about facts, say so explicitly. Do not fabricate citations.",
      prompt: `Topic: ${data.topic}\nDepth: ${data.depth}`,
    });
    return { text };
  });
