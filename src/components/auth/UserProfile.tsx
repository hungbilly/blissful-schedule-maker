import { useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { User, Edit, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EditProfileDialog } from "./EditProfileDialog";

export const UserProfile = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

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
    <>
      <div className="flex items-center gap-4 px-4 py-2">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-wedding-purple" />
          <span className="text-sm font-medium">
            {session.user.email}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-wedding-purple hover:text-wedding-purple/80"
            onClick={() => setEditProfileOpen(true)}
          >
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit Profile</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-wedding-purple hover:text-wedding-purple/80"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
      <EditProfileDialog 
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
      />
    </>
  );
};