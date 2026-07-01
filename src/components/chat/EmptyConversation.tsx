"use client"
import React from 'react'
import { Sparkles, Image as ImageIcon, Code2, PenTool, ArrowRight, Zap, TerminalSquare, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'

export function EmptyConversation({ onSelectExample }: { onSelectExample: (prompt: string) => void }) {
  const examples = [
    {
      title: "Write a React component",
      prompt: "Write a React component for a responsive navigation bar.",
      icon: <Code2 className="w-5 h-5 text-primary" />,
      color: "from-primary/20 to-primary/5"
    },
    {
      title: "Generate an image",
      prompt: "Generate an image of a futuristic city with flying cars.",
      icon: <ImageIcon className="w-5 h-5 text-accent" />,
      color: "from-accent/20 to-accent/5"
    },
    {
      title: "Analyze this code",
      prompt: "Explain how React Server Components work.",
      icon: <TerminalSquare className="w-5 h-5 text-secondary" />,
      color: "from-secondary/20 to-secondary/5"
    },
    {
      title: "Draft an email",
      prompt: "Draft a professional email to my team about the new product launch.",
      icon: <PenTool className="w-5 h-5 text-success" />,
      color: "from-success/20 to-success/5"
    }
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center min-h-[500px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl w-full space-y-16 mt-8"
      >
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="relative mx-auto w-20 h-20 flex items-center justify-center mb-6"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full mix-blend-multiply" />
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-glow-primary relative z-10">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </motion.div>
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70"
            >
              How can I help you today?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed"
            >
              Experience seamless streaming chat, powerful image generation, and multimodal vision capabilities in a premium workspace.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-4">
          {examples.map((example, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-border/80 hover:border-primary/30 shadow-soft hover:shadow-glow transition-all duration-300 cursor-pointer rounded-2xl group p-5 flex flex-col gap-3 relative overflow-hidden"
              onClick={() => onSelectExample(example.prompt)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${example.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-background p-2.5 rounded-xl shadow-sm border border-border/50 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  {example.icon}
                </div>
                <div className="flex-1 mt-1">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{example.title}</h3>
                  <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">{example.prompt}</p>
                </div>
                <div className="mt-1 w-8 h-8 rounded-full bg-background flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 border border-border/50 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground shadow-sm shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="max-w-3xl mx-auto mt-12 bg-gradient-to-r from-background to-card border border-border rounded-2xl p-6 shadow-soft relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="hidden sm:flex shrink-0 items-center justify-center w-14 h-14 rounded-full bg-primary/10">
              <Rocket className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground mb-1">CallMissed Guide</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Configure your API keys in settings to unlock the full potential of kimi-k2.7-code and flux-2-klein-9b models. Learn more about our capabilities.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
