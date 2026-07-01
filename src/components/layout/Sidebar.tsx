"use client"
import React, { useState } from 'react'
import { MessageSquare, Plus, Image as ImageIcon, History, X, BookOpen, Trash2, Search, Pencil } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useConversations } from '@/providers/ConversationProvider'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { HelpDialogContent } from './HelpDialogContent'
import { Input } from '../ui/input'
import { toast } from 'sonner'

interface SidebarProps {
  onClose?: () => void
  activeView: 'chat' | 'image'
  onViewChange: (view: 'chat' | 'image') => void
}

export function Sidebar({ onClose, activeView, onViewChange }: SidebarProps) {
  const { conversations, createNewConversation, setActiveConversationId, activeConversationId, deleteConversation, restoreConversation, updateConversation } = useConversations()
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleNewChat = () => {
    createNewConversation()
    onViewChange('chat')
    if (onClose) onClose()
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
    onViewChange('chat')
    if (onClose) onClose()
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteConversation(id)
    toast.success('Conversation deleted', {
      action: {
        label: 'Undo',
        onClick: () => restoreConversation()
      }
    })
  }

  const startEditing = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation()
    setEditingId(id)
    setEditTitle(currentTitle)
  }

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      updateConversation(id, { title: editTitle.trim() })
    }
    setEditingId(null)
  }

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex h-full flex-col bg-background-secondary/40 backdrop-blur-3xl border-r border-border w-[280px]">
      <div className="flex h-[72px] items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-glow-primary">
            <SparklesIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-foreground">
            CallMissed
          </span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 hover:bg-muted rounded-full" onClick={onClose} aria-label="Close sidebar">
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
        <div className="px-2">
          <Button 
            onClick={handleNewChat}
            className="w-full justify-start gap-3 rounded-2xl h-12 bg-card text-foreground hover:bg-card/80 border border-border/80 transition-all duration-300 group shadow-soft hover:shadow-md text-sm font-medium"
          >
            <div className="h-7 w-7 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
              <Plus className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            New Chat
          </Button>
        </div>

        <div className="space-y-1">
          <div className="px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 flex items-center justify-between">
            Features
          </div>
          <Button 
            variant="ghost" 
            onClick={() => onViewChange('chat')}
            className={cn(
              "w-full justify-start gap-3 h-11 rounded-xl transition-all duration-300 text-sm font-medium relative overflow-hidden group",
              activeView === 'chat' 
                ? "text-primary bg-primary/5 hover:bg-primary/10" 
                : "text-secondary-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {activeView === 'chat' && (
              <motion.div 
                layoutId="activeIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
              />
            )}
            <div className={cn("p-1.5 rounded-lg transition-colors", activeView === 'chat' ? "bg-primary/10 text-primary" : "text-muted-foreground group-hover:text-foreground")}>
              <MessageSquare className="h-[18px] w-[18px]" />
            </div>
            Chat Interface
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onViewChange('image')}
            className={cn(
              "w-full justify-start gap-3 h-11 rounded-xl transition-all duration-300 text-sm font-medium relative overflow-hidden group",
              activeView === 'image' 
                ? "text-primary bg-primary/5 hover:bg-primary/10" 
                : "text-secondary-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {activeView === 'image' && (
              <motion.div 
                layoutId="activeIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
              />
            )}
            <div className={cn("p-1.5 rounded-lg transition-colors", activeView === 'image' ? "bg-primary/10 text-primary" : "text-muted-foreground group-hover:text-foreground")}>
              <ImageIcon className="h-[18px] w-[18px]" />
            </div>
            Image Generation
          </Button>
        </div>

        <div className="px-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-muted/30 border-border/60 focus:bg-muted/50 transition-all text-xs"
            />
          </div>
        </div>

        <div className="space-y-2 flex-1 mt-4">
          <div className="px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center justify-between">
            Recent Chats
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted/50">
              <History className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-[2px]">
            <AnimatePresence initial={false}>
              {filteredConversations.slice(0, 20).map((conv) => (
                <motion.div 
                  key={conv.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={cn(
                    "group flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-muted/40",
                    activeConversationId === conv.id && activeView === 'chat' && "bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300 shrink-0",
                      activeConversationId === conv.id && activeView === 'chat' ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" : "bg-muted-foreground/30 group-hover:bg-primary/50"
                    )} />
                    {editingId === conv.id ? (
                      <Input 
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => saveRename(conv.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(conv.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-7 py-0 px-2 text-[13px] bg-background border-primary/50 focus:ring-0"
                      />
                    ) : (
                      <span className={cn(
                        "text-[13px] font-medium truncate transition-colors",
                        activeConversationId === conv.id && activeView === 'chat' ? "text-foreground" : "text-secondary-foreground group-hover:text-foreground"
                      )}>
                        {conv.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all ml-1 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 hover:bg-muted text-muted-foreground hover:text-foreground"
                      onClick={(e) => startEditing(e, conv.id, conv.title)}
                      aria-label="Rename conversation"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      onClick={(e) => handleDelete(e, conv.id)}
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredConversations.length === 0 && (
              <div className="px-4 text-xs text-muted-foreground/50 py-2">
                {searchQuery ? "No matching chats" : "No recent chats"}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 mb-2">
        <Dialog>
          <DialogTrigger render={
            <Button variant="outline" className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground rounded-xl border-border/60 hover:bg-muted/50 transition-all">
              <BookOpen className="w-4 h-4" />
              Help & Documentation
            </Button>
          } />
          <HelpDialogContent />
        </Dialog>
      </div>
    </div>
  )
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
