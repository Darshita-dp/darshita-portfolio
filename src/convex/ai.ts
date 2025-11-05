"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { KNOWLEDGE } from "../lib/aiKnowledge";

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
      throw new Error("OPENROUTER_API_KEY is not configured. Please add it in the API Keys tab.");
    }

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
- If someone asks about projects, skills, or education, provide specific details from the knowledge base`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(args.conversationHistory || []),
      { role: "user", content: args.message },
    ];

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.CONVEX_SITE_URL || "https://darshita-portfolio.com",
          "X-Title": "Darshita's Portfolio Chat",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("OpenRouter API error:", error);
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        message: data.choices[0].message.content,
        success: true,
      };
    } catch (error) {
      console.error("Error calling OpenRouter:", error);
      return {
        message: "I'm having trouble connecting right now. Please try again in a moment, or feel free to reach out to Darshita directly on LinkedIn! 🌼",
        success: false,
      };
    }
  },
});