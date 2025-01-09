import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectContent } from "@/components/project/ProjectContent";
import { useToast } from "@/hooks/use-toast";
import { LandingPage } from "@/components/LandingPage";
import { useNavigate } from "react-router-dom";
import { exportGuestsToCSV, exportGuestsToXLSX } from "@/utils/guestExportUtils";
import { useGuests } from "@/hooks/useGuests";
import { useTables } from "@/hooks/useTables";

const Index = () => {
  const [session, setSession] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { guests } = useGuests();
  const { tables } = useTables();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, navigate]);

  const handleExport = (type: 'csv' | 'excel') => {
    try {
      if (!guests || !tables) {
        toast({
          title: "Export Failed",
          description: "No data available to export",
          variant: "destructive",
        });
        return;
      }

      switch (type) {
        case 'csv':
          exportGuestsToCSV(guests, tables);
          break;
        case 'excel':
          exportGuestsToXLSX(guests, tables);
          break;
        default:
          console.error("Invalid export type:", type);
          toast({
            title: "Export Failed",
            description: "Invalid export type selected",
            variant: "destructive",
          });
      }

      toast({
        title: "Export Successful",
        description: `Guest list exported as ${type.toUpperCase()}`,
      });
    } catch (error) {
      console.error("Error during export:", error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting the guest list",
        variant: "destructive",
      });
    }
  };

  // Show landing page for non-authenticated users
  if (!session) {
    return <LandingPage />;
  }

  // Show project content for authenticated users
  return <ProjectContent onExport={handleExport} />;
};

export default Index;