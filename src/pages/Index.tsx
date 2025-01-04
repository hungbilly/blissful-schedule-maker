import { useState } from "react";
import { Timeline } from "@/components/Timeline";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TimelineEvent {
  id: number;
  time: string;
  endTime: string;
  duration: string;
  title: string;
  description?: string;
  category: string;
}

interface Project {
  id: number;
  name: string;
  events: TimelineEvent[];
}

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
          category: "Ceremony",
        },
        {
          id: 2,
          time: "15:00",
          endTime: "15:45",
          duration: "45m",
          title: "Photo Session",
          description: "Family and couple photos in the garden",
          category: "Photos",
        },
        {
          id: 3,
          time: "16:00",
          endTime: "20:00",
          duration: "4h",
          title: "Reception",
          description: "Cocktail hour and dinner",
          category: "Reception",
        },
      ],
    },
  ]);

  const [currentProjectId, setCurrentProjectId] = useState(1);
  const [use24Hour, setUse24Hour] = useState(true);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const { toast } = useToast();

  const currentProject = projects.find((p) => p.id === currentProjectId);

  const handleAddEvent = (eventData: Omit<TimelineEvent, "id"> | TimelineEvent) => {
    if (!currentProject) return;

    const updatedProjects = projects.map((project) => {
      if (project.id !== currentProjectId) return project;

      let updatedEvents;
      if ('id' in eventData) {
        if (eventData.id === -1) {
          // This is a delete operation
          updatedEvents = project.events.filter(event => event.time !== eventData.time);
        } else {
          // This is an update to an existing event
          updatedEvents = project.events.map(event => 
            event.id === eventData.id ? eventData : event
          );
        }
      } else {
        // This is a new event
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

  const handleAddProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: projects.length + 1,
      name: newProjectName,
      events: [],
    };

    setProjects([...projects, newProject]);
    setCurrentProjectId(newProject.id);
    setNewProjectName("");
    setIsNewProjectDialogOpen(false);

    toast({
      title: "Success",
      description: `Project "${newProjectName}" has been created`,
    });
  };

  return (
    <div className="min-h-screen bg-wedding-pink py-12">
      <div className="container max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <select
              value={currentProjectId}
              onChange={(e) => setCurrentProjectId(Number(e.target.value))}
              className="px-3 py-2 border rounded-md bg-white"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => setIsNewProjectDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="24h-mode">24h</Label>
            <Switch
              id="24h-mode"
              checked={use24Hour}
              onCheckedChange={setUse24Hour}
            />
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

      <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Enter project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddProject();
                }
              }}
            />
            <Button onClick={handleAddProject} className="w-full">
              Create Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;