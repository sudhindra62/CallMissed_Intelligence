import { NextRequest, NextResponse } from "next/server";
import { visionRequestSchema } from "../../../lib/server/validations";
import { chatRateLimiter } from "../../../lib/server/rateLimiter";
import { RateLimitError } from "../../../lib/server/errors";
import { getCallMissedClient } from "../../../lib/callmissed";
import { handleRouteError } from "../../../lib/server/errorHandler";

export const maxDuration = 60; // Set timeout for serverless environments

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!chatRateLimiter.check(ip)) {
      throw new RateLimitError();
    }

    const body = await req.json();
    const { messages } = visionRequestSchema.parse(body);

    const openai = getCallMissedClient();

    const response = await openai.chat.completions.create({
      model: "kimi-k2.7-code",
      messages: messages as any,
      stream: true,
      max_tokens: 1024,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
        } catch (streamError: any) {
          console.error("Stream error:", streamError);
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: streamError.message || "Stream error occurred" })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    return handleRouteError(error);
  }
}
