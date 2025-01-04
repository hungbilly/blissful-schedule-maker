import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Project } from "./types";

interface ProjectSelectorProps {
  projects: Project[];
  currentProjectId: number;
  onProjectChange: (id: number) => void;
  onNewProjectClick: () => void;
}

export const ProjectSelector = ({
  projects,
  currentProjectId,
  onProjectChange,
  onNewProjectClick,
}: ProjectSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <select
        value={currentProjectId}
        onChange={(e) => onProjectChange(Number(e.target.value))}
        className="px-3 py-2 border rounded-md bg-white"
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <Button variant="outline" onClick={onNewProjectClick}>
        <Plus className="h-4 w-4 mr-2" />
        New Project
      </Button>
    </div>
  );
};