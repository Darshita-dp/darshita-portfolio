import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const trackEvent = mutation({
  args: {
    event: v.string(),
    mode: v.optional(v.string()),
    projectId: v.optional(v.string()),
    metadata: v.optional(v.object({
      userAgent: v.optional(v.string()),
      referrer: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analytics", args);
  },
});

export const getEventCounts = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("analytics").collect();
    const counts = events.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  },
});

export const getOpenModeCounts = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("analytics").collect();
    const counts: Record<string, number> = {};
    for (const e of events) {
      if (e.event === "open_mode" && e.mode) {
        counts[e.mode] = (counts[e.mode] || 0) + 1;
      }
    }
    // Ensure all modes exist in the object (default 0)
    const result: Record<string, number> = {
      classic: counts.classic ?? 0,
      story: counts.story ?? 0,
      play: counts.play ?? 0,
      ai: counts.ai ?? 0,
    };
    return result;
  },
});