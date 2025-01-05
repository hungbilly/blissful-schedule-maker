import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Guest } from "@/components/project/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryManager } from "@/components/guest/CategoryManager";

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestCategory, setNewGuestCategory] = useState("");
  const [guestCategories, setGuestCategories] = useState<string[]>([
    "Bride's Friend",
    "Groom's Friend",
    "Bride's Family",
    "Groom's Family",
    "Colleague",
    "Parent's Friend",
    "Other"
  ]);
  const { toast } = useToast();

  const handleAddGuest = () => {
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

    const newGuest: Guest = {
      id: guests.length + 1,
      name: newGuestName,
      category: newGuestCategory,
    };

    setGuests([...guests, newGuest]);
    setNewGuestName("");
    setNewGuestCategory("");
    toast({
      title: "Success",
      description: "Guest added successfully",
    });
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setNewGuestName(guest.name);
    setNewGuestCategory(guest.category);
  };

  const handleUpdateGuest = () => {
    if (!editingGuest) return;

    const updatedGuests = guests.map((g) =>
      g.id === editingGuest.id
        ? {
            ...g,
            name: newGuestName,
            category: newGuestCategory,
          }
        : g
    );

    setGuests(updatedGuests);
    setEditingGuest(null);
    setNewGuestName("");
    setNewGuestCategory("");
    toast({
      title: "Success",
      description: "Guest updated successfully",
    });
  };

  const handleDeleteGuest = (id: number) => {
    setGuests(guests.filter((g) => g.id !== id));
    toast({
      title: "Success",
      description: "Guest deleted successfully",
    });
  };

  const handleAddCategory = (category: string) => {
    setGuestCategories([...guestCategories, category]);
  };

  const handleEditCategory = (oldCategory: string, newCategory: string) => {
    // Update the category in the categories list
    setGuestCategories(guestCategories.map(cat => 
      cat === oldCategory ? newCategory : cat
    ));

    // Update all guests with the old category to use the new category
    setGuests(guests.map(guest => ({
      ...guest,
      category: guest.category === oldCategory ? newCategory : guest.category
    })));
  };

  const handleDeleteCategory = (category: string) => {
    // Remove the category from the categories list
    setGuestCategories(guestCategories.filter(cat => cat !== category));

    // Update all guests with the deleted category to "Other"
    setGuests(guests.map(guest => ({
      ...guest,
      category: guest.category === category ? "Other" : guest.category
    })));
  };

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
                    {guestCategories.map((category) => (
                      <SelectItem 
                        key={category} 
                        value={category}
                        className="hover:bg-gray-100"
                      >
                        {category}
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

              <CategoryManager
                categories={guestCategories}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
              />
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
                      onClick={() => handleEditGuest(guest)}
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