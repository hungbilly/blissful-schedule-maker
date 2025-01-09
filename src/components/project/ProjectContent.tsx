import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProjectDialog } from "@/components/project/ProjectDialog";
import { CoupleInfo } from "@/components/CoupleInfo";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, useDuplicateProject } from "@/hooks/useProjects";
import { useProjectData } from "./useProjectData";
import { TimelineEvent } from "./types";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import { useEventMutations } from "@/hooks/useEventMutations";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectTimeline } from "./ProjectTimeline";
import { Button } from "@/components/ui/button";

interface ProjectContentProps {
  onExport: (type: 'csv' | 'excel') => void;
}

export const ProjectContent = ({ onExport }: ProjectContentProps) => {
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

  // Set the current project ID when projects are loaded
  useEffect(() => {
    if (projects.length > 0 && !currentProjectId) {
      // Projects are already sorted by created_at desc in useProjects
      setCurrentProjectId(projects[0].id);
    }
  }, [projects, currentProjectId]);

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

  const handleExport = (type: 'csv' | 'excel') => {
    if (!currentProject) return;
    
    try {
      switch (type) {
        case 'csv':
          exportToCSV(
            events, 
            use24Hour,
            profileData.bride_name,
            profileData.groom_name,
            currentProject.name
          );
          break;
        case 'excel':
          exportToExcel(
            events, 
            use24Hour,
            profileData.bride_name,
            profileData.groom_name,
            currentProject.name
          );
          break;
      }
      
      toast({
        title: "Success",
        description: `Event rundown has been downloaded as ${type.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export event rundown",
        variant: "destructive",
      });
    }
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
        <div className="flex-1 bg-wedding-pink py-12 md:ml-64">
          <div className="container max-w-3xl px-4">
            <ProjectHeader
              projects={projects}
              currentProjectId={currentProjectId || 0}
              use24Hour={use24Hour}
              onProjectChange={setCurrentProjectId}
              onNewProject={handleNewProject}
              onEditProject={handleEditProject}
              onExport={handleExport}
              setUse24Hour={setUse24Hour}
            />

            <CoupleInfo
              date={currentProject?.wedding_date || ""}
              onDateChange={handleCoupleInfoChange}
            />

            <ProjectTimeline
              events={events}
              currentProject={currentProject}
              use24Hour={use24Hour}
              onAddEvent={handleAddEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
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
