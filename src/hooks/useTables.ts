import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Table } from "@/components/project/types";

export const useTables = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: tables = [], isLoading: tablesLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data as Table[];
    },
    enabled: !!session?.user?.id,
  });

  const addTable = useMutation({
    mutationFn: async (name: string) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tables')
        .insert({
          name,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });

  const deleteTable = useMutation({
    mutationFn: async (id: number) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });

  return {
    tables,
    tablesLoading,
    addTable,
    deleteTable,
  };
};