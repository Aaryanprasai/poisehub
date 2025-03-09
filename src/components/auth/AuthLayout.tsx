
import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui-extensions/Card';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 bg-gradient-to-br from-background to-muted/50">
      <div className="animate-fade-in w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Poise</h1>
          </div>
        </div>

        <Card className="w-full shadow-lg animate-slide-up" glassEffect>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your music distribution dashboard
            </CardDescription>
          </CardHeader>
          {children}
          <CardFooter className="flex flex-col gap-2">
            <div className="text-sm text-center text-muted-foreground mt-2">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
