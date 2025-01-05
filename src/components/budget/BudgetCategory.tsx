import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetItem } from "./BudgetItem";
import { BudgetCategory as BudgetCategoryType, BudgetItem as BudgetItemType } from "@/components/project/types";
import { useState } from "react";

interface BudgetCategoryProps {
  category: BudgetCategoryType;
  onUpdateItem: (categoryId: number, updatedItem: BudgetItemType) => void;
  onDeleteItem: (categoryId: number, itemId: number) => void;
  onAddItem: (categoryId: number, title: string, amount: number) => void;
  onDeleteCategory: (categoryId: number) => void;
}

export const BudgetCategory = ({
  category,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onDeleteCategory,
}: BudgetCategoryProps) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemAmount, setNewItemAmount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddItem = () => {
    if (newItemTitle.trim()) {
      onAddItem(category.id, newItemTitle, newItemAmount);
      setNewItemTitle("");
      setNewItemAmount(0);
      setIsAddingItem(false);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-6 space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-serif text-wedding-purple">{category.name}</h3>
        {isHovered && (
          <Button
            variant="ghost"
            size="icon"
            className="text-wedding-purple hover:bg-wedding-pink/10"
            onClick={() => onDeleteCategory(category.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {category.items.map((item) => (
          <BudgetItem
            key={item.id}
            item={item}
            onUpdate={(updatedItem) => onUpdateItem(category.id, updatedItem)}
            onDelete={(itemId) => onDeleteItem(category.id, itemId)}
          />
        ))}
      </div>
      {isAddingItem ? (
        <div className="flex items-center gap-4 pt-2">
          <input
            type="text"
            placeholder="Item name"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          />
          <div className="flex items-center gap-2">
            <span>$</span>
            <input
              type="number"
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(Number(e.target.value))}
              className="w-24 px-3 py-2 border rounded"
            />
          </div>
          <Button onClick={handleAddItem}>Add</Button>
          <Button variant="ghost" onClick={() => setIsAddingItem(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        isHovered && (
          <Button
            variant="ghost"
            className="w-full mt-2 text-wedding-purple hover:bg-wedding-pink/10"
            onClick={() => setIsAddingItem(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add new item
          </Button>
        )
      )}
    </div>
  );
};