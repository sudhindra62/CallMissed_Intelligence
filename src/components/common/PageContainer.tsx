import React from "react";
import { cn } from "../../lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  centered?: boolean;
}

export function PageContainer({ children, centered, className, ...props }: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex-1 w-full h-full p-4 md:p-6 lg:p-8 overflow-y-auto",
        centered && "flex flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      <div className={cn("w-full mx-auto", !centered && "max-w-7xl")}>
        {children}
      </div>
    </div>
  );
}
