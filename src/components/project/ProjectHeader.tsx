import { ProjectSelector } from "./ProjectSelector";
import { Button } from "@/components/ui/button";
import { Download, Edit2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Project } from "./types";

interface ProjectHeaderProps {
  projects: Project[];
  currentProjectId: number;
  use24Hour: boolean;
  onProjectChange: (id: number) => void;
  onNewProject: () => void;
  onEditProject: () => void;
  onExport: () => void;
  setUse24Hour: (value: boolean) => void;
}

export const ProjectHeader = ({
  projects,
  currentProjectId,
  use24Hour,
  onProjectChange,
  onNewProject,
  onEditProject,
  onExport,
  setUse24Hour,
}: ProjectHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
      <div className="w-full sm:w-auto">
        <ProjectSelector
          projects={projects}
          currentProjectId={currentProjectId}
          onProjectChange={onProjectChange}
          onNewProjectClick={onNewProject}
        />
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto justify-start sm:justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={onExport}
          className="h-10 w-10"
          title="Download rundown"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onEditProject}
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
  );
};