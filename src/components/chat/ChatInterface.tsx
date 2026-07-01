"use client"
import React, { useRef, useEffect, useState } from 'react'
import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import { EmptyConversation } from './EmptyConversation'
import { useChat } from '@/features/chat/useChat'
import { useConversations } from '@/providers/ConversationProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, RefreshCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

export function ChatInterface() {
  const { messages, isLoading, error, sendMessage, stopGeneration, retryMessage } = useChat()
  const { activeConversationId } = useConversations()
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  useEffect(() => {
    if (error) {
      toast.error(error.error || "An error occurred", {
        description: error.details,
      })
    }
  }, [error])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100
    setShowScrollToBottom(!isAtBottom)
  }

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!showScrollToBottom) {
      scrollToBottom()
    }
  }, [messages, showScrollToBottom])

  return (
    <div className="flex flex-col h-full bg-background relative w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {messages.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto"
          >
            <EmptyConversation onSelectExample={(p) => sendMessage(p)} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth px-4 sm:px-6 md:px-8 py-8 relative"
            onScroll={handleScroll}
          >
            <div className="max-w-3xl mx-auto flex flex-col gap-6 relative min-h-full">
              <MessageList messages={messages} isLoading={isLoading} />
              {error && (
                <div className="mt-4 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-sm flex items-center justify-between">
                  <span>{error.error || "An error occurred"}</span>
                  <Button variant="outline" size="sm" onClick={retryMessage} className="gap-2 h-8 hover:bg-destructive hover:text-destructive-foreground">
                    <RefreshCcw className="w-3 h-3" /> Retry
                  </Button>
                </div>
              )}
              <div ref={bottomRef} className="h-28 shrink-0" />
            </div>

            <AnimatePresence>
              {showScrollToBottom && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="sticky bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full shadow-lg border border-border bg-background/90 backdrop-blur-md pointer-events-auto hover:bg-muted"
                    onClick={scrollToBottom}
                  >
                    <ArrowDown className="w-4 h-4 mr-2" /> Jump to Latest
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-none p-4 pb-8 bg-gradient-to-t from-background via-background to-transparent pt-12 relative z-30 w-full mx-auto">
        <div className="max-w-3xl mx-auto w-full">
          {isLoading && (
            <div className="flex justify-center mb-3">
              <button 
                onClick={stopGeneration}
                className="text-xs font-medium bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 border border-border/50 shadow-sm"
              >
                <div className="w-2.5 h-2.5 rounded-sm bg-foreground/70" />
                Stop Generation
              </button>
            </div>
          )}
          <ChatInput key={activeConversationId || 'empty'} onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

