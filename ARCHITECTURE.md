# Architecture

## Application Overview
CallMissed AI is a full-stack Next-generation AI assistant built using Next.js App Router, React, TypeScript, and Tailwind CSS. It communicates securely via Serverless Route Handlers with the CallMissed AI APIs for chat, vision, and image generation using streaming responses.

## Folder Structure
- `src/app`: Next.js App Router root, containing pages, layouts, and `api` Route Handlers.
- `src/components`: UI components organized by domain (`chat`, `image`, `layout`, `ui`, `common`).
- `src/features`: Complex feature implementations, primarily hooks encapsulating logic (`chat/useChat.ts`).
- `src/hooks`: Global custom React hooks (e.g., `useKeyboardShortcuts.ts`).
- `src/providers`: React context providers (e.g., `ThemeProvider.tsx`, `ConversationProvider.tsx`).
- `src/lib/server`: Backend utilities such as Zod validation schemas, custom error classes, and rate limiters.
- `src/lib`: Common library functions like utility wrappers for the AI client.
- `src/types`: TypeScript interfaces shared across the application.

## Component Hierarchy
- `App` -> `ThemeProvider`, `ConversationProvider` -> `AppLayout` -> `Sidebar`, `Header`, `<Main Content>`
- `<Main Content>` branches into `ChatInterface` or `ImageGenerationInterface`.
- `ChatInterface` -> `MessageList` (renders `MessageItem` -> `MarkdownRenderer`), `ChatInput` (with file upload).

## Data Flow
1. **User Input:** User interacts via `ChatInput` (text, image, shortcuts).
2. **Local State:** `ConversationProvider` synchronizes local conversational state and persists it to `localStorage`.
3. **Backend Request:** `useChat` hook pushes new messages to state and sends a POST request to `/api/chat` or `/api/vision`.
4. **Validation:** Zod schemas in `src/lib/server` validate the incoming payload. Rate limiting ensures fair use.
5. **Upstream Request:** The Route Handler securely attaches the API key and calls the AI provider.
6. **Streaming Response:** The Route Handler streams the AI response back to the client using standard Web Streams (Server-Sent Events).
7. **Client Rendering:** `useChat` processes the SSE stream, continuously updating the message state which React efficiently re-renders via `MessageItem` and `MarkdownRenderer`.

## Performance Decisions
- **React.memo:** Used on heavy components like `MessageItem` to prevent unnecessary re-renders during streaming.
- **Lazy Loading:** Dialogs (`SettingsDialogContent`, `HelpDialogContent`) and the heavy `MarkdownRenderer` are lazily loaded using `React.lazy` and `Suspense` to keep initial bundle size small.
- **Debounced Resizing:** Input fields utilize native scrollHeight for auto-resizing without heavy recalculations.

## Engineering Trade-offs
- **In-Memory Rate Limiting:** A lightweight in-memory rate limiter is used over Redis for simplicity and ease of deployment, recognizing that it resets on container restart.
- **localStorage for Persistence:** Chose local storage over a database to achieve zero-login functionality and reduce infrastructure requirements, at the cost of cross-device syncing.

## Future Improvements
- **Database Persistence:** Introduce a persistent datastore (e.g., PostgreSQL or Firestore) and authentication (OAuth) for cross-device syncing.
- **Redis Rate Limiting:** Implement a distributed rate limiter for multi-instance deployments.
- **Enhanced Markdown Support:** Add math rendering (`remark-math`, `rehype-katex`) and flowchart rendering (`mermaid`).
