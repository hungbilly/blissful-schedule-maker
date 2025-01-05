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

const VendorList = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const { toast } = useToast();
  const form = useForm<Omit<Vendor, "id">>({
    defaultValues: {
      name: "",
      role: "",
      contactNumber: "",
      serviceDetails: "",
    },
  });

  const onSubmit = (data: Omit<Vendor, "id">) => {
    const newVendor: Vendor = {
      ...data,
      id: vendors.length + 1,
    };
    setVendors([...vendors, newVendor]);
    form.reset();
    toast({
      title: "Success",
      description: "Vendor has been added to the list",
    });
  };

  return (
    <div className="min-h-screen bg-wedding-pink py-12">
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
              {vendors.length === 0 ? (
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
                      <span>{vendor.contactNumber}</span>
                    </div>
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
        </div>
      </div>
    </div>
  );
};

export default VendorList;