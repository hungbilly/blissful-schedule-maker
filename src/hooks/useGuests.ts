import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/components/project/types";
import { useSession } from "@supabase/auth-helpers-react";

export const useGuests = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: guests = [], isLoading: guestsLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id,
          name,
          guest_categories (
            id,
            name
          ),
          table_id,
          tables (
            id,
            name
          )
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      return data.map((guest: any) => ({
        id: guest.id,
        name: guest.name,
        category: guest.guest_categories?.name || '',
        category_id: guest.guest_categories?.id,
        tableId: guest.table_id,
        tableName: guest.tables?.name,
      })) as Guest[];
    },
    enabled: !!session?.user?.id,
  });

  const addGuest = useMutation({
    mutationFn: async ({ name, categoryId }: { name: string; categoryId: number }) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('guests')
        .insert({
          name,
          category_id: categoryId,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
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
      queryClient.invalidateQueries({ queryKey: ['guests'] });
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
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });

  const assignGuestToTable = useMutation({
    mutationFn: async ({ guestId, tableId }: { guestId: number; tableId: number | null }) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('guests')
        .update({ table_id: tableId })
        .eq('id', guestId)
        .eq('user_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });

  return {
    guests,
    guestsLoading,
    addGuest,
    updateGuest,
    deleteGuest,
    assignGuestToTable,
  };
};