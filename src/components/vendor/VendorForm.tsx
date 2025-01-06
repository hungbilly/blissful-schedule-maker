import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const VendorForm = () => {
  const { session } = useSessionContext();
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

  // Add vendor mutation
  const addVendorMutation = useMutation({
    mutationFn: async (newVendor: Omit<Vendor, "id">) => {
      const { data, error } = await supabase.from("vendors").insert([
        {
          name: newVendor.name,
          role: newVendor.role,
          contact_number: newVendor.contactNumber,
          service_details: newVendor.serviceDetails,
          user_id: session?.user.id,
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
  );
};