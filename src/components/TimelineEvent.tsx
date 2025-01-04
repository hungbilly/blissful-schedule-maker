import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { Button } from "./ui/button";

interface TimelineEventProps {
  time: string;
  title: string;
  description?: string;
  category: string;
  onEdit: () => void;
}

export function TimelineEvent({ time, title, description, category, onEdit }: TimelineEventProps) {
  return (
    <div className="relative pl-12 pb-8">
      <div className="timeline-dot" />
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
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