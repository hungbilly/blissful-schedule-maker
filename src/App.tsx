import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect } from "react";
import Index from "./pages/Index";
import VendorList from "./pages/VendorList";
import Budget from "./pages/Budget";
import GuestList from "./pages/GuestList";
import SittingPlan from "./pages/SittingPlan";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  
  if (!session) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear any cached data when user signs out
        queryClient.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
                  path="/sitting-plan"
                  element={
                    <ProtectedRoute>
                      <SittingPlan />
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