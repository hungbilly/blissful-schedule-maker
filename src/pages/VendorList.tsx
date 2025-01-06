import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, User, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Vendor } from "@/components/project/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

const VendorList = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const form = useForm<Omit<Vendor, "id">>({
    defaultValues: {
      name: "",
      role: "",
      contactNumber: "",
      serviceDetails: "",
    },
  });

  // Redirect to login if not authenticated
  if (!session) {
    navigate("/");
    return null;
  }

  // Fetch vendors
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

  // Add vendor mutation
  const addVendorMutation = useMutation({
    mutationFn: async (newVendor: Omit<Vendor, "id">) => {
      const { data, error } = await supabase.from("vendors").insert([
        {
          name: newVendor.name,
          role: newVendor.role,
          contact_number: newVendor.contactNumber,
          service_details: newVendor.serviceDetails,
          user_id: session.user.id,
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      form.reset();
      toast({
        title: "Success",
        description: "Vendor has been added to the list",
      });
    },
    onError: (error) => {
      console.error("Error adding vendor:", error);
      toast({
        title: "Error",
        description: "Failed to add vendor. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Omit<Vendor, "id">) => {
    addVendorMutation.mutate(data);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-wedding-pink py-12">
          <div className="container max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-serif text-wedding-purple mb-2">Vendor List</h1>
              <p className="text-wedding-gray">Manage your wedding vendors and their details</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-serif text-wedding-purple mb-4">Add New Vendor</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter vendor name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Photographer, Caterer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter service details and notes"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Add Vendor
                    </Button>
                  </form>
                </Form>
              </div>

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
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default VendorList;