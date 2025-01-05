import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { UserProfile } from "@/components/auth/UserProfile";
import { Link } from "react-router-dom";

export const AppSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <UserProfile />
      <NavigationMenu orientation="vertical" className="w-full">
        <NavigationMenuList className="flex-col items-start space-y-2 p-4">
          <NavigationMenuItem className="w-full">
            <Link to="/" className="w-full block px-4 py-2 text-sm rounded-md hover:bg-gray-100">
              Timeline
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full">
            <Link to="/vendors" className="w-full block px-4 py-2 text-sm rounded-md hover:bg-gray-100">
              Vendors
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full">
            <Link to="/budget" className="w-full block px-4 py-2 text-sm rounded-md hover:bg-gray-100">
              Budget
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full">
            <Link to="/guests" className="w-full block px-4 py-2 text-sm rounded-md hover:bg-gray-100">
              Guest List
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full">
            <Link to="/sitting-plan" className="w-full block px-4 py-2 text-sm rounded-md hover:bg-gray-100">
              Sitting Plan
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
};