import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider, useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import React from "react";
import Index from "./pages/Index";
import VendorList from "./pages/VendorList";
import Budget from "./pages/Budget";
import GuestList from "./pages/GuestList";
import SittingPlan from "./pages/SittingPlan";
import { AppSidebar } from "./components/AppSidebar";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session } = useSessionContext();

  return (
    <div className="flex min-h-screen">
      {session && <AppSidebar />}
      <main className={`flex-1 ${session ? 'md:ml-64' : ''}`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vendors" element={<VendorList />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/guests" element={<GuestList />} />
          <Route path="/sitting-plan" element={<SittingPlan />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
          <BrowserRouter>
            <TooltipProvider>
              <AppRoutes />
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