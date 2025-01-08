import { User, Phone, FileText, Link as LinkIcon, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditVendorDialog } from "./EditVendorDialog";
import { Vendor } from "../project/types";

export const VendorList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching vendors:", error);
        throw error;
      }

      return data.map((vendor) => ({
        id: vendor.id,
        name: vendor.name,
        role: vendor.role,
        contactNumber: vendor.contact_number,
        serviceDetails: vendor.service_details,
        socialMedia: vendor.social_media,
      })) as Vendor[];
    },
  });

  const updateVendorMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Omit<Vendor, "id"> }) => {
      const { error } = await supabase
        .from("vendors")
        .update({
          name: data.name,
          role: data.role,
          contact_number: data.contactNumber,
          service_details: data.serviceDetails,
          social_media: data.socialMedia,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({
        title: "Success",
        description: "Vendor has been updated",
      });
    },
    onError: (error) => {
      console.error("Error updating vendor:", error);
      toast({
        title: "Error",
        description: "Failed to update vendor. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("vendors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({
        title: "Success",
        description: "Vendor has been deleted",
      });
    },
    onError: (error) => {
      console.error("Error deleting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to delete vendor. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = (id: number, data: Omit<Vendor, "id">) => {
    updateVendorMutation.mutate({ id, data });
  };

  const handleDelete = (id: number) => {
    deleteVendorMutation.mutate(id);
  };

  return (
    <div>
      <h2 className="text-xl font-serif text-wedding-purple mb-4">Vendor List</h2>
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-wedding-gray bg-white rounded-lg">
            Loading vendors...
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-8 text-wedding-gray bg-white rounded-lg">
            No vendors added yet
          </div>
        ) : (
          vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white p-4 rounded-lg shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-wedding-purple" />
                  <h3 className="font-medium">{vendor.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <EditVendorDialog
                    vendor={vendor}
                    onSave={(data) => handleUpdate(vendor.id, data)}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this vendor? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(vendor.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <p className="text-sm text-wedding-gray">{vendor.role}</p>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-wedding-gray" />
                <span>{vendor.contactNumber}</span>
              </div>
              {vendor.socialMedia && (
                <div className="flex items-center space-x-2 text-sm">
                  <LinkIcon className="h-4 w-4 text-wedding-gray" />
                  <span className="text-wedding-gray">{vendor.socialMedia}</span>
                </div>
              )}
              {vendor.serviceDetails && (
                <div className="flex items-start space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-wedding-gray mt-1" />
                  <p className="text-wedding-gray">{vendor.serviceDetails}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};