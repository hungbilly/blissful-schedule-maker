import { Button } from "@/components/ui/button";
import { Project } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

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
      <Select
        value={currentProjectId.toString()}
        onValueChange={(value) => onProjectChange(Number(value))}
      >
        <SelectTrigger className="w-[240px] bg-white/50 backdrop-blur-sm border-wedding-purple/20 text-wedding-purple font-serif">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-sm border-wedding-purple/20">
          {projects.map((project) => (
            <SelectItem
              key={project.id}
              value={project.id.toString()}
              className="font-serif text-wedding-purple focus:bg-wedding-pink/50 focus:text-wedding-purple relative pl-8"
            >
              <Check
                className={`h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 ${
                  project.id === currentProjectId
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        onClick={onNewProjectClick}
        className="text-wedding-purple hover:text-wedding-purple/80 hover:bg-wedding-pink/50"
      >
        +New Itinerary
      </Button>
    </div>
  );
};