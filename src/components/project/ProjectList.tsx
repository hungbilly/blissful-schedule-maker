import { Project } from "./types";
import { ProjectSelector } from "./ProjectSelector";
import { Button } from "@/components/ui/button";
import { Edit2, Download } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ProjectListProps {
  projects: Project[];
  currentProjectId: number;
  use24Hour: boolean;
  onProjectChange: (id: number) => void;
  onNewProjectClick: () => void;
  onEditProject: () => void;
  onExport: () => void;
  onTimeFormatChange: (use24Hour: boolean) => void;
}

export const ProjectList = ({
  projects,
  currentProjectId,
  use24Hour,
  onProjectChange,
  onNewProjectClick,
  onEditProject,
  onExport,
  onTimeFormatChange,
}: ProjectListProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <ProjectSelector
        projects={projects}
        currentProjectId={currentProjectId}
        onProjectChange={onProjectChange}
        onNewProjectClick={onNewProjectClick}
      />
      <div className="flex items-center space-x-4">
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
            onCheckedChange={onTimeFormatChange}
          />
        </div>
      </div>
    </div>
  );
};