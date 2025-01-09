import { CoupleInfo } from "@/components/CoupleInfo";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "./types";
import { useProjectDetails } from "@/hooks/useProjectDetails";

interface ProjectDetailsProps {
  currentProject: Project | null;
  currentProjectId: number | null;
}

export const ProjectDetails = ({ currentProject, currentProjectId }: ProjectDetailsProps) => {
  const { updateProjectDetails } = useProjectDetails(currentProjectId);

  const handleDateChange = async (date: string) => {
    if (!currentProjectId) return;
    await updateProjectDetails.mutateAsync({ date });
  };

  const handleDescriptionChange = async (description: string) => {
    if (!currentProjectId) return;
    await updateProjectDetails.mutateAsync({ description });
  };

  return (
    <div className="space-y-6 mb-8">
      <CoupleInfo
        date={currentProject?.wedding_date || ""}
        onDateChange={handleDateChange}
      />
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add a description for your wedding project..."
          value={currentProject?.description || ""}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};