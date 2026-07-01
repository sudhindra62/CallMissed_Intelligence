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
  } else if (error.status) {
    statusCode = error.status;
    if (statusCode === 401 || statusCode === 403) errorMessage = "Invalid or missing API key.";
    else if (statusCode === 402) errorMessage = "Payment required / insufficient credits.";
    else if (statusCode === 429) errorMessage = "Rate limit exceeded. Please try again later.";
    else if (statusCode === 413) errorMessage = "Payload too large.";
    else errorMessage = error.message || "An error occurred with the AI service.";
  }

  if (process.env.NODE_ENV === 'development' || statusCode >= 500) {
    console.error(`[API Error] ${errorMessage}`, error);
  }

  return NextResponse.json({ error: errorMessage, details }, { status: statusCode });
};
