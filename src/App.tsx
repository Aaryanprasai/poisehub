
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tracks from "./pages/Tracks";
import Upload from "./pages/Upload";
import Insights from "./pages/Insights";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments"; 
import NotFound from "./pages/NotFound";
import VerificationPage from "./pages/VerificationPage";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTracks from "./pages/admin/AdminTracks";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminRoyalties from "./pages/admin/AdminRoyalties";
import AdminDeletionRequests from "./pages/admin/AdminDeletionRequests";
import AdminCreate from "./pages/admin/AdminCreate";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminManagement from "./pages/admin/AdminManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/tracks" element={
              <ProtectedRoute>
                <Tracks />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } />
            <Route path="/insights" element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } />
            <Route path="/verification" element={
              <ProtectedRoute>
                <VerificationPage />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/tracks" element={
              <ProtectedRoute>
                <AdminTracks />
              </ProtectedRoute>
            } />
            <Route path="/admin/tickets" element={
              <ProtectedRoute>
                <AdminTickets />
              </ProtectedRoute>
            } />
            <Route path="/admin/royalties" element={
              <ProtectedRoute>
                <AdminRoyalties />
              </ProtectedRoute>
            } />
            <Route path="/admin/deletion-requests" element={
              <ProtectedRoute>
                <AdminDeletionRequests />
              </ProtectedRoute>
            } />
            <Route path="/admin/create-admin" element={
              <ProtectedRoute>
                <AdminCreate />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/admin-management" element={
              <ProtectedRoute>
                <AdminManagement />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
