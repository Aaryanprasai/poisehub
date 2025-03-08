
import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ComponentProps<typeof ShadcnButton> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn(
          'relative transition-all duration-200 active:scale-[0.98]',
          isLoading && 'pointer-events-none',
          className
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}
        <span className={cn('flex items-center gap-2', isLoading && 'opacity-0')}>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </span>
      </ShadcnButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
