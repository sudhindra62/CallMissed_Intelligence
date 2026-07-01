"use client";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { ChatMessage, APIError } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { useConversations } from "../../providers/ConversationProvider";

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: APIError | null;
  sendMessage: (content: string, image?: string) => Promise<void>;
  stopGeneration: () => void;
  clearMessages: () => void;
  retryMessage: () => Promise<void>;
}

export function useChat(): UseChatReturn {
  const { activeConversation, addMessageToConversation, activeConversationId, createNewConversation } = useConversations();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messages = useMemo(() => activeConversation?.messages || [], [activeConversation?.messages]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const invokeApi = useCallback(async (apiMessagesContext: ChatMessage[], conversationId: string) => {
    setError(null);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    const assistantMessageId = uuidv4();
    
    let assistantContent = "";
    const assistantMessage: ChatMessage = { id: assistantMessageId, role: "assistant", content: assistantContent };
    addMessageToConversation(conversationId, assistantMessage);

    try {
      const apiMessages = apiMessagesContext.map((msg) => {
        if (msg.image && msg.role === "user") {
          return {
            role: msg.role,
            content: [
              { type: "text", text: msg.content || "Describe this image in detail." },
              {
                type: "image_url",
                image_url: {
                  url: msg.image,
                },
              },
            ],
          };
        }
        return {
          role: msg.role,
          content: msg.content,
        };
      });

      const hasImage = apiMessages.some(msg => typeof msg.content !== 'string' && Array.isArray(msg.content));
      const endpoint = hasImage ? "/api/vision" : "/api/chat";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch (e) {
          errorData = { error: "Server Error", details: text || response.statusText || `Request failed with status ${response.status}` };
        }
        throw errorData;
      }

      if (!response.body) throw new Error("No response body stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.trim().startsWith("data: ") && line.trim() !== "data: [DONE]") {
              let parsedData = null;
              try {
                parsedData = JSON.parse(line.trim().slice(6));
              } catch (e) {
                console.error("Error parsing stream data:", e, "Line:", line);
              }
              
              if (parsedData) {
                if (parsedData.error) {
                  throw parsedData;
                }
                if (parsedData.content) {
                  assistantContent += parsedData.content;
                  addMessageToConversation(conversationId, { ...assistantMessage, content: assistantContent });
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
         console.log('Fetch aborted');
         return;
      }
      console.error("Chat Error in hook (full object):", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      setError({
        error: err.error || "Failed to communicate with the AI.",
        details: err.details || err.message || "An unknown error occurred during the request.",
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [addMessageToConversation]);

  const sendMessage = useCallback(
    async (content: string, image?: string) => {
      let conversationId = activeConversationId;
      if (!conversationId) {
        conversationId = createNewConversation();
      }

      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: "user",
        content,
        image,
      };

      addMessageToConversation(conversationId, userMessage);
      
      const newMessagesContext = [...messages, userMessage];
      await invokeApi(newMessagesContext, conversationId);
    },
    [activeConversationId, messages, addMessageToConversation, invokeApi, createNewConversation]
  );

  const retryMessage = useCallback(async () => {
    if (!activeConversationId || messages.length === 0) return;
    
    // Determine the context for retry. It should be all messages up to the last user message.
    let lastUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }
    
    if (lastUserIndex === -1) return;
    
    const contextMessages = messages.slice(0, lastUserIndex + 1);
    await invokeApi(contextMessages, activeConversationId);
  }, [activeConversationId, messages, invokeApi]);

  const clearMessages = useCallback(() => {
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return { messages, isLoading, error, sendMessage, stopGeneration, clearMessages, retryMessage };
}


