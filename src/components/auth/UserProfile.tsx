import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  if (!session?.user) return null;

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-wedding-purple" />
        <span className="text-sm font-medium">
          {session.user.email}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-wedding-purple hover:text-wedding-purple/80 justify-start"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};