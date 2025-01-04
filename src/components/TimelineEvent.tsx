import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { TimeField } from "./TimeField";
import { calculateDurationInMinutes, calculateEndTimeFromMinutes, formatDuration, parseDuration } from "@/utils/timeCalculations";

interface TimelineEventProps {
  time: string;
  endTime: string;
  duration: string;
  title: string;
  description?: string;
  category: string;
  onEdit: (updates: Partial<{ time: string; endTime: string; duration: string; title: string; description?: string; category: string }>) => void;
}

export function TimelineEvent({ time, endTime, duration, title, description, category, onEdit }: TimelineEventProps) {
  const [editingField, setEditingField] = useState<"time" | "endTime" | "duration" | "title" | "description" | "category" | null>(null);
  const [tempValue, setTempValue] = useState("");

  const handleEdit = (field: typeof editingField, value: string) => {
    if (field) {
      let updates: Partial<TimelineEventProps> = {};

      if (field === "time") {
        const durationMinutes = calculateDurationInMinutes(value, endTime);
        updates = {
          time: value,
          duration: formatDuration(durationMinutes)
        };
      } else if (field === "endTime") {
        const durationMinutes = calculateDurationInMinutes(time, value);
        updates = {
          endTime: value,
          duration: formatDuration(durationMinutes)
        };
      } else if (field === "duration") {
        const minutes = parseInt(value);
        if (!isNaN(minutes)) {
          const formattedDuration = formatDuration(minutes);
          const newEndTime = calculateEndTimeFromMinutes(time, minutes);
          updates = {
            duration: formattedDuration,
            endTime: newEndTime
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
    if (field === "duration") {
      const minutes = parseDuration(currentValue);
      setTempValue(minutes.toString());
    } else {
      setTempValue(currentValue);
    }
  };

  return (
    <div className="relative pl-12 pb-8">
      <div className="timeline-dot" />
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-baseline gap-2">
            {editingField === "time" ? (
              <TimeField
                value={tempValue}
                onChange={setTempValue}
                onBlur={() => handleEdit("time", tempValue)}
                label="Start Time"
                className="text-3xl font-serif text-wedding-purple"
              />
            ) : (
              <span 
                className="text-3xl font-serif text-wedding-purple cursor-pointer hover:underline" 
                onClick={() => startEditing("time", time)}
              >
                {time}
              </span>
            )}
            <span className="text-2xl font-serif text-wedding-gray">am</span>
          </div>
          
          <div className="text-sm text-wedding-gray">
            Duration {duration}
          </div>
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