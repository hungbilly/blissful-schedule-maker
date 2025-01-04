import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CategorySelectProps {
  category: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onAddCategory?: (category: string) => void;
}

export function CategorySelect({ 
  category, 
  categories, 
  onCategoryChange, 
  onAddCategory 
}: CategorySelectProps) {
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      if (onAddCategory) {
        onAddCategory(newCategory.trim());
        toast({
          title: "Success",
          description: `Category "${newCategory}" has been added`,
        });
      }
      setNewCategory("");
      setIsNewCategoryDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-32">
      <Select
        value={category}
        onValueChange={(value) => {
          if (value === "add_new") {
            setIsNewCategoryDialogOpen(true);
          } else {
            onCategoryChange(value);
          }
        }}
      >
        <SelectTrigger className="bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-md">
          {categories.map((cat) => (
            <SelectItem 
              key={cat} 
              value={cat} 
              className="hover:bg-wedding-pink/50 bg-white"
            >
              {cat}
            </SelectItem>
          ))}
          <SelectItem 
            value="add_new" 
            className="text-wedding-purple font-medium hover:bg-wedding-pink/50 bg-white"
          >
            + Add New
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog 
        open={isNewCategoryDialogOpen} 
        onOpenChange={(open) => {
          setIsNewCategoryDialogOpen(open);
          if (!open) setNewCategory("");
        }}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Enter a name for your new category
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-white"
              autoFocus
            />
            <Button type="submit" className="w-full">
              Add Category
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}