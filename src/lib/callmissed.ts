import { OpenAI } from "openai";

// Helper to get CallMissed API client
export function getCallMissedClient() {
  const apiKey = process.env.CALLMISSED_API_KEY;

  if (!apiKey) {
    throw new Error(
      "CALLMISSED_API_KEY is missing. Please add it to your environment variables."
    );
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.callmissed.com/v1",
  });
}
