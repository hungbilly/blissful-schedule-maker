import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

export const useProjectDetails = (projectId: number | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();

  const updateProjectDetails = useMutation({
    mutationFn: async ({ bride, groom, date }: { bride: string; groom: string; date: string }) => {
      if (!projectId || !session?.user?.id) {
        throw new Error("No project selected or user not authenticated");
      }

      const { data, error } = await supabase
        .from('projects')
        .update({
          bride_name: bride,
          groom_name: groom,
          wedding_date: date,
        })
        .eq('id', projectId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast({
        title: "Success",
        description: "Project details have been updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update project details",
        variant: "destructive",
      });
    },
  });

  return { updateProjectDetails };
};