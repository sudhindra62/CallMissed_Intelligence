"use client"
import React, { useState, useRef, useEffect } from 'react'
import { ArrowUp, Image as ImageIcon, X, Paperclip, Mic, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { VisionPreview } from './VisionPreview'

interface ChatInputProps {
  onSend: (message: string, image?: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [image, setImage] = useState<string | undefined>()
  const [imageInfo, setImageInfo] = useState<{ name: string; size: string; dimensions: string; format: string } | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAndSetImage = (file?: File) => {
    setImageError(null)
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setImageError("Only JPEG, PNG, WEBP, and GIF images are supported.")
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setImageError("Image must be less than 4MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        setImage(dataUrl);
        setImageInfo({
          name: file.name || "Pasted image",
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          dimensions: `${img.width}x${img.height}`,
          format: file.type.split("/")[1].toUpperCase()
        });
      };
      img.onerror = () => {
        setImageError("Failed to load image. The file may be corrupted.");
      };
      img.src = dataUrl;
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if ((input.trim() || image) && !isLoading) {
      onSend(input, image)
      setInput('')
      setImage(undefined)
      setImageInfo(null)
      setImageError(null)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSetImage(e.target.files?.[0])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      validateAndSetImage(file)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const file = e.clipboardData.files?.[0]
    if (file && file.type.startsWith('image/')) {
      validateAndSetImage(file)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  return (
    <div 
      className="w-full mx-auto relative flex flex-col gap-2"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn(
        "w-full relative flex flex-col gap-2 rounded-[24px] border bg-card/60 backdrop-blur-xl transition-all duration-300 shadow-soft",
        isFocused ? "border-primary/40 shadow-glow-primary ring-1 ring-primary/20" : "border-border/80 hover:border-border",
        isDragging && "border-primary border-dashed bg-primary/5 overflow-hidden",
        image && "pt-3 px-3"
      )}>
        {isDragging && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none rounded-[24px]">
            <div className="flex flex-col items-center gap-2 text-primary">
              <ImageIcon className="w-8 h-8 animate-bounce" />
              <span className="font-medium">Drop image to attach</span>
            </div>
          </div>
        )}
        <AnimatePresence>
          {imageError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pt-2 text-destructive text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {imageError}
            </motion.div>
          )}
          {image && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <VisionPreview
                image={image}
                imageInfo={imageInfo}
                onReplace={() => fileInputRef.current?.click()}
                onRemove={() => {
                  setImage(undefined);
                  setImageInfo(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className={cn("relative flex items-end w-full", !image && "p-1.5")}>
          <div className="flex items-center gap-1 pl-2 pb-1.5 shrink-0">
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              aria-label="Attach image"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/80 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              title="Attach image (Drag & Drop or Paste supported)"
              aria-label="Attach image (Drag & Drop or Paste supported)"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onPaste={handlePaste}
            placeholder="Ask anything..."
            className="min-h-[52px] max-h-[200px] w-full resize-none border-0 bg-transparent px-3 py-3.5 focus-visible:ring-0 text-[15px] leading-relaxed placeholder:text-muted-foreground focus:outline-none"
            rows={1}
            disabled={isLoading}
            aria-label="Chat input message"
          />
          
          <div className="flex items-center gap-2 pr-2 pb-1.5 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/80 transition-colors md:hidden"
              disabled={isLoading}
              aria-label="Voice input"
            >
              <Mic className="h-5 w-5" />
            </Button>

            <Button
              type="button"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center",
                (input.trim() || image) && !isLoading
                  ? "bg-gradient-to-br from-primary to-accent text-primary-foreground hover:scale-[1.05] hover:shadow-glow-primary active:scale-95 border border-primary/20"
                  : "bg-muted/50 text-muted-foreground cursor-not-allowed border border-transparent"
              )}
              onClick={handleSubmit}
              disabled={(!input.trim() && !image) || isLoading}
              aria-label="Send message"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-muted-foreground">
        <Sparkles className="w-3 h-3 text-muted-foreground/70" />
        <span>CallMissed can make mistakes. Verify important information.</span>
      </div>
    </div>
  )
}

