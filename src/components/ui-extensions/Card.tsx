
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CardProps extends React.ComponentProps<typeof ShadcnCard> {
  hoverEffect?: boolean;
  glassEffect?: boolean;
  pulseEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect, glassEffect, pulseEffect, ...props }, ref) => {
    return (
      <ShadcnCard
        ref={ref}
        className={cn(
          "border-border bg-white dark:bg-black transition-all duration-300",
          hoverEffect && "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5 hover:-translate-y-1",
          glassEffect && "bg-white/90 dark:bg-black/90 backdrop-blur-sm border-white/20 dark:border-black/20 shadow-sm",
          pulseEffect && "animate-pulse-slow",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
