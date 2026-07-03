"use node";
import { action } from "./_generated/server";
export const checkKey = action({
  args: {},
  handler: async () => {
    const key = process.env.VLY_INTEGRATION_KEY;
    return { exists: !!key, length: key ? key.length : 0, prefix: key ? key.substring(0, 5) : null };
  }
});
