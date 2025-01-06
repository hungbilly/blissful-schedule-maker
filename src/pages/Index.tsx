import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectContent } from "@/components/project/ProjectContent";
import { useToast } from "@/hooks/use-toast";
import { LandingPage } from "@/components/LandingPage";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [session, setSession] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  // Show project content for authenticated users
  return <ProjectContent />;
};

export default Index;