import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { ProjectContent } from "@/components/project/ProjectContent";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

const Index = () => {
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  return (
    <div className="min-h-screen bg-wedding-pink">
      {!session ? <AuthForm /> : <ProjectContent />}
    </div>
  );
};

export default Index;