import { useEffect } from "react";
import { useConversations } from "../providers/ConversationProvider";

export function useKeyboardShortcuts(
  onFocusChat?: () => void,
  onToggleSidebar?: () => void
) {
  const { createNewConversation } = useConversations();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + / (Focus chat)
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        onFocusChat?.();
      }
      
      // Ctrl + K (New chat)
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        createNewConversation();
      }

      // Escape is usually handled locally by dialogs or modals, but we can do it if needed
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onFocusChat, onToggleSidebar, createNewConversation]);
}
