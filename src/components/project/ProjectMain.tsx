import { Timeline } from "@/components/Timeline";
import { CoupleInfo } from "@/components/CoupleInfo";
import { TimelineEvent } from "./types";

interface ProjectMainProps {
  projectName: string;
  weddingDate: string;
  events: TimelineEvent[];
  use24Hour: boolean;
  onAddEvent: (event: Omit<TimelineEvent, "id" | "created_at" | "project_id" | "user_id">) => void;
  onEditEvent: (eventId: number, updates: Partial<TimelineEvent>) => void;
  onDeleteEvent: (eventId: number) => void;
  onDateChange: (date: string) => void;
}

export const ProjectMain = ({
  projectName,
  weddingDate,
  events,
  use24Hour,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onDateChange,
}: ProjectMainProps) => {
  return (
    <>
      <CoupleInfo
        date={weddingDate}
        onDateChange={onDateChange}
      />

      <h1 className="text-3xl md:text-4xl text-wedding-purple text-center font-serif mb-12">
        Itinerary: {projectName}
      </h1>

      <Timeline
        events={events}
        onAddEvent={onAddEvent}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
        use24Hour={use24Hour}
      />
    </>
  );
};