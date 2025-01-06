import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const useGuestCategories = (projectId: number | null) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['guestCategories', projectId],
    queryFn: async () => {
      if (!projectId || !session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('guest_categories')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!projectId && !!session?.user?.id,
  });

  const addCategory = useMutation({
    mutationFn: async (name: string) => {
      if (!session?.user?.id || !projectId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('guest_categories')
        .insert({
          name,
          user_id: session.user.id,
          project_id: projectId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guestCategories', projectId] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('guest_categories')
        .update({ name })
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guestCategories', projectId] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('guest_categories')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guestCategories', projectId] });
    },
  });

  return {
    categories,
    categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};