import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CategoryManagerProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onEditCategory: (oldCategory: string, newCategory: string) => void;
  onDeleteCategory: (category: string) => void;
}

export const CategoryManager = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive",
      });
      return;
    }

    onAddCategory(newCategory.trim());
    setNewCategory("");
    setIsAdding(false);
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const handleEditCategory = (category: string) => {
    if (!editedName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (categories.includes(editedName.trim()) && editedName.trim() !== category) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive",
      });
      return;
    }

    onEditCategory(category, editedName.trim());
    setEditingCategory(null);
    setEditedName("");
    toast({
      title: "Success",
      description: "Category updated successfully",
    });
  };

  const handleDeleteCategory = (category: string) => {
    onDeleteCategory(category);
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Categories</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="text-wedding-purple hover:bg-wedding-pink/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isAdding && (
        <div className="flex items-center gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-1"
          />
          <Button onClick={handleAddCategory}>Add</Button>
          <Button variant="ghost" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category}
            className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
          >
            {editingCategory === category ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => handleEditCategory(category)}>Save</Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingCategory(null);
                    setEditedName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <span>{category}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingCategory(category);
                      setEditedName(category);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};