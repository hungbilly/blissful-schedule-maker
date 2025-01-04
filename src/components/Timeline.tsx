import { useState } from "react";
import { TimelineEvent } from "./TimelineEvent";
import { Button } from "./ui/button";
import { AddEventForm } from "./AddEventForm";
import { Dialog, DialogContent } from "./ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface TimelineEvent {
  id: number;
  time: string;
  endTime: string;
  duration: string;
  title: string;
  description?: string;
  category: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  onAddEvent: (event: Omit<TimelineEvent, "id"> | TimelineEvent) => void;
  use24Hour: boolean;
}

export function Timeline({ events, onAddEvent, use24Hour }: TimelineProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { toast } = useToast();
  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));

  const handleAddEventClick = (time: string) => {
    setSelectedTime(time);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (eventId: number, updates: Partial<TimelineEvent>) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    );
    onAddEvent(updatedEvents.find(e => e.id === eventId) as TimelineEvent);
  };

  const handleDeleteEvent = (eventId: number) => {
    const eventToDelete = events.find(event => event.id === eventId);
    
    if (eventToDelete) {
      onAddEvent({
        ...eventToDelete,
        id: -1 // This signals to the parent component that this event should be deleted
      });
      
      toast({
        title: "Event Deleted",
        description: `"${eventToDelete.title}" has been removed from the timeline.`,
      });
    }
  };

  return (
    <div className="relative">
      <div className="timeline-line" />
      
      <div className="relative pl-12 pb-8">
        <Button
          variant="outline"
          className="w-full bg-white hover:bg-wedding-pink/50"
          onClick={() => handleAddEventClick("00:00")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add First Event
        </Button>
      </div>

      {sortedEvents.map((event, index) => (
        <div key={event.id}>
          <TimelineEvent
            time={event.time}
            endTime={event.endTime}
            duration={event.duration}
            title={event.title}
            description={event.description}
            category={event.category}
            onEdit={(updates) => handleEditEvent(event.id, updates)}
            onDelete={() => handleDeleteEvent(event.id)}
            use24Hour={use24Hour}
          />
          <div className="relative pl-12 pb-8">
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-wedding-pink/50"
              onClick={() => {
                const currentTime = event.time;
                const nextTime = index < sortedEvents.length - 1 
                  ? sortedEvents[index + 1].time 
                  : "23:59";
                const suggestedTime = calculateMiddleTime(currentTime, nextTime);
                handleAddEventClick(suggestedTime);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <AddEventForm 
            onSubmit={(eventData) => {
              onAddEvent(eventData);
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
