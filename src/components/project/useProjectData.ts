import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project, TimelineEvent } from "./projectTypes";
import { useSession } from "@supabase/auth-helpers-react";

export const useProjectData = (currentProjectId: number | null) => {
  const session = useSession();

  const { data: events = [] } = useQuery({
    queryKey: ['events', currentProjectId],
    queryFn: async () => {
      if (!currentProjectId || !session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('project_id', currentProjectId)
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data as TimelineEvent[];
    },
    enabled: !!currentProjectId && !!session?.user?.id,
  });

  const { data: currentProject } = useQuery({
    queryKey: ['project', currentProjectId],
    queryFn: async () => {
      if (!currentProjectId || !session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', currentProjectId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Project | null;
    },
    enabled: !!currentProjectId && !!session?.user?.id,
  });

  return { events, currentProject };
};