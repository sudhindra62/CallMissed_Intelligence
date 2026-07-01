import { z } from "zod";

const messageRoleSchema = z.enum(["user", "assistant", "system"]);

const messageContentSchema = z.union([
  z.string(),
  z.array(
    z.union([
      z.object({
        type: z.literal("text"),
        text: z.string(),
      }),
      z.object({
        type: z.literal("image_url"),
        image_url: z.object({
          url: z.string().min(1),
        }),
      }),
    ])
  )
]);

export const chatMessageSchema = z.object({
  role: messageRoleSchema,
  content: messageContentSchema,
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1, "Messages array must contain at least one message"),
});

export const visionRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1, "Messages array must contain at least one message"),
});

export const imageGenerationRequestSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required").max(4000, "Prompt is too long"),
});
