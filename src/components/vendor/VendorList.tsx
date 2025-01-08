import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { VendorCard } from "./VendorCard";
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
        .order("name", { ascending: true });  // Changed to sort by name alphabetically

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
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};