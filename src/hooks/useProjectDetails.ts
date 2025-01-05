import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProjectDetails = (projectId: number | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const updateProjectDetails = useMutation({
    mutationFn: async ({ bride, groom, date }: { bride: string; groom: string; date: string }) => {
      if (!projectId) throw new Error("No project selected");

      const { data, error } = await supabase
        .from('projects')
        .update({
          bride_name: bride,
          groom_name: groom,
          wedding_date: date,
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
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

  return { currentProject, updateProjectDetails };
};