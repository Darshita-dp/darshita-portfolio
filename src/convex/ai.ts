"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { KNOWLEDGE } from "../lib/aiKnowledge";
import OpenAI from "openai";

// Pick the top-k Q&As most relevant to the user's message via keyword overlap.
// The KNOWLEDGE entries already ship with a curated `keywords[]` array per item,
// so we lean on that rather than splitting the user text.
function selectRelevantQA<
  T extends { q: string; a: string; keywords?: string[] }
>(
  message: string,
  knowledge: Array<T>,
  k = 4
): Array<T> {
  const lower = message.toLowerCase();
  const scored = knowledge.map((item) => {
    const score = (item.keywords || []).reduce(
      (acc, kw) => (lower.includes(kw.toLowerCase()) ? acc + 1 : acc),
      0
    );
    return { item, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((s) => s.item);
}

// Always force-include an "introduction" Q&A so the model grounds itself, even
// when the user prompt is vague (e.g. "hi") and the keyword overlap is 0 for
// everything else.
function getBaseline(knowledge: typeof KNOWLEDGE): typeof KNOWLEDGE {
  const lq = (q: string) => q.toLowerCase();
  const intro = knowledge.find(
    (item) =>
      lq(item.q).includes("introduction") ||
      lq(item.q).includes("tell me about yourself")
  );
  return intro ? [intro] : [];
}

export const chat = action({
  args: {
    message: v.string(),
    conversationHistory: v.optional(v.array(v.object({
      role: v.string(),
      content: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        message: "AI is not configured yet. Please add the OPENROUTER_API_KEY environment variable.",
        success: false,
      };
    }

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://darshitas-portfolio.app",
        "X-Title": "Darshita's Portfolio",
      },
    });

    // Mini-RAG: combine the always-on intro baseline with the top-k keyword
    // matches, then dedupe so we never ship the same Q&A twice.
    const seen = new Set<string>();
    const selected = [...getBaseline(KNOWLEDGE), ...selectRelevantQA(args.message, KNOWLEDGE, 4)]
      .filter((item) => {
        if (seen.has(item.q)) return false;
        seen.add(item.q);
        return true;
      });

    const knowledgeContext = selected
      .map((item) => `Q: ${item.q}\nA: ${item.a}`)
      .join("\n\n");

    const systemPrompt = `You are Darshita's AI assistant, helping visitors learn about her background, skills, projects, and experience. You have access to the following Q&A knowledge base about Darshita (only entries that may match this question are included to stay within the model's context window):\n\n${knowledgeContext}\n\nGuidelines:\n- Be friendly, conversational, and helpful\n- Use the knowledge base to answer questions accurately\n- If asked about something not in the knowledge base, politely say you don't have that specific information and suggest they contact Darshita directly via LinkedIn\n- Keep responses concise but informative\n- Use emojis occasionally to match Darshita's friendly personality (🌼, ✨, 🎯, etc.)\n- If someone asks about projects, skills, or education, provide specific details from the knowledge base\n- Format your responses with proper markdown: use **bold** for emphasis, line breaks between sections, and bullet points for lists\n- When ending responses with a follow-up question, add TWO blank lines before it for proper spacing\n- Make your closing questions specific and contextual based on what was just discussed\n- Use the pattern: "main content here.\n\n\nContextual closing question?" (note the triple newline for spacing)`;

    // Truncate conversation history so a long chat doesn't refill our token
    // budget mid-conversation and trigger the same 402 error later.
    const recentHistory = (args.conversationHistory || []).slice(-6);

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...recentHistory.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: args.message },
    ];

    try {
      const completion = await client.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages,
        max_tokens: 500,
      });

      const responseText = completion.choices[0]?.message?.content || "No response";
      return {
        message: responseText,
        success: true,
      };
    } catch (error: any) {
      console.error("Error calling OpenRouter AI:", error);
      const errorMsg = error?.message || error?.toString?.() || "Unknown error";
      const statusInfo = error?.status ? ` (HTTP ${error.status})` : "";
      const codeInfo = error?.code ? ` [${error.code}]` : "";
      return {
        message: `I'm having trouble connecting right now${statusInfo}${codeInfo}: ${errorMsg}. Please try again in a moment, or feel free to reach out to Darshita directly on LinkedIn! 🌼`,
        success: false,
      };
    }
  },
});
