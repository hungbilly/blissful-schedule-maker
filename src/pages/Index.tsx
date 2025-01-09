import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectContent } from "@/components/project/ProjectContent";
import { useToast } from "@/hooks/use-toast";
import { LandingPage } from "@/components/LandingPage";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportGuestsToPDF, exportGuestsToXLSX } from "@/utils/guestExportUtils";
import { useGuests } from "@/hooks/useGuests";
import { useTables } from "@/hooks/useTables";

const Index = () => {
  const [session, setSession] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { guests } = useGuests();
  const { tables } = useTables();

  const handleExportPDF = () => {
    if (!guests?.length) {
      toast({
        title: "No guests to export",
        description: "Add some guests first before exporting",
        variant: "destructive",
      });
      return;
    }
    exportGuestsToPDF(guests, tables);
    toast({
      title: "Success",
      description: "Guest list exported to PDF",
    });
  };

  const handleExportXLSX = () => {
    if (!guests?.length) {
      toast({
        title: "No guests to export",
        description: "Add some guests first before exporting",
        variant: "destructive",
      });
      return;
    }
    exportGuestsToXLSX(guests, tables);
    toast({
      title: "Success",
      description: "Guest list exported to Excel",
    });
  };

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

  // Show landing page for non-authenticated users
  if (!session) {
    return <LandingPage />;
  }

  // Show project content for authenticated users with export buttons
  return (
    <div className="relative">
      <ProjectContent />
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Button
          variant="outline"
          className="bg-white shadow-md hover:bg-gray-100"
          onClick={handleExportPDF}
        >
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
        <Button
          variant="outline"
          className="bg-white shadow-md hover:bg-gray-100"
          onClick={handleExportXLSX}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Excel
        </Button>
      </div>
    </div>
  );
};

export default Index;