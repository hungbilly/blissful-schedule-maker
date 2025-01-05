import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimelineEvent } from "@/components/project/types";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

export const useEventMutations = (currentProjectId: number | null) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addEventMutation = useMutation({
    mutationFn: async (eventData: Omit<TimelineEvent, "id" | "created_at" | "project_id" | "user_id">) => {
      if (!session?.user?.id || !currentProjectId) {
        throw new Error("User must be logged in and project must be selected");
      }

      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          project_id: currentProjectId,
          user_id: session.user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding event:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', currentProjectId] });
      toast({
        title: "Success",
        description: "Event has been added to the timeline",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add event",
        variant: "destructive",
      });
      console.error('Error adding event:', error);
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (event: TimelineEvent) => {
      if (!session?.user?.id) {
        throw new Error("User must be logged in");
      }

      const { id, created_at, project_id, user_id, ...updates } = event;

      const { data, error } = await supabase
        .from('events')
        .update({
          ...updates,
          end_time: updates.end_time, // Ensure we're using end_time
        })
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating event:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', currentProjectId] });
      toast({
        title: "Success",
        description: "Event has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
      console.error('Error updating event:', error);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      if (!session?.user?.id) {
        throw new Error("User must be logged in");
      }

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', currentProjectId] });
      toast({
        title: "Success",
        description: "Event has been deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
      console.error('Error deleting event:', error);
    },
  });

  return {
    addEventMutation,
    updateEventMutation,
    deleteEventMutation,
  };
};