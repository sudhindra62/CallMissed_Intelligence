# Security

## API Protection
The `CALLMISSED_API_KEY` is exclusively handled on the server side (Route Handlers and `src/lib/callmissed.ts`). It is never bundled into the client application. All AI capabilities are accessed by the client exclusively through first-party proxies (`/api/chat`, `/api/vision`, `/api/image`).

## Environment Variables
The application distinguishes between server-side environment variables and client-side (prefixed with `NEXT_PUBLIC_`). No secrets are exposed to the browser. The AI API key is validated during server operations, preventing the application from interacting with APIs in an insecure or misconfigured state.

## Route Handlers
The Next.js Serverless Route Handlers act as a security barrier between the client and the upstream AI provider. They are responsible for extracting the payload, validating it, enforcing rate limits, and communicating securely with the AI endpoint. 

## Request Validation
All incoming API payloads are strictly validated using `Zod` schemas (`src/lib/server/validations.ts`).
- **Chat/Vision:** Requires an array of valid message objects containing specific text or image URL structures. Empty requests are rejected.
- **Image Generation:** The prompt is trimmed, checked for minimum length, and restricted to a maximum length (4000 characters) to prevent abuse and excessively large payload processing.
Invalid payloads immediately return a 400 Bad Request error.

## Rate Limiting
A lightweight, sliding window in-memory rate limiter (`src/lib/server/rateLimiter.ts`) is implemented to prevent abuse and denial-of-service attempts.
- **Chat/Vision:** Limited to 100 requests per 15-minute window per IP.
- **Image Generation:** Limited to 20 requests per 15-minute window per IP, as it is generally a more expensive operation.
Requests exceeding these limits immediately return a 429 Too Many Requests error.

## Error Handling
The application uses a centralized error handling architecture (`src/lib/server/errors.ts` and `src/lib/server/errorHandler.ts`).
- Errors are mapped to user-friendly messages based on status codes.
- Sensitive backend stack traces, underlying API responses, and detailed internal errors are masked from the client.
- Detailed errors are securely logged server-side only in development environments or for 500-level fatal exceptions.

## Image Validation
The `/api/vision` route and the client-side uploader apply limitations to base64 payload processing. Route Handlers use Next.js configuration or manual limits to prevent memory exhaustion attacks via massive image uploads.

## Secure Deployment Considerations
- In a production environment (like Google Cloud Run), the application reads client IP addresses via `req.headers.get("x-forwarded-for")`.
- TLS/SSL (HTTPS) must be enforced at the ingress level to ensure all traffic, including API keys and chat logs, is encrypted in transit.
