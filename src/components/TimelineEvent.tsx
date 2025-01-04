import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { EventOptionsMenu } from "./EventOptionsMenu";
import { EventHeader } from "./EventHeader";

interface TimelineEventProps {
  time: string;
  endTime: string;
  duration: string;
  title: string;
  description?: string;
  category: string;
  use24Hour: boolean;
  onEdit: (updates: Partial<{ time: string; endTime: string; duration: string; title: string; description?: string; category: string }>) => void;
  onDelete?: () => void;
}

export function TimelineEvent({ 
  time, 
  endTime, 
  duration, 
  title, 
  description, 
  category, 
  use24Hour, 
  onEdit,
  onDelete 
}: TimelineEventProps) {
  const [editingField, setEditingField] = useState<"time" | "endTime" | "duration" | "title" | "description" | "category" | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleEdit = (field: typeof editingField, value: string) => {
    if (field) {
      let updates: Partial<TimelineEventProps> = {};

      if (field === "time") {
        updates = {
          time: value,
          duration: duration
        };
      } else if (field === "endTime") {
        updates = {
          endTime: value,
          duration: duration
        };
      } else if (field === "duration") {
        const minutes = parseInt(value);
        if (!isNaN(minutes)) {
          updates = {
            duration: `${minutes}m`,
            endTime: endTime
          };
        }
      } else {
        updates = { [field]: value };
      }

      onEdit(updates);
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
      <div className={cn(
        "bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group",
        isHighlighted && "ring-2 ring-wedding-purple bg-wedding-pink/20"
      )}>
        <div className="flex justify-between items-start mb-4">
          <EventHeader
            time={time}
            endTime={endTime}
            duration={duration}
            editingField={editingField}
            tempValue={tempValue}
            use24Hour={use24Hour}
            onStartEditing={startEditing}
            onEdit={handleEdit}
            setTempValue={setTempValue}
          />
          <EventOptionsMenu
            onDelete={onDelete || (() => {})}
            onHighlight={() => setIsHighlighted(!isHighlighted)}
            isHighlighted={isHighlighted}
          />
        </div>

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
              <SelectItem value="Rehearsal">Rehearsal</SelectItem>
              <SelectItem value="Dinner">Dinner</SelectItem>
              <SelectItem value="Dance">Dance</SelectItem>
              <SelectItem value="Speech">Speech</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="Break">Break</SelectItem>
              <SelectItem value="Vendor Setup">Vendor Setup</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
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