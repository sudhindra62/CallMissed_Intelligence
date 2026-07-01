import React from "react";
import { Button } from "../ui/button";

interface VisionPreviewProps {
  image: string;
  imageInfo: { name: string; size: string; dimensions: string } | null;
  onReplace: () => void;
  onRemove: () => void;
}

export function VisionPreview({ image, imageInfo, onReplace, onRemove }: VisionPreviewProps) {
  return (
    <div className="flex items-center gap-4 bg-background border p-2 rounded-lg mb-2">
      <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-muted">
        <img src={image} alt="Upload preview" className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-sm font-medium text-foreground truncate">
          {imageInfo?.name || "Pasted image"}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
          <span>{imageInfo?.size || "Unknown size"}</span>
          <span className="w-1 h-1 rounded-full bg-border inline-block"></span>
          <span>{imageInfo?.dimensions || "Unknown dimensions"}</span>
        </p>
      </div>
      
      <div className="flex flex-col gap-1 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
          onClick={onReplace}
        >
          Replace
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
