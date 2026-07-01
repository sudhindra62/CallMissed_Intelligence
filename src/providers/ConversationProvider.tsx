"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Conversation, ChatMessage } from "../types";
import { v4 as uuidv4 } from "uuid";

interface ConversationContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  createNewConversation: () => string;
  setActiveConversationId: (id: string | null) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  addMessageToConversation: (conversationId: string, message: ChatMessage) => void;
  deleteConversation: (id: string) => void;
  restoreConversation: () => void;
  clearConversations: () => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationIdState] = useState<string | null>(null);
  const [lastDeletedConversation, setLastDeletedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("callmissed_conversations");
      if (stored) {
        setConversations(JSON.parse(stored));
      }
      const storedActive = localStorage.getItem("callmissed_active_conversation_id");
      if (storedActive) {
        setActiveConversationIdState(storedActive);
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("callmissed_conversations", JSON.stringify(conversations));
    } catch (e) {
      console.error("Failed to save conversations to localStorage", e);
    }
  }, [conversations]);

  const setActiveConversationId = useCallback((id: string | null) => {
    setActiveConversationIdState(id);
    try {
      if (id) {
        localStorage.setItem("callmissed_active_conversation_id", id);
      } else {
        localStorage.removeItem("callmissed_active_conversation_id");
      }
    } catch (e) {
      console.error("Failed to save active conversation ID", e);
    }
  }, []);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: "New Conversation",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  }, [setActiveConversationId]);

  const updateConversation = useCallback((id: string, updates: Partial<Conversation>) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c))
    );
  }, []);

  const addMessageToConversation = useCallback((conversationId: string, message: ChatMessage) => {
    setConversations((prev) => {
      let isFirstUserMessage = false;
      const newConversations = prev.map((c) => {
        if (c.id === conversationId) {
          const updatedMessages = [...c.messages];
          // Replace message if it already exists (e.g., streaming)
          const existingIndex = updatedMessages.findIndex((m) => m.id === message.id);
          if (existingIndex >= 0) {
            updatedMessages[existingIndex] = message;
          } else {
            updatedMessages.push(message);
            if (message.role === "user" && updatedMessages.filter(m => m.role === "user").length === 1) {
              isFirstUserMessage = true;
            }
          }

          let newTitle = c.title;
          if (isFirstUserMessage && c.title === "New Conversation") {
             newTitle = message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "");
          }

          return { ...c, messages: updatedMessages, title: newTitle, updatedAt: Date.now() };
        }
        return c;
      });
      return newConversations.sort((a, b) => b.updatedAt - a.updatedAt);
    });
  }, []);

  const deleteConversation = useCallback((id: string) => {
    const convToDelete = conversations.find(c => c.id === id);
    if (convToDelete) {
      setLastDeletedConversation(convToDelete);
    }
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  }, [conversations, activeConversationId, setActiveConversationId]);

  const restoreConversation = useCallback(() => {
    if (lastDeletedConversation) {
      setConversations((prev) => [lastDeletedConversation, ...prev]);
      setActiveConversationId(lastDeletedConversation.id);
      setLastDeletedConversation(null);
    }
  }, [lastDeletedConversation, setActiveConversationId]);

  const clearConversations = useCallback(() => {
    setConversations([]);
    setActiveConversationId(null);
  }, [setActiveConversationId]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        createNewConversation,
        setActiveConversationId,
        updateConversation,
        addMessageToConversation,
        deleteConversation,
        restoreConversation,
        clearConversations,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error("useConversations must be used within a ConversationProvider");
  }
  return context;
}
