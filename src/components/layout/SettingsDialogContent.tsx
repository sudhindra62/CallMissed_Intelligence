import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useTheme } from "../../providers/ThemeProvider";
import { useConversations } from "../../providers/ConversationProvider";
import { Monitor, Moon, Sun, Trash2, Info } from "lucide-react";
import { toast } from "sonner";

export function SettingsDialogContent() {
  const { theme, setTheme } = useTheme();
  const { clearConversations } = useConversations();

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-6 py-4">
        <div className="space-y-4">
          <h4 className="text-sm font-medium leading-none">Appearance</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant={theme === "light" ? "default" : "outline"}
              className="w-full flex items-center gap-2"
              onClick={() => setTheme("light")}
            >
              <Sun className="w-4 h-4" />
              Light
            </Button>
            <Button 
              variant={theme === "dark" ? "default" : "outline"}
              className="w-full flex items-center gap-2"
              onClick={() => setTheme("dark")}
            >
              <Moon className="w-4 h-4" />
              Dark
            </Button>
            <Button 
              variant={theme === "system" ? "default" : "outline"}
              className="w-full flex items-center gap-2"
              onClick={() => setTheme("system")}
            >
              <Monitor className="w-4 h-4" />
              System
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium leading-none">Data Management</h4>
          <Button 
            variant="destructive" 
            className="w-full flex items-center gap-2"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all conversations? This cannot be undone.")) {
                clearConversations();
                toast.success("All conversations cleared");
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
            Clear All Conversations
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium leading-none">Shortcuts</h4>
          <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
            <div>Send Message</div>
            <div className="text-right"><kbd className="px-1.5 py-0.5 border rounded-md text-xs font-mono">Enter</kbd></div>
            <div>New Line</div>
            <div className="text-right"><kbd className="px-1.5 py-0.5 border rounded-md text-xs font-mono">Shift+Enter</kbd></div>
            <div>Close Modals</div>
            <div className="text-right"><kbd className="px-1.5 py-0.5 border rounded-md text-xs font-mono">Escape</kbd></div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Info className="w-4 h-4" /> Version</span>
            <span>v1.0.0</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Powered by</span>
            <span>Kimi & Flux</span>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
