import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

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

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && onAddCategory) {
      onAddCategory(newCategory.trim());
      onCategoryChange(newCategory.trim());
      setNewCategory("");
      setIsNewCategoryDialogOpen(false);
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
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-md">
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat} className="hover:bg-wedding-pink/50">{cat}</SelectItem>
          ))}
          <SelectItem value="add_new" className="text-wedding-purple font-medium hover:bg-wedding-pink/50">
            + Add New
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
        <DialogContent>
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