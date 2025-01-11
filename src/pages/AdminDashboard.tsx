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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  vendors: Array<{
    name: string;
    role: string;
  }>;
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

      // Get all profiles with bride and groom names
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          created_at,
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

      // Then, for each profile, get their projects and vendors
      const usersWithData = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: projectsData } = await supabase
            .from("projects")
            .select("id, wedding_date")
            .eq("user_id", profile.id);

          const { data: vendorsData } = await supabase
            .from("vendors")
            .select("name, role")
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
            vendors: vendorsData || [],
          };
        })
      );

      return usersWithData as UserData[];
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
            <React.Fragment key={user.id}>
              <TableRow>
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
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="vendors">
                      <AccordionTrigger className="px-4">
                        View Vendors ({user.vendors.length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="px-4 py-2">
                          {user.vendors.length > 0 ? (
                            <div className="space-y-2">
                              {user.vendors.map((vendor, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between border-b border-gray-200 py-2"
                                >
                                  <span className="font-medium">{vendor.name}</span>
                                  <span className="text-gray-600">
                                    {vendor.role}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">No vendors found</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboard;