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
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, useDuplicateProject } from "@/hooks/useProjects";
import { useProjectData } from "./useProjectData";
import { TimelineEvent } from "./types";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import { useEventMutations } from "@/hooks/useEventMutations";
import { EmptyProjectState } from "./EmptyProjectState";

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
  const supabase = useSupabaseClient();
  const { updateProjectDetails } = useProjectDetails(currentProjectId);
  const { events, currentProject } = useProjectData(currentProjectId);
  const { addEventMutation, updateEventMutation, deleteEventMutation } = useEventMutations(currentProjectId);
  const [profileData, setProfileData] = useState<{ bride_name?: string; groom_name?: string }>({});

  useEffect(() => {
    if (projects.length > 0 && currentProjectId === null) {
      setCurrentProjectId(projects[0].id);
    }
  }, [projects, currentProjectId]);

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('bride_name, groom_name')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfileData(data);
      }
    };

    fetchProfile();
  }, [session?.user?.id, supabase]);

  const handleAddEvent = async (eventData: Omit<TimelineEvent, "id" | "created_at" | "project_id" | "user_id">) => {
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
        const newProject = await createProject.mutateAsync(name);
        setCurrentProjectId(newProject.id);
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
      // Store the current project ID before deletion
      const deletedProjectId = currentProjectId;

      // Find the next available project before deletion
      const nextProject = projects.find(p => p.id !== deletedProjectId);

      // Delete the project
      await deleteProject.mutateAsync(deletedProjectId);
      
      // Close the dialog
      setIsProjectDialogOpen(false);
      
      // Set the next project as current (or null if none left)
      setCurrentProjectId(nextProject?.id || null);
      
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
    
    exportToCSV(
      events, 
      use24Hour,
      profileData.bride_name,
      profileData.groom_name,
      currentProject.name
    );
    
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
      <>
        <EmptyProjectState onNewProject={handleNewProject} />
        <ProjectDialog
          open={isProjectDialogOpen}
          onOpenChange={setIsProjectDialogOpen}
          onSubmit={handleProjectSubmit}
          initialName=""
          mode="create"
        />
      </>
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

            <h1 className="text-3xl md:text-4xl text-wedding-purple text-center font-serif mb-12">
              Itinerary: {currentProject?.name || ""}
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