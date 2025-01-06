import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useGuests } from "@/hooks/useGuests";

interface GuestFormProps {
  categories: Array<{ id: number; name: string }>;
}

export const GuestForm = ({ categories }: GuestFormProps) => {
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestCategory, setNewGuestCategory] = useState("");
  const { addGuest } = useGuests();
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

  return (
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
        onClick={handleAddGuest}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Guest
      </Button>
    </div>
  );
};