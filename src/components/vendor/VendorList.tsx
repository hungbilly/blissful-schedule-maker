import { User, Phone, FileText, Link as LinkIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const VendorList = () => {
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

      return data || [];
    },
  });

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
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-wedding-purple" />
                <h3 className="font-medium">{vendor.name}</h3>
              </div>
              <p className="text-sm text-wedding-gray">{vendor.role}</p>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-wedding-gray" />
                <span>{vendor.contact_number}</span>
              </div>
              {vendor.social_media && (
                <div className="flex items-center space-x-2 text-sm">
                  <LinkIcon className="h-4 w-4 text-wedding-gray" />
                  <span className="text-wedding-gray">{vendor.social_media}</span>
                </div>
              )}
              {vendor.service_details && (
                <div className="flex items-start space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-wedding-gray mt-1" />
                  <p className="text-wedding-gray">{vendor.service_details}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};