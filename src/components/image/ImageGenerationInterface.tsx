"use client";
import React from "react";
import { useImageGeneration } from "../../features/image-generation/useImageGeneration";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Download, ImageIcon, Loader2, Sparkles, AlertCircle, Wand2, RefreshCcw, MessageSquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ImageModal } from "./ImageModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useConversations } from "../../providers/ConversationProvider";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export function ImageGenerationInterface() {
  const { imageUrl, isLoading, error, generateImage } = useImageGeneration();
  const { activeConversationId, createNewConversation, addMessageToConversation } = useConversations();
  const [isFocused, setIsFocused] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const prompt = watch("prompt");

  const onSubmit = (data: FormValues) => {
    if (!data.prompt.trim() || isLoading) return;
    generateImage(data.prompt);
  };

  const handleShareToChat = () => {
    if (!imageUrl) return;

    // Get current conversation or create a new one
    let targetConvId = activeConversationId;
    if (!targetConvId) {
      targetConvId = createNewConversation();
    }

    // Since imageUrl is a Blob URL, it might not persist well in chat history across sessions 
    // unless we save the base64. 
    // But for "Everything must work" and "Keep existing architecture", 
    // let's try to get the base64 from localStorage since useImageGeneration saves it there.
    const saved = localStorage.getItem("last_generated_image");
    let imageToSend = imageUrl;
    if (saved) {
      try {
        const { b64 } = JSON.parse(saved);
        imageToSend = `data:image/png;base64,${b64}`;
      } catch (e) {}
    }

    addMessageToConversation(targetConvId, {
      id: uuidv4(),
      role: 'assistant',
      content: `I've generated this image based on your prompt: "${prompt}"`,
      image: imageToSend,
    });
    
    // Maybe show a success toast or something? 
    // For now, let's just do it.
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    
    // Generate descriptive filename
    const dateStr = new Date().toISOString().split('T')[0];
    const safePrompt = prompt ? prompt.substring(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'image';
    a.download = `generated-${safePrompt}-${dateStr}.png`.replace(/-+/g, '-');
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="flex flex-col h-full absolute inset-0 overflow-y-auto p-4 md:p-8 bg-background">
      <ImageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={imageUrl}
        altText={prompt}
        onDownload={handleDownload}
        onShare={handleShareToChat}
      />

      <div className="max-w-4xl mx-auto w-full space-y-12 pb-12 mt-8">
        
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mx-auto w-16 h-16 flex items-center justify-center mb-6"
          >
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full mix-blend-multiply" />
            <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-glow-primary relative z-10 p-[1px]">
              <div className="w-full h-full rounded-[17px] bg-card flex items-center justify-center shadow-inner">
                <ImageIcon className="w-6 h-6 text-accent" />
              </div>
            </div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70"
          >
            Create with Vision
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-muted-foreground max-w-lg mx-auto text-[15px]"
          >
            Powered by flux-2-klein-9b. Describe what you want to see.
          </motion.p>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
            <div className={cn(
              "relative flex flex-col gap-2 rounded-[24px] border bg-card/60 backdrop-blur-xl p-2 transition-all duration-300 shadow-soft",
              isFocused ? "border-accent/40 shadow-glow-primary ring-1 ring-accent/20" : "border-border/80"
            )}>
              <Textarea
                {...register("prompt")}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="A futuristic city at sunset, flying cars, neon lights, highly detailed..."
                className="min-h-[100px] max-h-[300px] w-full resize-none border-0 bg-transparent px-4 py-4 focus-visible:ring-0 text-[15px] leading-relaxed placeholder:text-muted-foreground focus:outline-none"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between px-2 pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/70 pl-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Be descriptive for better results</span>
                </div>
                <Button 
                  type="submit" 
                  disabled={!isValid || isLoading} 
                  className={cn(
                    "rounded-full px-6 transition-all duration-300",
                    isValid && !isLoading ? "bg-gradient-to-br from-accent to-primary hover:scale-[1.02] shadow-glow-primary border border-accent/20" : ""
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Generating..." : "Generate"}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <Alert variant="destructive" className="rounded-[16px] border-destructive/20 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Generation Failed</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <p>{error.error}</p>
                {error.details && (
                  <p className="text-xs opacity-80 break-words font-mono bg-destructive/5 p-2 rounded border border-destructive/10">{error.details}</p>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSubmit(onSubmit)()}
                  className="w-fit h-8 rounded-full border-destructive/20 hover:bg-destructive/10 text-destructive mt-1"
                >
                  <RefreshCcw className="w-3 h-3 mr-2" />
                  Retry Generation
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="flex flex-col items-center justify-center pt-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-3xl aspect-[16/9] sm:aspect-[2/1] md:aspect-[21/9] bg-muted/30 rounded-[32px] flex flex-col items-center justify-center text-muted-foreground border border-border/50 relative overflow-hidden shadow-inner"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                <Sparkles className="w-8 h-8 mb-4 animate-pulse text-accent" />
                <p className="text-sm font-medium tracking-wide">Synthesizing image...</p>
              </motion.div>
            ) : imageUrl ? (
              <motion.div 
                 key="image"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="w-full max-w-4xl group relative rounded-[32px] overflow-hidden shadow-2xl border border-border/80 bg-card cursor-zoom-in"
                 onClick={() => setIsModalOpen(true)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={prompt} className="w-full h-auto object-cover max-h-[70vh]" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                    }} 
                    variant="secondary" 
                    className="gap-2 rounded-full px-6 py-5 shadow-xl hover:scale-105 transition-transform"
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Save Image</span>
                  </Button>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareToChat();
                    }} 
                    variant="secondary" 
                    className="gap-2 rounded-full px-6 py-5 shadow-xl hover:scale-105 transition-transform bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">Send to Chat</span>
                  </Button>
                </div>
              </motion.div>
            ) : (
              !error && (
                <motion.div 
                  key="examples"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full max-w-4xl flex flex-col items-center justify-center space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {[
                      { title: "Neon City", icon: "🏙️", prompt: "A futuristic neon city at night, highly detailed, cyberpunk style, cinematic lighting.", color: "from-blue-500/10 to-purple-500/10" },
                      { title: "Robot Friend", icon: "🤖", prompt: "A highly detailed cute mechanical robot companion with glowing blue eyes, sitting in a messy workshop, 8k resolution.", color: "from-orange-500/10 to-red-500/10" },
                      { title: "Cyberpunk", icon: "🌆", prompt: "A breathtaking cyberpunk landscape, flying cars, towering megastructures, synthwave colors.", color: "from-pink-500/10 to-rose-500/10" },
                      { title: "Minimal Logo", icon: "✨", prompt: "A minimal and elegant logo design for a tech startup, geometric shape, gradient colors, clean white background.", color: "from-emerald-500/10 to-teal-500/10" }
                    ].map((example, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setValue("prompt", example.prompt, { shouldValidate: true });
                          setTimeout(() => handleSubmit(onSubmit)(), 50);
                        }}
                        className="group flex flex-col items-start text-left p-5 bg-card/40 backdrop-blur-sm border border-border/60 hover:border-accent/40 rounded-[20px] transition-all duration-300 hover:shadow-soft relative overflow-hidden"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${example.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className="relative z-10">
                          <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300 origin-bottom-left">{example.icon}</div>
                          <div className="font-semibold text-sm text-foreground mb-2 group-hover:text-accent transition-colors">{example.title}</div>
                          <div className="text-[13px] text-muted-foreground line-clamp-3 leading-relaxed">{example.prompt}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
