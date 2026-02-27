"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { KNOWLEDGE } from "../lib/aiKnowledge";
import { vly } from "../lib/vly-integrations";

export const chat = action({
  args: {
    message: v.string(),
    conversationHistory: v.optional(v.array(v.object({
      role: v.string(),
      content: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    // Build context from knowledge base
    const knowledgeContext = KNOWLEDGE.map(item => `Q: ${item.q}\nA: ${item.a}`).join("\n\n");
    
    const systemPrompt = `You are Darshita's AI assistant, helping visitors learn about her background, skills, projects, and experience. You have access to the following knowledge base about Darshita:

${knowledgeContext}

Guidelines:
- Be friendly, conversational, and helpful
- Use the knowledge base to answer questions accurately
- If asked about something not in the knowledge base, politely say you don't have that specific information and suggest they contact Darshita directly via LinkedIn
- Keep responses concise but informative
- Use emojis occasionally to match Darshita's friendly personality (🌼, ✨, 🎯, etc.)
- If someone asks about projects, skills, or education, provide specific details from the knowledge base
- Format your responses with proper markdown: use **bold** for emphasis, line breaks between sections, and bullet points for lists
- When ending responses with a follow-up question, add TWO blank lines before it for proper spacing
- Make your closing questions specific and contextual based on what was just discussed (e.g., "Would you like to know more about her other projects?" or "Interested in learning about her technical skills?")
- Use the pattern: "main content here.\n\n\nContextual closing question?" (note the triple newline for spacing)`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...(args.conversationHistory || []).map(m => ({ role: m.role as 'system' | 'user' | 'assistant', content: m.content })),
      { role: "user" as const, content: args.message },
    ];

    try {
      const result = await vly.ai.completion({
        model: 'gpt-4o-mini',
        messages: messages,
        maxTokens: 500,
      });

      if (result.success && result.data) {
        return {
          message: result.data.choices[0]?.message?.content || "No response",
          success: true,
        };
      } else {
        console.error("Vly AI error:", result.error);
        throw new Error(result.error || "Request failed");
      }
    } catch (error) {
      console.error("Error calling AI:", error);
      return {
        message: "I'm having trouble connecting right now. Please try again in a moment, or feel free to reach out to Darshita directly on LinkedIn! 🌼",
        success: false,
      };
    }
  },
});