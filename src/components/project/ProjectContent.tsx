import { useState } from "react";
import { Timeline } from "@/components/Timeline";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProjectSelector } from "@/components/project/ProjectSelector";
import { ProjectDialog } from "@/components/project/ProjectDialog";
import { Project, TimelineEvent } from "@/components/project/types";
import { Edit2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoupleInfo } from "@/components/CoupleInfo";
import { exportToCSV } from "@/utils/exportUtils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export const ProjectContent = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Wedding Day",
      events: [
        {
          id: 1,
          time: "14:00",
          endTime: "14:30",
          duration: "30m",
          title: "Wedding Ceremony",
          description: "Exchange of vows at the main chapel",
          location: "Main Chapel",
        },
        {
          id: 2,
          time: "15:00",
          endTime: "15:45",
          duration: "45m",
          title: "Photo Session",
          description: "Family and couple photos in the garden",
          location: "Garden",
        },
        {
          id: 3,
          time: "16:00",
          endTime: "20:00",
          duration: "4h",
          title: "Reception",
          description: "Cocktail hour and dinner",
          location: "Grand Ballroom",
        },
      ],
      vendors: [],
    },
  ]);

  const [currentProjectId, setCurrentProjectId] = useState(1);
  const [use24Hour, setUse24Hour] = useState(true);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [date, setDate] = useState("");
  const { toast } = useToast();

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

  const handleProjectSubmit = (name: string) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    if (dialogMode === "create") {
      const newProject: Project = {
        id: projects.length + 1,
        name,
        events: [],
        vendors: [],
      };
      setProjects([...projects, newProject]);
      setCurrentProjectId(newProject.id);
      toast({
        title: "Success",
        description: `Project "${name}" has been created`,
      });
    } else {
      setProjects(
        projects.map((project) =>
          project.id === currentProjectId
            ? { ...project, name }
            : project
        )
      );
      toast({
        title: "Success",
        description: `Project name has been updated to "${name}"`,
      });
    }
    setIsProjectDialogOpen(false);
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
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <ProjectSelector
                  projects={projects}
                  currentProjectId={currentProjectId}
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
                events={currentProject.events}
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
