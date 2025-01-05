import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { BudgetItem as BudgetItemType } from "@/components/project/types";

interface BudgetItemProps {
  item: BudgetItemType;
  onUpdate: (updatedItem: BudgetItemType) => void;
  onDelete: (itemId: number) => void;
}

export const BudgetItem = ({ item, onUpdate, onDelete }: BudgetItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [editedAmount, setEditedAmount] = useState(item.amount);

  const handleSave = () => {
    onUpdate({
      ...item,
      title: editedTitle,
      amount: editedAmount,
    });
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedTitle(item.title);
      setEditedAmount(item.amount);
    }
  };

  return (
    <div
      className="flex items-center justify-between py-2 border-b hover:bg-gray-50 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {isEditing ? (
        <>
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            className="w-48"
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>$</span>
              <Input
                type="number"
                value={editedAmount}
                onChange={(e) => setEditedAmount(Number(e.target.value))}
                onKeyDown={handleKeyPress}
                className="w-24"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleSave()}>
              ✓
            </Button>
          </div>
        </>
      ) : (
        <>
          <span>{item.title}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>$</span>
              <span>{item.amount}</span>
            </div>
            {isHovered && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};