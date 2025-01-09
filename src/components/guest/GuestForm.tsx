import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useGuests } from "@/hooks/useGuests";
import { GuestCategory, Guest } from "@/components/project/types";

interface GuestFormProps {
  categories: GuestCategory[];
  editingGuest?: Guest | null;
  onEditComplete?: () => void;
}

export const GuestForm = ({ categories, editingGuest, onEditComplete }: GuestFormProps) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const { addGuest, updateGuest } = useGuests();
  const { toast } = useToast();

  useEffect(() => {
    if (editingGuest) {
      setName(editingGuest.name);
      const category = categories.find(c => c.name === editingGuest.category);
      if (category) {
        setCategoryId(category.id.toString());
      }
    } else {
      setName("");
      setCategoryId("");
    }
  }, [editingGuest, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Guest name is required",
        variant: "destructive",
      });
      return;
    }

    if (!categoryId) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingGuest) {
        await updateGuest.mutateAsync({
          id: editingGuest.id,
          name: name.trim(),
          categoryId: Number(categoryId),
        });
        toast({
          title: "Success",
          description: "Guest updated successfully",
        });
        onEditComplete?.();
      } else {
        await addGuest.mutateAsync({
          name: name.trim(),
          categoryId: Number(categoryId),
        });
        toast({
          title: "Success",
          description: "Guest added successfully",
        });
        setName("");
        setCategoryId("");
      }
    } catch (error) {
      console.error("Error saving guest:", error);
      toast({
        title: "Error",
        description: "Failed to save guest",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Guest Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <Select
          value={categoryId}
          onValueChange={setCategoryId}
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
      </div>
      <Button type="submit" className="w-full">
        {editingGuest ? "Update Guest" : "Add Guest"}
      </Button>
    </form>
  );
};