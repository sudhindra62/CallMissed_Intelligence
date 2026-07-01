import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Card } from "../ui/card";
import { Key, Shield, Cpu, BookOpen, ExternalLink, Info } from "lucide-react";
import { Badge } from "../ui/badge";

export function HelpDialogContent() {
  return (
    <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-md">
      <div className="bg-gradient-to-b from-primary/10 to-background p-6 pb-4">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 border border-primary/20">
            <Info className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            CallMissed API Guide
          </DialogTitle>
        </DialogHeader>
      </div>

      <div className="p-6 pt-2 space-y-6 overflow-y-auto max-h-[60vh]">
        <div className="space-y-4">
          <Card className="p-4 bg-muted/40 border-muted-foreground/20 space-y-3">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">API Key Configuration</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  To use this application, you need a CallMissed API key. You can obtain one from the official developer portal.
                </p>
                <a
                  href="https://docs.callmissed.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-2 font-medium transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  docs.callmissed.com
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-muted/40 border-muted-foreground/20 space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-success mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Security First</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Your API key is never exposed to the browser. All API requests are securely proxied through our server-side infrastructure. Keep your <code>CALLMISSED_API_KEY</code> safe and never share it publicly.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-muted/40 border-muted-foreground/20 space-y-3">
            <div className="flex items-start gap-3">
              <Cpu className="w-5 h-5 text-primary mt-0.5" />
              <div className="w-full">
                <h4 className="font-medium text-foreground">Powered By</h4>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Chat & Vision</span>
                    <Badge variant="secondary" className="font-mono text-xs">kimi-k2.7-code</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Image Gen</span>
                    <Badge variant="secondary" className="font-mono text-xs">flux-2-klein-9b</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DialogContent>
  );
}
