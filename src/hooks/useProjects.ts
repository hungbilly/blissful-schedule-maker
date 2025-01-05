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
        .maybeSingle();

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
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: async (projectId: number) => {
      if (!session?.user?.id) {
        throw new Error("User must be logged in to delete a project");
      }

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .eq("user_id", session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDuplicateProject = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: async (projectId: number) => {
      if (!session?.user?.id) {
        throw new Error("User must be logged in to duplicate a project");
      }

      // First, get the project details
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError) throw projectError;

      // Create new project with copied details
      const { data: newProject, error: createError } = await supabase
        .from("projects")
        .insert([{
          name: `${project.name} (Copy)`,
          user_id: session.user.id,
          bride_name: project.bride_name,
          groom_name: project.groom_name,
          wedding_date: project.wedding_date
        }])
        .select()
        .single();

      if (createError) throw createError;

      // Get all events from original project
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .eq("project_id", projectId);

      if (eventsError) throw eventsError;

      // Create new events for the new project
      if (events && events.length > 0) {
        const newEvents = events.map(event => ({
          ...event,
          id: undefined,
          project_id: newProject.id,
          user_id: session.user.id
        }));

        const { error: copyEventsError } = await supabase
          .from("events")
          .insert(newEvents);

        if (copyEventsError) throw copyEventsError;
      }

      return newProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
