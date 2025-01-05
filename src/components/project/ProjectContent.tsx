import { useState } from "react";
import { Timeline } from "@/components/Timeline";
import { useToast } from "@/hooks/use-toast";
import { ProjectDialog } from "@/components/project/ProjectDialog";
import { TimelineEvent } from "@/components/project/types";
import { CoupleInfo } from "@/components/CoupleInfo";
import { exportToCSV } from "@/utils/exportUtils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProjectList } from "./ProjectList";
import { useProjects, useCreateProject, useUpdateProject } from "@/hooks/useProjects";

export const ProjectContent = () => {
  const [use24Hour, setUse24Hour] = useState(true);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [date, setDate] = useState("");
  const { toast } = useToast();

  const { data: projects = [] } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  
  const [currentProjectId, setCurrentProjectId] = useState<number>(
    projects[0]?.id || 0
  );

  const currentProject = projects.find((p) => p.id === currentProjectId);

  const handleAddEvent = (eventData: Omit<TimelineEvent, "id"> | TimelineEvent) => {
    if (!currentProject) return;

    const updatedProjects = projects.map((project) => {
      if (project.id !== currentProjectId) return project;

      let updatedEvents;
      if ('id' in eventData) {
        if (eventData.id === -1) {
          updatedEvents = project.events.filter(event => event.time !== eventData.time);
        } else {
          updatedEvents = project.events.map(event => 
            event.id === eventData.id ? eventData : event
          );
        }
      } else {
        const newEvent = {
          ...eventData,
          id: project.events.length + 1,
        };
        updatedEvents = [...project.events, newEvent];
      }

      return {
        ...project,
        events: updatedEvents,
      };
    });

    setProjects(updatedProjects);
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
      } else {
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-wedding-pink py-12">
          <div className="container max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <SidebarTrigger />
              <ProjectList
                projects={projects}
                currentProjectId={currentProjectId}
                use24Hour={use24Hour}
                onProjectChange={setCurrentProjectId}
                onNewProjectClick={handleNewProject}
                onEditProject={handleEditProject}
                onExport={handleExport}
                onTimeFormatChange={setUse24Hour}
              />
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
                events={currentProject.events || []}
                onAddEvent={handleAddEvent}
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
