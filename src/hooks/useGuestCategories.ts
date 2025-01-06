import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const useGuestCategories = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['guestCategories'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('guest_categories')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const addCategory = useMutation({
    mutationFn: async (name: string) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('guest_categories')
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
      queryClient.invalidateQueries({ queryKey: ['guestCategories'] });
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
      queryClient.invalidateQueries({ queryKey: ['guestCategories'] });
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
      queryClient.invalidateQueries({ queryKey: ['guestCategories'] });
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