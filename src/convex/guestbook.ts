import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addEntry = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("guestbook", {
      name: args.name,
      email: args.email,
      message: args.message,
      approved: false, // Require approval for moderation
    });
  },
});

export const getApprovedEntries = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("guestbook")
      .withIndex("by_approved", (q) => q.eq("approved", true))
      .order("desc")
      .take(50);
  },
});

export const approveEntry = mutation({
  args: { id: v.id("guestbook") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { approved: true });
  },
});
