import { Button } from "@/components/ui/button";
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
        className="text-wedding-purple font-serif text-lg border-b border-wedding-purple/50 bg-transparent px-4 py-2 focus:outline-none focus:border-wedding-purple"
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <Button variant="ghost" onClick={onNewProjectClick}>
        +New Itinerary
      </Button>
    </div>
  );
};