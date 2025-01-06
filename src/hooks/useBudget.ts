import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BudgetCategory, BudgetItem } from "@/components/project/types";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export const useBudget = (projectId: number | null) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['budget', projectId],
    queryFn: async () => {
      if (!projectId || !session?.user?.id) return [];
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('budget_categories')
        .select(`
          id,
          name,
          budget_items (
            id,
            title,
            amount
          )
        `)
        .eq('project_id', projectId)
        .eq('user_id', session.user.id);

      if (categoriesError) throw categoriesError;

      return categoriesData.map(category => ({
        id: category.id,
        name: category.name,
        items: category.budget_items.map(item => ({
          id: item.id,
          category: category.name,
          title: item.title,
          amount: Number(item.amount)
        }))
      })) as BudgetCategory[];
    },
    enabled: !!projectId && !!session?.user?.id,
  });

  const addCategory = useMutation({
    mutationFn: async (name: string) => {
      if (!projectId || !session?.user?.id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('budget_categories')
        .insert({
          name,
          project_id: projectId,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', projectId] });
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (categoryId: number) => {
      const { error } = await supabase
        .from('budget_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', projectId] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
  });

  const addItem = useMutation({
    mutationFn: async ({ categoryId, title, amount }: { categoryId: number, title: string, amount: number }) => {
      if (!projectId || !session?.user?.id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('budget_items')
        .insert({
          title,
          amount,
          category_id: categoryId,
          project_id: projectId,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', projectId] });
      toast({
        title: "Success",
        description: "Item added successfully",
      });
    },
  });

  const updateItem = useMutation({
    mutationFn: async (item: BudgetItem) => {
      const { data, error } = await supabase
        .from('budget_items')
        .update({
          title: item.title,
          amount: item.amount
        })
        .eq('id', item.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', projectId] });
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async ({ categoryId, itemId }: { categoryId: number, itemId: number }) => {
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', projectId] });
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    },
  });

  return {
    categories,
    isLoading,
    addCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem
  };
};