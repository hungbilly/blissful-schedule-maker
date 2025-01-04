import { cn } from "@/lib/utils";
import { useState } from "react";
import { EventOptionsMenu } from "./EventOptionsMenu";
import { EventHeader } from "./EventHeader";
import { EventDescription } from "./EventDescription";

interface TimelineEventProps {
  time: string;
  endTime: string;
  duration: string;
  title: string;
  description?: string;
  use24Hour: boolean;
  onEdit: (updates: Partial<{ time: string; endTime: string; duration: string; title: string; description?: string; }>) => void;
  onDelete?: () => void;
}

export function TimelineEvent({ 
  time, 
  endTime, 
  duration, 
  title, 
  description,
  use24Hour, 
  onEdit,
  onDelete
}: TimelineEventProps) {
  const [editingField, setEditingField] = useState<"time" | "endTime" | "duration" | "title" | "description" | null>(null);
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

        <EventDescription
          title={title}
          description={description}
          editingField={editingField === "title" || editingField === "description" ? editingField : null}
          tempValue={tempValue}
          onStartEditing={startEditing}
          onEdit={handleEdit}
          setTempValue={setTempValue}
        />
      </div>
    </div>
  );
}