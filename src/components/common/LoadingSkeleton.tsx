import React from "react";
import { Skeleton } from "../ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export function MessageItemSkeleton({ isUser }: { isUser?: boolean }) {
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-4 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 w-full mt-1">
          <Skeleton className="h-4 w-24" />
          <div className={`px-4 py-3 rounded-2xl ${isUser ? "bg-muted rounded-tr-sm" : "bg-transparent"}`}>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
