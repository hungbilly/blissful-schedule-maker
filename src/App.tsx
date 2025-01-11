import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Index from "./pages/Index";
import VendorList from "./pages/VendorList";
import Budget from "./pages/Budget";
import GuestList from "./pages/GuestList";
import SittingPlan from "./pages/SittingPlan";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route wrapper component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = session?.user?.email === "admin@onair.wedding"; // You can adjust this condition
  
  useEffect(() => {
    if (!session) {
      toast({
        title: "Session Expired",
        description: "Please log in again to continue.",
        variant: "destructive",
      });
      navigate("/", { replace: true });
    } else if (requireAdmin && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/", { replace: true });
    }
  }, [session, navigate, toast, requireAdmin, isAdmin]);
  
  if (!session || (requireAdmin && !isAdmin)) {
    return null;
  }
  
  return <>{children}</>;
};

function App() {
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
        // Clear any cached data when user signs out or session expires
        queryClient.clear();
        toast({
          title: "Session Ended",
          description: event === 'SIGNED_OUT' 
            ? "You have been logged out successfully." 
            : "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase} initialSession={null}>
          <BrowserRouter>
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route
                  path="/vendors"
                  element={
                    <ProtectedRoute>
                      <VendorList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/budget"
                  element={
                    <ProtectedRoute>
                      <Budget />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/guests"
                  element={
                    <ProtectedRoute>
                      <GuestList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seating-plan"
                  element={
                    <ProtectedRoute>
                      <SittingPlan />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </SessionContextProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;