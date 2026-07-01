import { ZodError } from "zod";
import { AppError } from "./errors";
import { NextResponse } from "next/server";

export const handleRouteError = (error: any) => {
  let statusCode = 500;
  let errorMessage = "An unexpected error occurred.";
  let details: any = undefined;

  if (error instanceof ZodError) {
    statusCode = 400;
    errorMessage = "Validation Error";
    details = error.issues;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    errorMessage = error.message;
    details = error.details;
  } else if (error instanceof Error) {
    statusCode = (error as any).status || (error as any).statusCode || 500;
    errorMessage = error.message;
    details = (error as any).details || (error as any).cause;
  } else if (error.status || error.statusCode) {
    statusCode = error.status || error.statusCode;
    if (statusCode === 401 || statusCode === 403) errorMessage = "Invalid or missing API key.";
    else if (statusCode === 402) errorMessage = "Payment required / insufficient credits.";
    else if (statusCode === 404) errorMessage = "Resource not found.";
    else if (statusCode === 408) errorMessage = "Request timeout.";
    else if (statusCode === 429) errorMessage = "Rate limit exceeded. Please try again later.";
    else if (statusCode === 413) errorMessage = "Payload too large.";
    else if (statusCode === 503) errorMessage = "Service unavailable.";
    else if (error?.code === 'unsupported_image_input') errorMessage = "Unsupported image input.";
    else errorMessage = error.message || "An error occurred with the AI service.";
  }

  if (process.env.NODE_ENV === 'development' || statusCode >= 500) {
    console.error(`[API Error] ${errorMessage}`, error);
  }

  return NextResponse.json({ error: errorMessage, details }, { status: statusCode });
};
