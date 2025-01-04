import { TimelineEvent } from "./TimelineEvent";

interface TimelineEvent {
  id: number;
  time: string;
  title: string;
  description?: string;
  category: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="relative">
      <div className="timeline-line" />
      {sortedEvents.map((event) => (
        <TimelineEvent
          key={event.id}
          time={event.time}
          title={event.title}
          description={event.description}
          category={event.category}
        />
      ))}
    </div>
  );
}