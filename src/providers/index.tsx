"use client";

import React from "react";
import { ConversationProvider } from "./ConversationProvider";
import { ThemeProvider } from "./ThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <ConversationProvider>
        {children}
      </ConversationProvider>
    </ThemeProvider>
  );
}
