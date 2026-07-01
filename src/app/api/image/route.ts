import { NextRequest, NextResponse } from "next/server";
import { imageGenerationRequestSchema } from "../../../lib/server/validations";
import { imageRateLimiter } from "../../../lib/server/rateLimiter";
import { RateLimitError, ApiError } from "../../../lib/server/errors";
import { getCallMissedClient } from "../../../lib/callmissed";
import { handleRouteError } from "../../../lib/server/errorHandler";

export const maxDuration = 60; // Set timeout for serverless environments

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!imageRateLimiter.check(ip)) {
      throw new RateLimitError();
    }

    const body = await req.json();
    const { prompt } = imageGenerationRequestSchema.parse(body);

    const openai = getCallMissedClient();

    const response = await openai.images.generate({
      model: "flux-2-klein-9b",
      prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });

    const b64_json = response.data?.[0]?.b64_json;
    if (!b64_json) {
      throw new ApiError("No image data received from API.");
    }

    return NextResponse.json({ b64_json });
  } catch (error: any) {
    return handleRouteError(error);
  }
}
