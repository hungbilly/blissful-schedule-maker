import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useSession } from "@supabase/auth-helpers-react";

interface UserData {
  id: string;
  created_at: string;
  bride_name: string | null;
  groom_name: string | null;
  projects: {
    count: number;
    latest_wedding_date: string | null;
  };
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const session = useSession();
  const isAdmin = session?.user?.email === "admin@onair.wedding";

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error("Unauthorized access");
      }

      // First, get all profiles with bride and groom names
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, created_at, bride_name, groom_name");

      if (profilesError) {
        toast({
          title: "Error fetching profiles",
          description: profilesError.message,
          variant: "destructive",
        });
        throw profilesError;
      }

      // Then, for each profile, get their projects
      const usersWithProjects = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: projectsData } = await supabase
            .from("projects")
            .select("id, wedding_date")
            .eq("user_id", profile.id);

          return {
            id: profile.id,
            created_at: profile.created_at,
            bride_name: profile.bride_name,
            groom_name: profile.groom_name,
            projects: {
              count: projectsData?.length || 0,
              latest_wedding_date: projectsData?.[0]?.wedding_date || null,
            },
          };
        })
      );

      return usersWithProjects as UserData[];
    },
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return <div className="p-8 text-red-500">Unauthorized: Admin access required</div>;
  }

  if (isLoading) {
    return <div className="p-8">Loading users...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading users</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Bride Name</TableHead>
            <TableHead>Groom Name</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead>Projects Count</TableHead>
            <TableHead>Latest Wedding Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.bride_name || "Not set"}</TableCell>
              <TableCell>{user.groom_name || "Not set"}</TableCell>
              <TableCell>
                {format(new Date(user.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{user.projects.count}</TableCell>
              <TableCell>
                {user.projects.latest_wedding_date
                  ? format(
                      new Date(user.projects.latest_wedding_date),
                      "MMM d, yyyy"
                    )
                  : "Not set"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboard;