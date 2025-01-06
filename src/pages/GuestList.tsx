import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CategoryManager } from "@/components/guest/CategoryManager";
import { exportGuestsToCSV } from "@/utils/guestExportUtils";
import { useGuests } from "@/hooks/useGuests";
import { useGuestCategories } from "@/hooks/useGuestCategories";
import { useProjectData } from "@/components/project/useProjectData";
import { GuestForm } from "@/components/guest/GuestForm";
import { GuestListComponent } from "@/components/guest/GuestList";
import { Guest } from "@/components/project/types";

export default function GuestList() {
  const { currentProject } = useProjectData("guests");
  const { guests, guestsLoading } = useGuests(currentProject?.id ?? null);
  const { categories, categoriesLoading } = useGuestCategories(currentProject?.id ?? null);
  
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const { toast } = useToast();

  const handleExportCSV = () => {
    if (guests.length === 0) {
      toast({
        title: "Error",
        description: "No guests to export",
        variant: "destructive",
      });
      return;
    }
    
    exportGuestsToCSV(guests);
    toast({
      title: "Success",
      description: "Guest list exported successfully",
    });
  };

  if (!currentProject) {
    return <div>Please select a project first</div>;
  }

  if (guestsLoading || categoriesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-serif text-wedding-purple">
                Guest List ({guests.length} guests)
              </h1>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <GuestForm 
                  projectId={currentProject.id} 
                  categories={categories}
                />
              </div>

              <CategoryManager projectId={currentProject.id} />
            </div>

            <GuestListComponent
              projectId={currentProject.id}
              guests={guests}
              onEditGuest={setEditingGuest}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}