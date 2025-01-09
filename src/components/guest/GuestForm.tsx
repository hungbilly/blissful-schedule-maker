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
  const [categoryId, setCategoryId] = useState("");
  const { addGuest, updateGuest } = useGuests();
  const { toast } = useToast();

  useEffect(() => {
    if (editingGuest) {
      setName(editingGuest.name);
      const category = categories.find(c => c.name === editingGuest.category);
      if (category) {
        setCategoryId(category.id.toString());
      }
    }
  }, [editingGuest, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingGuest) {
        await updateGuest.mutateAsync({
          id: editingGuest.id,
          name,
          categoryId: Number(categoryId),
        });
        toast({
          title: "Success",
          description: "Guest updated successfully",
        });
        onEditComplete?.();
      } else {
        await addGuest.mutateAsync({
          name,
          categoryId: Number(categoryId),
        });
        toast({
          title: "Success",
          description: "Guest added successfully",
        });
      }
      
      setName("");
      setCategoryId("");
    } catch (error) {
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
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
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