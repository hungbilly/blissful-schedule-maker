import { cn } from "@/lib/utils";
import { useState } from "react";
import { EventOptionsMenu } from "./EventOptionsMenu";
import { EventHeader } from "./EventHeader";
import { EventDescription } from "./EventDescription";
import { calculateDuration, calculateEndTime } from "@/utils/timeCalculations";
import { TimelineEvent as TimelineEventType } from "./project/types";

interface TimelineEventProps extends TimelineEventType {
  use24Hour: boolean;
  onEdit: (updates: Partial<TimelineEventType>) => void;
  onDelete?: () => void;
}

export function TimelineEvent({ 
  time, 
  end_time, 
  duration, 
  title, 
  description,
  location,
  use24Hour, 
  onEdit,
  onDelete
}: TimelineEventProps) {
  const [editingField, setEditingField] = useState<"time" | "end_time" | "duration" | "title" | "description" | "location" | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleEdit = (field: typeof editingField, value: string) => {
    if (field) {
      let updates: Partial<TimelineEventType> = {};

      if (field === "time") {
        const newDuration = calculateDuration(value, end_time);
        updates = {
          time: value,
          duration: newDuration
        };
      } else if (field === "end_time") {
        const newDuration = calculateDuration(time, value);
        updates = {
          end_time: value,
          duration: newDuration
        };
      } else if (field === "duration") {
        const minutes = parseInt(value);
        if (!isNaN(minutes)) {
          const newEndTime = calculateEndTime(time, `${minutes}mins`);
          updates = {
            duration: `${minutes}mins`,
            end_time: newEndTime
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
    <div className="relative pl-8 md:pl-12 pb-8">
      <div className="timeline-dot" />
      <div className={cn(
        "bg-white rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow group relative",
        isHighlighted && "ring-2 ring-wedding-purple bg-wedding-pink/20"
      )}>
        <div className="absolute top-2 right-2">
          <EventOptionsMenu
            onDelete={onDelete || (() => {})}
            onHighlight={() => setIsHighlighted(!isHighlighted)}
            isHighlighted={isHighlighted}
          />
        </div>

        <div className="flex flex-col md:flex-row md:gap-8">
          <EventHeader
            time={time}
            endTime={end_time}
            duration={duration}
            editingField={editingField}
            tempValue={tempValue}
            use24Hour={use24Hour}
            onStartEditing={startEditing}
            onEdit={handleEdit}
            setTempValue={setTempValue}
          />
          
          <div className="flex-1 mt-4 md:mt-0">
            <EventDescription
              title={title}
              description={description}
              location={location}
              editingField={editingField === "title" || editingField === "description" || editingField === "location" ? editingField : null}
              tempValue={tempValue}
              onStartEditing={startEditing}
              onEdit={handleEdit}
              setTempValue={setTempValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
}