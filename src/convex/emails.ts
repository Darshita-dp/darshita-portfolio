"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
// @ts-ignore - Resend types may not be available during compilation but work at runtime
import { Resend } from "resend";

export const sendContactEmail = action({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set in environment variables");
      throw new Error("Email service is not configured. Please contact the site administrator.");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      console.log("Attempting to send email from:", args.email);
      console.log("Using API key:", process.env.RESEND_API_KEY?.substring(0, 10) + "...");
      
      const emailPayload = {
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["darshitapatel1506@gmail.com"],
        reply_to: args.email,
        subject: `Portfolio contact from ${args.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${args.name}</p>
          <p><strong>Email:</strong> ${args.email}</p>
          <p><strong>Message:</strong></p>
          <p>${args.message.replace(/\n/g, "<br>")}</p>
        `,
        text: `
New Contact Form Submission

From: ${args.name}
Email: ${args.email}

Message:
${args.message}
        `,
      };

      console.log("Email payload:", JSON.stringify(emailPayload, null, 2));

      const { data, error } = await resend.emails.send(emailPayload);

      if (error) {
        console.error("Resend API error details:", JSON.stringify(error, null, 2));
        throw new Error(`Failed to send email: ${JSON.stringify(error)}`);
      }

      console.log("Email sent successfully:", data?.id);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error("Email sending error:", error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  },
});