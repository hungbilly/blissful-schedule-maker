import { useState, useEffect } from "react";
import { Timeline } from "@/components/Timeline";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProjectSelector } from "@/components/project/ProjectSelector";
import { ProjectDialog } from "@/components/project/ProjectDialog";
import { TimelineEvent } from "@/components/project/types";
import { Edit2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoupleInfo } from "@/components/CoupleInfo";
import { exportToCSV } from "@/utils/exportUtils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useProjects, useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const ProjectContent = () => {
  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [use24Hour, setUse24Hour] = useState(true);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [date, setDate] = useState("");
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();

  // Initialize currentProjectId when projects are loaded
  useEffect(() => {
    if (projects.length > 0 && currentProjectId === null) {
      setCurrentProjectId(projects[0].id);
    }
  }, [projects, currentProjectId]);

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
      return data;
    },
    enabled: !!currentProjectId && !!session?.user?.id,
  });

  const addEventMutation = useMutation({
    mutationFn: async (eventData: Omit<TimelineEvent, "id">) => {
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
        .maybeSingle();

      if (error) throw error;
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

      const { data, error } = await supabase
        .from('events')
        .update({
          time: event.time,
          end_time: event.endTime,
          duration: event.duration,
          title: event.title,
          description: event.description,
          location: event.location,
        })
        .eq('id', event.id)
        .eq('user_id', session.user.id)
        .select()
        .maybeSingle();

      if (error) throw error;
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

      if (error) throw error;
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

  const handleAddEvent = async (eventData: Omit<TimelineEvent, "id">) => {
    if (!currentProjectId) return;
    await addEventMutation.mutateAsync(eventData);
  };

  const handleEditEvent = async (eventId: number, updates: Partial<TimelineEvent>) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    await updateEventMutation.mutateAsync({
      ...event,
      ...updates,
    });
  };

  const handleDeleteEvent = async (eventId: number) => {
    await deleteEventMutation.mutateAsync(eventId);
  };

  const handleProjectSubmit = async (name: string) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    try {
      if (dialogMode === "create") {
        await createProject.mutateAsync(name);
        toast({
          title: "Success",
          description: `Project "${name}" has been created`,
        });
      } else if (currentProjectId) {
        await updateProject.mutateAsync({ id: currentProjectId, name });
        toast({
          title: "Success",
          description: `Project name has been updated to "${name}"`,
        });
      }
      setIsProjectDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const handleEditProject = () => {
    setDialogMode("edit");
    setIsProjectDialogOpen(true);
  };

  const handleNewProject = () => {
    setDialogMode("create");
    setIsProjectDialogOpen(true);
  };

  const handleExport = () => {
    if (!currentProject) return;
    
    exportToCSV(currentProject.events, use24Hour);
    toast({
      title: "Success",
      description: "Event rundown has been downloaded",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wedding-pink">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Welcome to your Wedding Planner</h2>
          <p className="mb-4">Create your first project to get started</p>
          <Button onClick={handleNewProject}>Create Project</Button>
        </div>
        <ProjectDialog
          open={isProjectDialogOpen}
          onOpenChange={setIsProjectDialogOpen}
          onSubmit={handleProjectSubmit}
          initialName=""
          mode="create"
        />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-wedding-pink py-12">
          <div className="container max-w-3xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <ProjectSelector
                  projects={projects}
                  currentProjectId={currentProjectId || 0}
                  onProjectChange={setCurrentProjectId}
                  onNewProjectClick={handleNewProject}
                />
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExport}
                  className="h-10 w-10"
                  title="Download rundown"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleEditProject}
                  className="h-10 w-10"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="24h-mode">24h</Label>
                  <Switch
                    id="24h-mode"
                    checked={use24Hour}
                    onCheckedChange={setUse24Hour}
                  />
                </div>
              </div>
            </div>

            <CoupleInfo
              bride={bride}
              groom={groom}
              date={date}
              onBrideChange={setBride}
              onGroomChange={setGroom}
              onDateChange={setDate}
            />

            <h1 className="text-4xl md:text-5xl text-wedding-purple text-center font-serif mb-12">
              {currentProject?.name || "Timeline"}
            </h1>

            {currentProject && (
              <Timeline
                events={events}
                onAddEvent={handleAddEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                use24Hour={use24Hour}
              />
            )}
          </div>
        </div>

        <ProjectDialog
          open={isProjectDialogOpen}
          onOpenChange={setIsProjectDialogOpen}
          onSubmit={handleProjectSubmit}
          initialName={dialogMode === "edit" ? currentProject?.name : ""}
          mode={dialogMode}
        />
      </div>
    </SidebarProvider>
  );
};
