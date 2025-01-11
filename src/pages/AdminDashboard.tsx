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

interface ProfileWithProjects {
  id: string;
  projects: Array<{
    id: number;
    wedding_date: string | null;
  }>;
}

const AdminDashboard = () => {
  const { toast } = useToast();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // First get all users from auth.users through profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          projects (
            id,
            wedding_date
          )
        `) as { data: ProfileWithProjects[] | null; error: Error | null };

      if (profilesError) {
        toast({
          title: "Error fetching profiles",
          description: profilesError.message,
          variant: "destructive",
        });
        throw profilesError;
      }

      // Then get user details from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        toast({
          title: "Error fetching users",
          description: authError.message,
          variant: "destructive",
        });
        throw authError;
      }

      // Combine the data
      return (profiles || []).map((profile) => {
        const authUser = authUsers?.users.find(user => user.id === profile.id);
        return {
          id: profile.id,
          email: authUser?.email || 'N/A',
          created_at: authUser?.created_at || new Date().toISOString(),
          projects: {
            count: profile.projects?.length || 0,
            latest_wedding_date: profile.projects?.[0]?.wedding_date || null,
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
            <TableHead>Email</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead>Projects Count</TableHead>
            <TableHead>Latest Wedding Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
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