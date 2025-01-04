import { cn } from "@/lib/utils";

interface TimelineEventProps {
  time: string;
  title: string;
  description?: string;
  category: string;
}

export function TimelineEvent({ time, title, description, category }: TimelineEventProps) {
  return (
    <div className="relative pl-12 pb-8">
      <div className="timeline-dot" />
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <span className="text-sm font-medium text-wedding-purple">{time}</span>
        <h3 className="text-lg font-serif mt-2 text-gray-800">{title}</h3>
        {description && (
          <p className="mt-2 text-gray-600 text-sm">{description}</p>
        )}
        <span className="inline-block mt-3 px-3 py-1 bg-wedding-pink rounded-full text-xs font-medium text-wedding-purple">
          {category}
        </span>
      </div>
    </div>
  );
}