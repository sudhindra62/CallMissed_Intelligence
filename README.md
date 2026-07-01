# CallMissed AI Studio

Professional AI Workspace powered by the CallMissed API.

## Overview

CallMissed AI Studio is a full-stack, next-generation AI assistant built to provide a polished, intuitive, and highly responsive workspace for interacting with advanced AI models. 

**Purpose:** To offer a seamless chat, vision, and image generation experience.
**Features:** Streaming text responses, image understanding, high-quality image generation, conversation persistence, and rich markdown support.
**Architecture Philosophy:** We prioritize security, performance, and developer experience. By utilizing Next.js App Router and Serverless Route Handlers, we ensure that sensitive API keys are never exposed to the client, while maintaining optimized production builds and seamless deployment.
**Target Users:** Professionals, developers, and creatives looking for a reliable and aesthetically pleasing AI interface.

## Live Demo

- **Production URL:** `[Insert Production URL Here]`
- **Demo Video:** `[Insert Link to Demo Video Here]`
- **Screenshots:**
  - `[Insert Chat Screenshot]`
  - `[Insert Image Generation Screenshot]`

## Features

- **AI Chat & Streaming:** Real-time text generation with typing effects.
- **Vision:** Upload or paste images for AI analysis and description.
- **Image Generation:** Create high-quality images from text prompts.
- **Markdown & Syntax Highlighting:** Beautifully rendered code blocks, tables, and lists.
- **Copy Code & Download Images:** One-click utility actions for all generated content.
- **Responsive Design:** Flawless experience across desktop, tablet, and mobile.
- **Dark Mode:** System-aware light and dark themes.
- **Accessibility:** Keyboard navigation, ARIA labels, and focus management.
- **Error Handling:** Graceful recovery with user-friendly error messages and retry states.
- **Security:** Server-side API key management, request validation, and rate limiting.
- **Performance:** Lazy loaded components, debounced rendering, and optimized state updates.

## Technology Stack

- **Next.js App Router:** Modern React framework utilizing Server Components and Serverless Route Handlers for an optimized full-stack architecture.
- **TypeScript:** Strict type checking across the entire stack.
- **Tailwind CSS:** Utility-first styling for rapid and consistent UI development.
- **shadcn/ui:** Beautifully designed, accessible, and customizable React components.
- **Framer Motion:** Smooth, hardware-accelerated animations.
- **OpenAI SDK:** Utilized to interface with the CallMissed API using compatible endpoints.
- **React Markdown:** Robust parsing and rendering of Markdown content.
- **Zod:** Schema declaration and payload validation.
- **Lucide:** Clean, consistent SVG icon pack.

## Application Architecture

- **Folder Structure:** Domain-driven organization (`src/components`, `src/features`, `src/lib/server`, etc.).
- **Route Handlers:** `/api/chat`, `/api/vision`, and `/api/image` handle rate limiting, Zod validation, and secure communication with the CallMissed API.
- **Server Components:** `app/layout.tsx` and `app/page.tsx` utilize React Server Components for optimal performance and SEO.
- **Client Components:** React components with `"use client"` directives strictly handle UI and local state.
- **Streaming Architecture:** Standard Web Streams (Server-Sent Events) pipe AI responses from the backend directly to the React frontend.
- **State Management:** React Context (`ConversationProvider`) manages global chat history and local storage synchronization.
- **Reusable Components:** `shadcn/ui` components provide a consistent design language.

## Project Structure

```text
.
├── src/
│   ├── app/                  # Next.js App Router pages and Route Handlers
│   │   ├── api/              # Serverless API Routes
│   │   ├── layout.tsx        # Root layout (Server Component)
│   │   └── page.tsx          # Main page
│   ├── components/           # UI Components
│   │   ├── chat/             # Chat interface (MessageList, ChatInput)
│   │   ├── image/            # Image generation interface
│   │   ├── layout/           # Sidebar, Header, AppLayout
│   │   └── ui/               # Reusable shadcn/ui components
│   ├── features/             # Feature-specific hooks (useChat)
│   ├── hooks/                # Global custom hooks (e.g., shortcuts)
│   ├── lib/                  # Shared utilities, API clients, and Backend logic (Rate limiting, Zod validation, Errors)
│   ├── providers/            # React Context providers (Theme, Conversations)
│   ├── types/                # Shared TypeScript interfaces
│   └── utils/                # Helper functions
├── public/                   # Static assets
└── package.json              # Project dependencies and scripts
```

## Installation

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd callmissed-ai-studio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local`:**
   Copy `.env.example` to `.env` or `.env.local` and add your API key.

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Production build:**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

- `CALLMISSED_API_KEY`: Your private CallMissed API Key.
  - **Security Note:** This key must remain server-side only. It is accessed exclusively in Route Handlers and `src/lib/callmissed.ts`. Never expose this key in client-side code (e.g., do not prefix with `NEXT_PUBLIC_`).

## CallMissed API

- **Base URL:** `https://api.callmissed.com/v1`
- **Required Models:**
  - `kimi-k2.7-code`: Used for Chat and Vision capabilities. It excels at coding tasks, logical reasoning, and complex image analysis.
  - `flux-2-klein-9b`: Used for high-fidelity, creative image generation.

## How Streaming Works

1. **Route Handlers:** The client POSTs to `/api/chat`.
2. **Server-side API:** The Next.js Route Handler calls the CallMissed API with `stream: true`.
3. **Streaming Responses:** As chunks arrive from the AI, the backend pipes them to the client via a standard Web Stream (SSE).
4. **Token Rendering:** The React frontend appends incoming tokens to the active message state.
5. **AbortController:** Users can stop generation, which triggers an abort signal, closing the HTTP connection and terminating the stream early.

## Image Generation

1. **Prompt:** The user inputs a detailed description.
2. **API Request:** The client sends the prompt to `/api/image`.
3. **Base64 decoding & Blob creation:** The backend requests a `b64_json` format, which the frontend converts into a Blob and Object URL for optimal rendering.
4. **Download:** Users can easily save the generated Blob to their local device.
5. **Rendering:** The image is displayed with a skeleton loader and smooth fade-in animations.

## Vision

1. **Upload/Paste:** Users attach images via file picker or clipboard paste.
2. **Preview:** The image is converted to a base64 string for immediate preview.
3. **Vision Request:** The image payload and text prompt are sent to `/api/vision`.
4. **Response Rendering:** The `kimi-k2.7-code` model analyzes the visual input and streams back a detailed textual description.

## Security

- **Route Handlers:** All AI API interactions are securely proxied through Next.js Serverless Route Handlers.
- **Hidden API Key:** The client has zero knowledge of the `CALLMISSED_API_KEY`.
- **Validation:** Zod schemas rigorously validate all incoming request bodies.
- **Rate Limiting:** IP-based in-memory rate limiting prevents abuse (e.g., 100 chat requests / 15 min).
- **Error Handling:** Internal server errors and AI gateway failures are caught, logged securely, and mapped to sanitized user-facing messages.

## Performance

- **Server Components:** Utilizes React Server Components (RSC) to reduce the client-side JavaScript bundle.
- **Lazy Loading:** Heavy components (Markdown renderer, Settings dialogs) use React.lazy or Next.js dynamic imports to reduce initial JS payload.
- **Memoization:** `React.memo` and `useCallback` prevent unnecessary re-renders of complex message lists during active streaming.
- **Image Optimization:** Base64 payloads are converted to Object URLs to prevent massive memory allocations in the DOM.
- **Streaming Optimization:** Message parsing is localized to the active stream, preventing O(n) re-renders on the entire chat history.

## Accessibility

- **Keyboard Support:** Full tab-navigation and custom shortcuts.
- **ARIA:** Proper `aria-labels`, `aria-expanded`, and roles applied to interactive elements.
- **Focus States:** High-contrast focus rings for visual clarity.
- **Semantic HTML:** Correct use of `<header>`, `<main>`, `<aside>`, and heading hierarchies.
- **Responsive Layout:** Mobile-first drawers and flexible flexbox/grid containers.

## Error Handling

- **Validation:** Zod schemas catch malformed payloads before they hit the external API.
- **Network Failures:** Handled gracefully with offline indicators and retry buttons.
- **Status Codes:**
  - `402`: Payment required / Insufficient credits.
  - `403`: Unauthorized.
  - `429`: Rate limit exceeded.
  - `unsupported_image_input`: Caught and explained cleanly.
- **Graceful Recovery:** Users receive a clear error toast/message and can modify their prompt and retry.

## Future Improvements

- **Authentication:** OAuth integrations (Google, GitHub) for user accounts.
- **Cloud Database:** Migrate from `localStorage` to PostgreSQL or Firestore.
- **Conversation Sync:** Real-time cross-device history syncing.
- **Model Selection:** UI dropdowns to switch between different foundation models.
- **Image Editing:** In-painting and out-painting capabilities.
- **Export Chat:** Download conversations as PDF or Markdown.
- **Team Collaboration:** Shared workspaces and prompt libraries.

## AI Usage Disclosure

This project was built with the assistance of advanced AI agents. 
- **AI Assistants Used:** Google DeepMind AI coding agent (powered by Gemini).
- **How they were used:** The agent assisted in architecture brainstorming, TypeScript refactoring, UI generation (shadcn/ui integration), and writing this comprehensive documentation.
- **Integrity:** All generated code was reviewed, tested, and manually verified for performance, security, and accessibility prior to final integration.

## License

MIT License

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [CallMissed API](https://callmissed.com/)
- [OpenAI Node SDK](https://github.com/openai/openai-node)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)
