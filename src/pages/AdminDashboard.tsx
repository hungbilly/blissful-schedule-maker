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

interface UserData {
  id: string;
  email: string;
  created_at: string;
  projects: {
    count: number;
    latest_wedding_date: string | null;
  };
}

const AdminDashboard = () => {
  const { toast } = useToast();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, created_at");

      if (profilesError) {
        toast({
          title: "Error fetching profiles",
          description: profilesError.message,
          variant: "destructive",
        });
        throw profilesError;
      }

      // Get projects for each profile
      const projectsPromises = (profiles || []).map(async (profile) => {
        const { data: projects } = await supabase
          .from("projects")
          .select("id, wedding_date")
          .eq("user_id", profile.id);
        return {
          id: profile.id,
          created_at: profile.created_at,
          projects: projects || [],
        };
      });

      const profilesWithProjects = await Promise.all(projectsPromises);

      // Format the data
      return profilesWithProjects.map((profile) => {
        return {
          id: profile.id,
          email: "Hidden for privacy", // We can't access emails without admin privileges
          created_at: profile.created_at,
          projects: {
            count: profile.projects.length,
            latest_wedding_date: profile.projects[0]?.wedding_date || null,
          },
        };
      }) as UserData[];
    },
  });

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
            <TableHead>Joined Date</TableHead>
            <TableHead>Projects Count</TableHead>
            <TableHead>Latest Wedding Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
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