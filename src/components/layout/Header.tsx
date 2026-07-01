"use client"
import React from 'react'
import { Menu, Settings, User } from 'lucide-react'
import { Button } from '../ui/button'
import { ThemeToggle } from '../common/ThemeToggle'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { SettingsDialogContent } from './SettingsDialogContent'

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between px-6 bg-background/60 backdrop-blur-3xl border-b border-border/40 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-muted/50 rounded-xl" onClick={onMenuClick} aria-label="Open sidebar">
          <Menu className="h-5 w-5 text-muted-foreground" />
        </Button>
        <div className="hidden sm:flex items-center gap-3">
          <h1 className="text-[15px] font-semibold tracking-tight text-foreground">CallMissed AI</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <Dialog>
          <DialogTrigger render={
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/50 text-muted-foreground transition-colors hidden sm:inline-flex h-9 w-9" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          } />
          <SettingsDialogContent />
        </Dialog>
        
        <div className="h-6 w-px bg-border/60 mx-1 hidden md:block" />
        
        <div className="flex items-center gap-3 cursor-pointer group hover:bg-muted/30 p-1.5 pr-3 rounded-2xl transition-all duration-300" aria-label="User profile">
          <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent p-[2px] shadow-sm group-hover:shadow-glow-primary transition-all duration-300">
            <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-foreground/80" />
            </div>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-foreground leading-none">Sudhindra</span>
          </div>
        </div>
      </div>
    </header>
  )
}

