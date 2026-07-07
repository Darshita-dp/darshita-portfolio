"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { KNOWLEDGE } from "../lib/aiKnowledge";
import OpenAI from "openai";

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

    const knowledgeContext = KNOWLEDGE.map(item => `Q: ${item.q}\nA: ${item.a}`).join("\n\n");

    const systemPrompt = `You are Darshita's AI assistant, helping visitors learn about her background, skills, projects, and experience. You have access to the following knowledge base about Darshita:\n\n${knowledgeContext}\n\nGuidelines:\n- Be friendly, conversational, and helpful\n- Use the knowledge base to answer questions accurately\n- If asked about something not in the knowledge base, politely say you don't have that specific information and suggest they contact Darshita directly via LinkedIn\n- Keep responses concise but informative\n- Use emojis occasionally to match Darshita's friendly personality (🌼, ✨, 🎯, etc.)\n- If someone asks about projects, skills, or education, provide specific details from the knowledge base\n- Format your responses with proper markdown: use **bold** for emphasis, line breaks between sections, and bullet points for lists\n- When ending responses with a follow-up question, add TWO blank lines before it for proper spacing\n- Make your closing questions specific and contextual based on what was just discussed\n- Use the pattern: "main content here.\n\n\nContextual closing question?" (note the triple newline for spacing)`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...(args.conversationHistory || []).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
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