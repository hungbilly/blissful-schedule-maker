import { useState, useEffect } from "react";
import { Timeline } from "@/components/Timeline";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProjectSelector } from "@/components/project/ProjectSelector";
import { ProjectDialog } from "@/components/project/ProjectDialog";
import { Edit2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoupleInfo } from "@/components/CoupleInfo";
import { exportToCSV } from "@/utils/exportUtils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, useDuplicateProject } from "@/hooks/useProjects";
import { useProjectData } from "./useProjectData";
import { TimelineEvent } from "./projectTypes";
import { useProjectDetails } from "@/hooks/useProjectDetails";

export const ProjectContent = () => {
  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const duplicateProject = useDuplicateProject();
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [use24Hour, setUse24Hour] = useState(true);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();
  const { updateProjectDetails } = useProjectDetails(currentProjectId);

  // Initialize currentProjectId when projects are loaded
  useEffect(() => {
    if (projects.length > 0 && currentProjectId === null) {
      setCurrentProjectId(projects[0].id);
    }
  }, [projects, currentProjectId]);

  const { events, currentProject } = useProjectData(currentProjectId);

  const addEventMutation = useMutation({
    mutationFn: async (eventData: Omit<TimelineEvent, "id" | "created_at">) => {
      if (!session?.user?.id || !currentProjectId) {
        throw new Error("User must be logged in and project must be selected");
      }

      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          end_time: eventData.end_time,
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
    mutationFn: async ({ id, ...updates }: TimelineEvent) => {
      if (!session?.user?.id) {
        throw new Error("User must be logged in");
      }

      const { data, error } = await supabase
        .from('events')
        .update({
          ...updates,
          end_time: updates.end_time,
        })
        .eq('id', id)
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

  const handleAddEvent = async (eventData: Omit<TimelineEvent, "id" | "created_at" | "project_id" | "user_id">) => {
    if (!currentProjectId) return;
    await addEventMutation.mutateAsync({
      ...eventData,
      project_id: currentProjectId,
      user_id: session?.user?.id || '',
    });
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

  const handleDeleteProject = async () => {
    if (!currentProjectId) return;

    try {
      await deleteProject.mutateAsync(currentProjectId);
      setIsProjectDialogOpen(false);
      setCurrentProjectId(projects.length > 1 ? projects[0].id : null);
      toast({
        title: "Success",
        description: "Project has been deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateProject = async () => {
    if (!currentProjectId) return;

    try {
      await duplicateProject.mutateAsync(currentProjectId);
      setIsProjectDialogOpen(false);
      toast({
        title: "Success",
        description: "Project has been duplicated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate project",
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
    
    exportToCSV(events, use24Hour);
    toast({
      title: "Success",
      description: "Event rundown has been downloaded",
    });
  };

  const handleCoupleInfoChange = async (date: string) => {
    if (!currentProjectId) return;
    await updateProjectDetails.mutateAsync({ date });
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
              date={currentProject?.wedding_date || ""}
              onDateChange={(date) => handleCoupleInfoChange(date)}
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
          onDelete={dialogMode === "edit" ? handleDeleteProject : undefined}
          onDuplicate={dialogMode === "edit" ? handleDuplicateProject : undefined}
          initialName={dialogMode === "edit" ? currentProject?.name : ""}
          mode={dialogMode}
        />
      </div>
    </SidebarProvider>
  );
};
