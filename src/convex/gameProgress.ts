import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const saveProgress = mutation({
  args: {
    sessionId: v.string(),
    unlockedProjects: v.array(v.string()),
    score: v.number(),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    // Check if progress already exists for this session
    const existing = await ctx.db
      .query("gameProgress")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        unlockedProjects: args.unlockedProjects,
        score: args.score,
        completed: args.completed,
      });
    } else {
      return await ctx.db.insert("gameProgress", {
        userId: user?._id,
        sessionId: args.sessionId,
        unlockedProjects: args.unlockedProjects,
        score: args.score,
        completed: args.completed,
      });
    }
  },
});

export const getProgress = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gameProgress")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .unique();
  },
});
