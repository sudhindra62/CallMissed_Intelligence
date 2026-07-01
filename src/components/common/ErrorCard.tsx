import React from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface ErrorCardProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorCard({
  title = "An error occurred",
  description,
  onRetry,
  className,
}: ErrorCardProps) {
  return (
    <Card className={`border-destructive/50 bg-destructive/5 ${className || ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-destructive flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-destructive/80">
          {description}
        </CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={onRetry}>
            Try Again
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
