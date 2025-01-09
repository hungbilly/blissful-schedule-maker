import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CategoryManager } from "@/components/guest/CategoryManager";
import { exportGuestsToCSV, exportGuestsToXLSX } from "@/utils/guestExportUtils";
import { useGuests } from "@/hooks/useGuests";
import { useGuestCategories } from "@/hooks/useGuestCategories";
import { GuestForm } from "@/components/guest/GuestForm";
import { GuestListComponent } from "@/components/guest/GuestList";
import { Guest } from "@/components/project/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTables } from "@/hooks/useTables";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function GuestList() {
  const { guests, guestsLoading } = useGuests();
  const { categories, categoriesLoading } = useGuestCategories();
  const { tables, tablesLoading } = useTables();
  
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const { toast } = useToast();

  const handleExport = (type: 'csv' | 'excel') => {
    if (guests.length === 0) {
      toast({
        title: "Error",
        description: "No guests to export",
        variant: "destructive",
      });
      return;
    }
    
    if (type === 'csv') {
      exportGuestsToCSV(guests, tables);
    } else {
      exportGuestsToXLSX(guests, tables);
    }
    
    toast({
      title: "Success",
      description: "Guest list exported successfully",
    });
  };

  if (guestsLoading || categoriesLoading || tablesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-8 md:ml-64 bg-wedding-pink min-h-screen">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8 mt-8 md:mt-0">
                <div className="pl-12 md:pl-0">
                  <h1 className="text-3xl font-serif text-wedding-purple">
                    Guest List
                  </h1>
                  <p className="text-sm text-wedding-gray mt-1">
                    {guests.length} guests
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex items-center justify-center"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end"
                    className="bg-white border border-input shadow-md min-w-[8rem] z-50"
                  >
                    <DropdownMenuItem 
                      onClick={() => handleExport('csv')}
                      className="hover:bg-gray-100"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleExport('excel')}
                      className="hover:bg-gray-100"
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <GuestForm 
                    categories={categories}
                    editingGuest={editingGuest}
                    onEditComplete={() => setEditingGuest(null)}
                  />
                </div>

                <CategoryManager />
              </div>

              <GuestListComponent
                guests={guests}
                onEditGuest={setEditingGuest}
              />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}