import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/components/project/types";
import { useSession } from "@supabase/auth-helpers-react";

export const useProjects = () => {
  const session = useSession();

  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!session?.user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((project): Project => ({
        ...project,
        events: [],
        vendors: [],
      }));
    },
    enabled: !!session?.user?.id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!session?.user?.id) {
        throw new Error("User must be logged in to create a project");
      }

      const { data, error } = await supabase
        .from("projects")
        .insert([{ 
          name, 
          user_id: session.user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      if (!session?.user?.id) {
        throw new Error("User must be logged in to update a project");
      }

      const { data, error } = await supabase
        .from("projects")
        .update({ name })
        .eq("id", id)
        .eq("user_id", session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};