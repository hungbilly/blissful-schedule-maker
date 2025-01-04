import { useState } from "react";
import { Timeline } from "@/components/Timeline";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProjectSelector } from "@/components/project/ProjectSelector";
import { ProjectDialog } from "@/components/project/ProjectDialog";
import { Project, TimelineEvent } from "@/components/project/types";
import { Edit2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
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
        },
        {
          id: 2,
          time: "15:00",
          endTime: "15:45",
          duration: "45m",
          title: "Photo Session",
          description: "Family and couple photos in the garden",
        },
        {
          id: 3,
          time: "16:00",
          endTime: "20:00",
          duration: "4h",
          title: "Reception",
          description: "Cocktail hour and dinner",
        },
      ],
    },
  ]);

  const [currentProjectId, setCurrentProjectId] = useState(1);
  const [use24Hour, setUse24Hour] = useState(true);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
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

  return (
    <div className="min-h-screen bg-wedding-pink py-12">
      <div className="container max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <ProjectSelector
            projects={projects}
            currentProjectId={currentProjectId}
            onProjectChange={setCurrentProjectId}
            onNewProjectClick={handleNewProject}
          />
          <div className="flex items-center space-x-4">
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

        <div className="bg-white rounded-lg p-6 mb-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative">
            <div className="flex-1 w-full md:w-auto">
              <Input
                placeholder="Bride's Name"
                value={bride}
                onChange={(e) => setBride(e.target.value)}
                className="bg-[#FFDEE2]/30 border-[#FFDEE2] focus:border-[#FFDEE2] text-center font-serif"
              />
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden md:block">
              <Heart className="text-wedding-purple h-6 w-6" />
            </div>
            <div className="flex-1 w-full md:w-auto">
              <Input
                placeholder="Groom's Name"
                value={groom}
                onChange={(e) => setGroom(e.target.value)}
                className="bg-[#D3E4FD]/30 border-[#D3E4FD] focus:border-[#D3E4FD] text-center font-serif"
              />
            </div>
          </div>
        </div>

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

      <ProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onSubmit={handleProjectSubmit}
        initialName={dialogMode === "edit" ? currentProject?.name : ""}
        mode={dialogMode}
      />
    </div>
  );
};

export default Index;