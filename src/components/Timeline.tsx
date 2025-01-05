import { useState } from "react";
import { TimelineEvent as TimelineEventComponent } from "./TimelineEvent";
import { Button } from "./ui/button";
import { AddEventForm } from "./AddEventForm";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { TimelineEvent } from "./project/types";

interface TimelineProps {
  events: TimelineEvent[];
  onAddEvent: (event: Omit<TimelineEvent, "id" | "created_at" | "project_id" | "user_id">) => void;
  onEditEvent: (eventId: number, updates: Partial<TimelineEvent>) => void;
  onDeleteEvent: (eventId: number) => void;
  use24Hour: boolean;
}

export function Timeline({ events, onAddEvent, onEditEvent, onDeleteEvent, use24Hour }: TimelineProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { toast } = useToast();
  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));

  const handleAddEventClick = (time: string) => {
    setSelectedTime(time);
    setIsDialogOpen(true);
  };

  return (
    <div className="relative">
      <div className="timeline-line" />
      
      <div className="mb-8 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-wedding-purple hover:text-wedding-purple hover:bg-wedding-pink/30 text-xs px-2 py-1 h-7"
          onClick={() => handleAddEventClick("00:00")}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Event
        </Button>
      </div>

      {sortedEvents.map((event, index) => (
        <div key={event.id}>
          <TimelineEventComponent
            {...event}
            onEdit={(updates) => onEditEvent(event.id, updates)}
            onDelete={() => onDeleteEvent(event.id)}
            use24Hour={use24Hour}
          />
          {index < sortedEvents.length - 1 && (
            <div className="absolute left-0 right-0 -mt-4 -mb-4 z-10 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-wedding-purple hover:text-wedding-purple hover:bg-wedding-pink/30 text-xs px-2 py-1 h-7"
                onClick={() => {
                  const currentTime = event.time;
                  const nextTime = sortedEvents[index + 1].time;
                  const suggestedTime = calculateMiddleTime(currentTime, nextTime);
                  handleAddEventClick(suggestedTime);
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Event
              </Button>
            </div>
          )}
        </div>
      ))}

      {sortedEvents.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-wedding-purple hover:text-wedding-purple hover:bg-wedding-pink/30 text-xs px-2 py-1 h-7"
            onClick={() => handleAddEventClick("23:59")}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Event
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Add Event</DialogTitle>
          <AddEventForm 
            onSubmit={(eventData) => {
              const newEvent = {
                time: eventData.time,
                end_time: eventData.endTime,
                duration: eventData.duration,
                title: eventData.title,
                description: eventData.description,
                location: eventData.location,
              };
              onAddEvent(newEvent);
              setIsDialogOpen(false);
            }}
            defaultTime={selectedTime}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function calculateMiddleTime(time1: string, time2: string): string {
  const [hours1, minutes1] = time1.split(":").map(Number);
  const [hours2, minutes2] = time2.split(":").map(Number);
  
  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;
  
  const middleMinutes = Math.floor((totalMinutes1 + totalMinutes2) / 2);
  
  const hours = Math.floor(middleMinutes / 60);
  const minutes = middleMinutes % 60;
  
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}