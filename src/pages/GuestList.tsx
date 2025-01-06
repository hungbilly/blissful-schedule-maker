import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, User, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryManager } from "@/components/guest/CategoryManager";
import { exportGuestsToCSV } from "@/utils/guestExportUtils";
import { useGuests } from "@/hooks/useGuests";
import { useGuestCategories } from "@/hooks/useGuestCategories";
import { useProjectData } from "@/components/project/useProjectData";

export default function GuestList() {
  const { currentProject } = useProjectData();
  const { guests, guestsLoading, addGuest, updateGuest, deleteGuest } = useGuests(currentProject?.id ?? null);
  const { categories, categoriesLoading } = useGuestCategories(currentProject?.id ?? null);
  
  const [editingGuest, setEditingGuest] = useState<number | null>(null);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestCategory, setNewGuestCategory] = useState("");
  const { toast } = useToast();

  const handleAddGuest = async () => {
    if (!newGuestName.trim()) {
      toast({
        title: "Error",
        description: "Guest name is required",
        variant: "destructive",
      });
      return;
    }

    if (!newGuestCategory) {
      toast({
        title: "Error",
        description: "Please select a guest category",
        variant: "destructive",
      });
      return;
    }

    try {
      await addGuest.mutateAsync({
        name: newGuestName.trim(),
        categoryId: parseInt(newGuestCategory),
      });
      
      setNewGuestName("");
      setNewGuestCategory("");
      toast({
        title: "Success",
        description: "Guest added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add guest",
        variant: "destructive",
      });
    }
  };

  const handleUpdateGuest = async () => {
    if (!editingGuest) return;

    try {
      await updateGuest.mutateAsync({
        id: editingGuest,
        name: newGuestName.trim(),
        categoryId: parseInt(newGuestCategory),
      });

      setEditingGuest(null);
      setNewGuestName("");
      setNewGuestCategory("");
      toast({
        title: "Success",
        description: "Guest updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update guest",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGuest = async (id: number) => {
    try {
      await deleteGuest.mutateAsync(id);
      toast({
        title: "Success",
        description: "Guest deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete guest",
        variant: "destructive",
      });
    }
  };

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
                <Input
                  placeholder="Guest Name"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                />
                <Select
                  value={newGuestCategory}
                  onValueChange={setNewGuestCategory}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select guest category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-md">
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id.toString()}
                        className="hover:bg-gray-100"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={editingGuest ? handleUpdateGuest : handleAddGuest}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {editingGuest ? "Update Guest" : "Add Guest"}
                </Button>
              </div>

              <CategoryManager projectId={currentProject.id} />
            </div>

            <div className="mt-8 space-y-4">
              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <User className="text-wedding-purple" />
                    <div>
                      <h3 className="font-medium">{guest.name}</h3>
                      <div className="text-sm text-gray-500">
                        Category: {guest.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingGuest(guest.id);
                        setNewGuestName(guest.name);
                        setNewGuestCategory(guest.category);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGuest(guest.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}