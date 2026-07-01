import { z } from "zod";

export const chatRequestSchema = z.object({
  messages: z.array(z.any()),
});

export const visionRequestSchema = z.object({
  messages: z.array(z.any()),
});

export const imageGenerationRequestSchema = z.object({
  prompt: z.string().min(1),
});
