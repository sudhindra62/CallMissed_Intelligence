import React from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "../../lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  tooltipSide?: "top" | "bottom" | "left" | "right";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, tooltipSide = "bottom", className, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger className={cn("inline-flex items-center justify-center shrink-0 w-9 h-9 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors", className)} aria-label={label} {...props} ref={ref}>
          {icon}
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
IconButton.displayName = "IconButton";
