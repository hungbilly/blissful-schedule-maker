import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { EditProfileDialog } from "@/components/auth/EditProfileDialog";
import { format } from "date-fns";

interface Profile {
  id: string;
  bride_name?: string;
  groom_name?: string;
}

interface ProfileSectionProps {
  weddingDate?: string;
}

export const ProfileSection = ({ weddingDate }: ProfileSectionProps) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${session.user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['profile', session.user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/");
    }
  };

  if (isProfileLoading) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Wedding Planning Of
      </h2>
      {weddingDate && (
        <p className="text-sm text-gray-500">
          {format(new Date(weddingDate), "MMMM d, yyyy")}
        </p>
      )}
      {profile && (
        <p className="text-sm text-gray-600 mt-1">
          {profile.bride_name || "Bride"} & {profile.groom_name || "Groom"}
        </p>
      )}
      <div className="flex flex-col gap-2 mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-wedding-purple hover:text-wedding-purple/80 justify-start"
          onClick={() => setIsEditProfileOpen(true)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-wedding-purple hover:text-wedding-purple/80 justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
      />
    </div>
  );
};