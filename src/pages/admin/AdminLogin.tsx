
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="animate-fade-in w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/0e7944a1-7691-4813-a45b-831d6f5e1e44.png" 
              alt="Poise Logo" 
              className="h-10 w-auto"
            />
            <h1 className="text-3xl font-bold tracking-tight text-white">Poise</h1>
          </div>
        </div>

        <Card className="w-full shadow-lg animate-slide-up border-slate-800 bg-slate-900">
          <CardHeader className="space-y-1 border-b border-slate-800 pb-4">
            <CardTitle className="text-2xl text-center text-white">Admin Access</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <AdminLoginForm />
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t border-slate-800 pt-4">
            <div className="text-sm text-center text-slate-500 mt-2">
              Secure access for authorized personnel only
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
