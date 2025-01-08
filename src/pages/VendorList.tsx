import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { VendorForm } from "@/components/vendor/VendorForm";
import { VendorList as VendorListComponent } from "@/components/vendor/VendorList";

const VendorList = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!session) {
    navigate("/");
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-wedding-pink py-12 md:ml-64">
          <div className="container max-w-4xl px-4">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-serif text-wedding-purple mb-2">Vendor List</h1>
              <p className="text-wedding-gray">Manage your wedding vendors and their details</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <VendorForm />
              <VendorListComponent />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default VendorList;