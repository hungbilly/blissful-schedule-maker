import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGuests } from "@/hooks/useGuests";
import { useGuestCategories } from "@/hooks/useGuestCategories";
import { Guest } from "@/components/project/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GuestListProps {
  guests: Guest[];
  onEditGuest: (guest: Guest) => void;
}

export const GuestListComponent = ({ guests, onEditGuest }: GuestListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const { updateGuest, deleteGuest } = useGuests();
  const { categories } = useGuestCategories();
  const { toast } = useToast();

  const handleEdit = (guest: Guest) => {
    setEditingId(guest.id);
    setEditingName(guest.name);
    const category = categories.find(c => c.name === guest.category);
    setEditingCategoryId(category?.id || null);
  };

  const handleSave = async () => {
    if (!editingId || !editingName.trim() || !editingCategoryId) {
      toast({
        title: "Error",
        description: "Name and category are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateGuest.mutateAsync({
        id: editingId,
        name: editingName.trim(),
        categoryId: editingCategoryId,
      });
      setEditingId(null);
      setEditingName("");
      setEditingCategoryId(null);
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

  const handleDelete = async (id: number) => {
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

  const sortedGuests = [...guests].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedGuests.map((guest) => (
          <div
            key={guest.id}
            className="bg-white p-4 rounded-lg shadow-sm space-y-2"
          >
            {editingId === guest.id ? (
              <div className="space-y-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full"
                />
                <Select
                  value={editingCategoryId?.toString() || ""}
                  onValueChange={(value) => setEditingCategoryId(Number(value))}
                >
                  <SelectTrigger className="w-full bg-white border-input">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-input shadow-md">
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
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingId(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{guest.name}</div>
                  {guest.category && (
                    <div className="text-sm text-gray-500">{guest.category}</div>
                  )}
                  {guest.table_name && (
                    <div className="text-sm text-gray-500">
                      Table: {guest.table_name}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(guest)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(guest.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};