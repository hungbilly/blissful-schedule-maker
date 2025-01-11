import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

export const NavigationLinks = () => {
  const session = useSession();
  const isAdmin = session?.user?.email === "admin@onair.wedding"; // You can adjust this condition based on your needs

  return (
    <nav className="flex-1 p-4">
      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          asChild
        >
          <Link to="/">Itinerary</Link>
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
          <Link to="/budget">Budget</Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          asChild
        >
          <Link to="/seating-plan">Seating Plan</Link>
        </Button>
        {isAdmin && (
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link to="/admin">Admin Dashboard</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};