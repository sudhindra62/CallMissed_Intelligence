"use client";
import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
  node?: any;
}

export function CodeBlock({ children, className, node, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract the raw code string to copy
  let rawCode = "";
  if (node && node.children && node.children[0] && node.children[0].children) {
    // Basic extraction if passed from react-markdown code block
    rawCode = node.children[0].children[0].value || "";
  } else if (children && typeof children === 'object' && 'props' in (children as any)) {
     const childProps = (children as any).props;
     if (childProps && childProps.children) {
        if (typeof childProps.children === 'string') {
           rawCode = childProps.children;
        } else if (Array.isArray(childProps.children)) {
           rawCode = childProps.children.join('');
        }
     }
  }

  // Fallback for simple string extraction
  if (!rawCode && children && typeof children === 'object') {
     const el = children as any;
     if (el.props && el.props.children) {
         rawCode = String(el.props.children);
     }
  }

  // Find language
  let language = "text";
  if (children && typeof children === 'object' && 'props' in (children as any)) {
      const childProps = (children as any).props;
      const match = /language-(\w+)/.exec(childProps.className || "");
      if (match) {
          language = match[1];
      }
  }

  const handleCopy = () => {
    if (!rawCode) return;
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden bg-[#0d1117] border border-border/40 font-mono text-sm shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] text-[#8b949e] border-b border-border/40 text-xs">
        <span className="font-semibold uppercase tracking-wider">{language}</span>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d] transition-colors"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <pre className={cn("p-4 overflow-x-auto text-[#c9d1d9] text-[13px] leading-relaxed", className)} {...props}>
        {children}
      </pre>
    </div>
  );
}
