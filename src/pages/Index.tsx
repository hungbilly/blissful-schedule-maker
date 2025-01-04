import { useState } from "react";
import { Timeline } from "@/components/Timeline";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TimelineEvent {
  id: number;
  time: string;
  endTime: string;
  duration: string;
  title: string;
  description?: string;
  category: string;
}

const Index = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: 1,
      time: "14:00",
      endTime: "14:30",
      duration: "30m",
      title: "Wedding Ceremony",
      description: "Exchange of vows at the main chapel",
      category: "Ceremony",
    },
    {
      id: 2,
      time: "15:00",
      endTime: "15:45",
      duration: "45m",
      title: "Photo Session",
      description: "Family and couple photos in the garden",
      category: "Photos",
    },
    {
      id: 3,
      time: "16:00",
      endTime: "20:00",
      duration: "4h",
      title: "Reception",
      description: "Cocktail hour and dinner",
      category: "Reception",
    },
  ]);

  const [use24Hour, setUse24Hour] = useState(true);

  const handleAddEvent = (eventData: Omit<TimelineEvent, "id"> | TimelineEvent) => {
    if ('id' in eventData) {
      // This is an update to an existing event
      setEvents(events.map(event => 
        event.id === eventData.id ? eventData : event
      ));
    } else {
      // This is a new event
      const newEvent = {
        ...eventData,
        id: events.length + 1,
      };
      setEvents([...events, newEvent]);
    }
  };

  return (
    <div className="min-h-screen bg-wedding-pink py-12">
      <div className="container max-w-3xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl text-wedding-purple text-center font-serif">
            Wedding Day Timeline
          </h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="24h-mode">24h</Label>
            <Switch
              id="24h-mode"
              checked={use24Hour}
              onCheckedChange={setUse24Hour}
            />
          </div>
        </div>
        <Timeline events={events} onAddEvent={handleAddEvent} use24Hour={use24Hour} />
      </div>
    </div>
  );
};

export default Index;