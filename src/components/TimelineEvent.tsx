import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

interface TimelineEventProps {
  time: string;
  title: string;
  description?: string;
  category: string;
  onEdit: (updates: Partial<{ time: string; title: string; description?: string; category: string }>) => void;
}

export function TimelineEvent({ time, title, description, category, onEdit }: TimelineEventProps) {
  const [editingField, setEditingField] = useState<"time" | "title" | "description" | "category" | null>(null);
  const [tempValue, setTempValue] = useState("");

  const handleEdit = (field: typeof editingField, value: string) => {
    if (field) {
      onEdit({ [field]: value });
      setEditingField(null);
    }
  };

  const startEditing = (field: typeof editingField, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  return (
    <div className="relative pl-12 pb-8">
      <div className="timeline-dot" />
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
        {editingField === "time" ? (
          <Input
            type="time"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => handleEdit("time", tempValue)}
            autoFocus
            className="w-24 font-medium text-wedding-purple"
          />
        ) : (
          <span 
            className="text-sm font-medium text-wedding-purple cursor-pointer hover:underline" 
            onClick={() => startEditing("time", time)}
          >
            {time}
          </span>
        )}

        {editingField === "title" ? (
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => handleEdit("title", tempValue)}
            autoFocus
            className="text-lg font-serif mt-2 text-gray-800"
          />
        ) : (
          <h3 
            className="text-lg font-serif mt-2 text-gray-800 cursor-pointer hover:underline"
            onClick={() => startEditing("title", title)}
          >
            {title}
          </h3>
        )}

        {editingField === "description" ? (
          <Textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => handleEdit("description", tempValue)}
            autoFocus
            className="mt-2 text-gray-600 text-sm"
          />
        ) : description ? (
          <p 
            className="mt-2 text-gray-600 text-sm cursor-pointer hover:underline"
            onClick={() => startEditing("description", description)}
          >
            {description}
          </p>
        ) : (
          <p 
            className="mt-2 text-gray-600 text-sm cursor-pointer hover:underline italic"
            onClick={() => startEditing("description", "")}
          >
            Add description...
          </p>
        )}

        {editingField === "category" ? (
          <Select
            value={tempValue}
            onValueChange={(value) => {
              handleEdit("category", value);
            }}
          >
            <SelectTrigger className="w-32 mt-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ceremony">Ceremony</SelectItem>
              <SelectItem value="Reception">Reception</SelectItem>
              <SelectItem value="Photos">Photos</SelectItem>
              <SelectItem value="Setup">Setup</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <span 
            className="inline-block mt-3 px-3 py-1 bg-wedding-pink rounded-full text-xs font-medium text-wedding-purple cursor-pointer hover:underline"
            onClick={() => startEditing("category", category)}
          >
            {category}
          </span>
        )}
      </div>
    </div>
  );
}