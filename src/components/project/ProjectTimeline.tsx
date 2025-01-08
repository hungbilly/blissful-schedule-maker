import { Timeline } from "@/components/Timeline";
import { TimelineEvent } from "./types";
import { Project } from "./types";

interface ProjectTimelineProps {
  events: TimelineEvent[];
  currentProject: Project | null;
  use24Hour: boolean;
  onAddEvent: (event: Omit<TimelineEvent, "id" | "created_at" | "project_id" | "user_id">) => Promise<void>;
  onEditEvent: (eventId: number, updates: Partial<TimelineEvent>) => Promise<void>;
  onDeleteEvent: (eventId: number) => Promise<void>;
}

export const ProjectTimeline = ({
  events,
  currentProject,
  use24Hour,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}: ProjectTimelineProps) => {
  if (!currentProject) return null;

  return (
    <>
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-wedding-purple text-center font-serif mb-6 sm:mb-12 px-4">
        Itinerary: {currentProject?.name || "Timeline"}
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