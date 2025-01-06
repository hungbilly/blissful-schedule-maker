import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/components/project/types";
import { useSession } from "@supabase/auth-helpers-react";

export const useGuests = (projectId: number | null) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: guests = [], isLoading: guestsLoading } = useQuery({
    queryKey: ['guests', projectId],
    queryFn: async () => {
      if (!projectId || !session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id,
          name,
          guest_categories (
            id,
            name
          ),
          table_id
        `)
        .eq('project_id', projectId)
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      return data.map((guest: any) => ({
        id: guest.id,
        name: guest.name,
        category: guest.guest_categories?.name || '',
        tableId: guest.table_id,
      })) as Guest[];
    },
    enabled: !!projectId && !!session?.user?.id,
  });

  const addGuest = useMutation({
    mutationFn: async ({ name, categoryId }: { name: string; categoryId: number }) => {
      if (!session?.user?.id || !projectId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('guests')
        .insert({
          name,
          category_id: categoryId,
          user_id: session.user.id,
          project_id: projectId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', projectId] });
    },
  });

  const updateGuest = useMutation({
    mutationFn: async ({ id, name, categoryId }: { id: number; name: string; categoryId: number }) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('guests')
        .update({
          name,
          category_id: categoryId,
        })
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', projectId] });
    },
  });

  const deleteGuest = useMutation({
    mutationFn: async (id: number) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', projectId] });
    },
  });

  return {
    guests,
    guestsLoading,
    addGuest,
    updateGuest,
    deleteGuest,
  };
};