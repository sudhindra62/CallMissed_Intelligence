"use client";
import React, { useState, useCallback } from "react";
import { APIError } from "../../types";

interface UseImageGenerationReturn {
  imageUrl: string | null;
  isLoading: boolean;
  error: APIError | null;
  generateImage: (prompt: string) => Promise<void>;
  clearImage: () => void;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  // Initialize from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("last_generated_image");
    if (saved) {
      try {
        const { b64, prompt } = JSON.parse(saved);
        const byteCharacters = atob(b64);
        const byteArray = Uint8Array.from(byteCharacters, (c) => c.charCodeAt(0));
        const blob = new Blob([byteArray], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (e) {
        console.error("Failed to restore saved image", e);
      }
    }
  }, []);

  // Clean up object URLs to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const generateImage = useCallback(async (prompt: string) => {
    setError(null);
    setIsLoading(true);
    
    // Revoke old URL if it exists
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      if (data.b64_json) {
        // Persist to localStorage
        localStorage.setItem("last_generated_image", JSON.stringify({
          b64: data.b64_json,
          prompt,
          timestamp: Date.now()
        }));

        // Convert base64 to blob for display
        const byteCharacters = atob(data.b64_json);
        const byteArray = Uint8Array.from(byteCharacters, (c) => c.charCodeAt(0));
        const blob = new Blob([byteArray], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      }
    } catch (err: any) {
      console.error("Image Gen Error in hook:", err);
      setError({
        error: err.error || "Failed to generate image.",
        details: err.details || err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [imageUrl]);

  const clearImage = useCallback(() => {
    setImageUrl(null);
    setError(null);
    localStorage.removeItem("last_generated_image");
  }, []);

  return { imageUrl, isLoading, error, generateImage, clearImage };
}
