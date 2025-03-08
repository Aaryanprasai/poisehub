
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CardProps extends React.ComponentProps<typeof ShadcnCard> {
  hoverEffect?: boolean;
  glassEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect, glassEffect, ...props }, ref) => {
    return (
      <ShadcnCard
        ref={ref}
        className={cn(
          "transition-all duration-200",
          hoverEffect && "hover:shadow-md hover:-translate-y-1",
          glassEffect && "glass-card",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
