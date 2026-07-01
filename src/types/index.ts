export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  image?: string; // Base64 or URL for vision
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ImageGenerationRequest {
  prompt: string;
}

export interface APIError {
  error: string;
  details?: string;
}
