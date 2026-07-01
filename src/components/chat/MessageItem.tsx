"use client"
import React, { useState, memo } from 'react'
import { ChatMessage } from '@/types'
import { cn } from '@/lib/utils'
import { Check, Copy, RefreshCw, ThumbsDown, ThumbsUp, User, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer').then(mod => mod.MarkdownRenderer), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted/50 h-4 w-32 rounded" />
})

export const MessageItem = memo(function MessageItem({ message, isLoading }: { message: ChatMessage, isLoading?: boolean }) {
  const isUser = message.role === 'user'
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content as string)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group w-full py-6")}
    >
      <div className="max-w-3xl mx-auto flex gap-5 px-4">
        <div className="shrink-0 pt-1">
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
            isUser ? "bg-muted/50 text-muted-foreground border border-border" : "bg-gradient-to-br from-primary via-primary/80 to-accent shadow-glow-primary border border-primary/20"
          )}>
            {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-primary-foreground" />}
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-hidden min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[13px] tracking-wide text-foreground">
              {isUser ? 'You' : 'CallMissed AI'}
            </span>
            <span className="text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              Just now
            </span>
          </div>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border text-[15px] text-foreground/90">
            {isLoading && !message.content ? (
              <div className="flex items-center gap-1.5 h-6">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
              </div>
            ) : (
              message.content ? (
                <MarkdownRenderer content={message.content as string} />
              ) : null
            )}
          </div>

          {message.image && (
            <div className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={message.image} 
                alt="Uploaded" 
                className="max-w-sm w-full rounded-2xl border border-border/80 shadow-soft object-contain"
              />
            </div>
          )}

          {!isUser && !isLoading && (
            <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-muted/80" onClick={handleCopy} title="Copy">
                {isCopied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
})

