import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import { format } from "date-fns";
import { useProjectData } from "@/components/project/useProjectData";
import { useProjects } from "@/hooks/useProjects";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const AppSidebar = () => {
  const { data: projects = [] } = useProjects();
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  
  useEffect(() => {
    if (projects.length > 0 && currentProjectId === null) {
      setCurrentProjectId(projects[0].id);
    }
  }, [projects, currentProjectId]);

  const { currentProject, isLoading } = useProjectData(currentProjectId);
  const { updateProjectDetails } = useProjectDetails(currentProjectId);

  if (isLoading || !currentProject) {
    return null;
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {currentProject.name}
        </h2>
        {currentProject.wedding_date && (
          <p className="text-sm text-gray-500">
            {format(new Date(currentProject.wedding_date), "MMMM d, yyyy")}
          </p>
        )}
        {(currentProject.bride_name || currentProject.groom_name) && (
          <p className="text-sm text-gray-600 mt-1">
            {currentProject.bride_name} & {currentProject.groom_name}
          </p>
        )}
      </div>
      
      <Separator />
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link to="/">Overview</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link to="/guests">Guest List</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link to="/vendors">Venues & Vendors</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link to="/budget">Planning Tools</Link>
          </Button>
        </div>
      </nav>
    </aside>
  );
};