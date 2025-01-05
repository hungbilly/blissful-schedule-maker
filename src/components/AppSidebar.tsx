import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { UserProfile } from "@/components/auth/UserProfile";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import { format } from "date-fns";
import { useProjectData } from "@/components/project/useProjectData";

export const AppSidebar = () => {
  const { currentProject } = useProjectData(null);
  const { updateProjectDetails } = useProjectDetails(currentProject?.id || null);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      {/* Project Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-wedding-pink rounded-full flex items-center justify-center">
            <span className="text-white text-lg">
              {currentProject?.bride_name?.[0]}
              {currentProject?.groom_name?.[0]}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-medium text-gray-900">
              {currentProject?.bride_name} & {currentProject?.groom_name}
            </h2>
            {currentProject?.wedding_date && (
              <p className="text-xs text-gray-500">
                {format(new Date(currentProject.wedding_date), "dd MMMM yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>

      <UserProfile />

      <NavigationMenu orientation="vertical" className="w-full flex-1">
        <NavigationMenuList className="flex-col items-start space-y-1 p-2">
          {/* Main Navigation */}
          <NavigationMenuItem className="w-full">
            <Link to="/" className="w-full block px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-900">
              Overview
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full">
            <Link to="/guests" className="w-full block px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-900">
              Guest List
            </Link>
          </NavigationMenuItem>

          {/* Venues & Vendors Section */}
          <div className="w-full pt-4">
            <div className="px-3 py-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Venues & Vendors
              </span>
            </div>
            <NavigationMenuItem className="w-full">
              <Link to="/vendors" className="w-full block px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-900">
                All Vendors
              </Link>
            </NavigationMenuItem>
          </div>

          {/* Planning Tools Section */}
          <div className="w-full pt-4">
            <div className="px-3 py-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Planning Tools
              </span>
            </div>
            <NavigationMenuItem className="w-full">
              <Link to="/budget" className="w-full block px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-900">
                Budget
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="w-full">
              <Link to="/sitting-plan" className="w-full block px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-900">
                Seating Chart & Supplies
              </Link>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
};