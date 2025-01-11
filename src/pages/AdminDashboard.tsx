import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";
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
import { Button } from "@/components/ui/button";
import { Trash2, Key } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface UserData {
  id: string;
  email: string;
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
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<string | null>(null);

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error("Unauthorized access");
      }

      // Get all users with their emails first
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin
        .listUsers();

      if (authError) {
        toast({
          title: "Error fetching users",
          description: authError.message,
          variant: "destructive",
        });
        throw authError;
      }

      // Get all profiles with bride and groom names
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          bride_name,
          groom_name
        `);

      if (profilesError) {
        toast({
          title: "Error fetching profiles",
          description: profilesError.message,
          variant: "destructive",
        });
        throw profilesError;
      }

      // Combine auth users with their profile data
      const usersWithProfiles = authUsers.users.map(authUser => {
        const profile = profiles?.find(p => p.id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email || '',
          created_at: authUser.created_at,
          bride_name: profile?.bride_name,
          groom_name: profile?.groom_name,
          projects: {
            count: 0,
            latest_wedding_date: null,
          },
        };
      });

      // Then, for each user, get their projects
      const usersWithProjects = await Promise.all(
        usersWithProfiles.map(async (user) => {
          const { data: projectsData } = await supabase
            .from("projects")
            .select("id, wedding_date")
            .eq("user_id", user.id);

          return {
            ...user,
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

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User has been deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
    setUserToDelete(null);
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const user = users?.find(u => u.id === userId);
      if (!user?.email) {
        throw new Error("User email not found");
      }

      const { error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: user.email,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Password reset email has been sent to the user",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
    }
    setUserToResetPassword(null);
  };

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
            <TableHead>Email</TableHead>
            <TableHead>Bride Name</TableHead>
            <TableHead>Groom Name</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead>Projects Count</TableHead>
            <TableHead>Latest Wedding Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
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
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setUserToResetPassword(user.id)}
                >
                  <Key className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setUserToDelete(user.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Confirmation Dialog */}
      <AlertDialog open={!!userToResetPassword} onOpenChange={() => setUserToResetPassword(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              This will send a password reset email to the user. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToResetPassword && handleResetPassword(userToResetPassword)}
            >
              Send Reset Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;