
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
      <div className="animate-fade-in w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Poise</h1>
          </div>
        </div>

        <Card className="w-full shadow-lg animate-slide-up border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
            <CardDescription className="text-center">
              Sign in with your admin credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminLoginForm />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="text-sm text-center text-muted-foreground mt-2">
              Admin access is restricted to authorized personnel only
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
