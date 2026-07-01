import React from "react";
import { Button } from "../ui/button";
import { X, Download, MessageSquare } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  altText?: string;
  onDownload?: () => void;
  onShare?: () => void;
}

export function ImageModal({ isOpen, onClose, imageUrl, altText, onDownload, onShare }: ImageModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 max-w-7xl mx-auto">
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
           <img 
             src={imageUrl} 
             alt={altText || "Preview"} 
             className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-300" 
             onClick={(e) => e.stopPropagation()}
           />
        </div>

        <div className="flex items-center gap-4 p-4" onClick={(e) => e.stopPropagation()}>
          {onDownload && (
            <Button
              variant="secondary"
              className="gap-2 rounded-full px-6 py-5 shadow-xl hover:scale-105 transition-transform"
              onClick={onDownload}
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Save Image</span>
            </Button>
          )}
          {onShare && (
            <Button
              variant="secondary"
              className="gap-2 rounded-full px-6 py-5 shadow-xl hover:scale-105 transition-transform bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={onShare}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Send to Chat</span>
            </Button>
          )}
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 rounded-full w-12 h-12 shadow-xl hover:bg-muted"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
