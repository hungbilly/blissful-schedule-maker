import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import VendorList from "./pages/VendorList";
import Budget from "./pages/Budget";
import GuestList from "./pages/GuestList";
import SittingPlan from "./pages/SittingPlan";

const queryClient = new QueryClient();

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vendors" element={<VendorList />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/guests" element={<GuestList />} />
              <Route path="/sitting-plan" element={<SittingPlan />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;