import { useState } from "react";
import { Timeline } from "@/components/Timeline";
import { AddEventForm } from "@/components/AddEventForm";

interface TimelineEvent {
  id: number;
  time: string;
  title: string;
  description?: string;
  category: string;
}

const Index = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: 1,
      time: "14:00",
      title: "Wedding Ceremony",
      description: "Exchange of vows at the main chapel",
      category: "Ceremony",
    },
    {
      id: 2,
      time: "15:00",
      title: "Photo Session",
      description: "Family and couple photos in the garden",
      category: "Photos",
    },
    {
      id: 3,
      time: "16:00",
      title: "Reception",
      description: "Cocktail hour and dinner",
      category: "Reception",
    },
  ]);

  const handleAddEvent = (eventData: Omit<TimelineEvent, "id">) => {
    const newEvent = {
      ...eventData,
      id: events.length + 1,
    };
    setEvents([...events, newEvent]);
  };

  return (
    <div className="min-h-screen bg-wedding-pink py-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl md:text-5xl text-wedding-purple text-center font-serif mb-12">
          Wedding Day Timeline
        </h1>
        <div className="grid md:grid-cols-[1fr,300px] gap-8">
          <Timeline events={events} />
          <div className="md:sticky md:top-4 h-fit">
            <AddEventForm onSubmit={handleAddEvent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;