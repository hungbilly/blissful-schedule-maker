import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { MapPin } from "lucide-react";

interface EventDescriptionProps {
  title: string;
  description?: string;
  location?: string;
  editingField: "title" | "description" | "location" | null;
  tempValue: string;
  onStartEditing: (field: "title" | "description" | "location", value: string) => void;
  onEdit: (field: "title" | "description" | "location", value: string) => void;
  setTempValue: (value: string) => void;
}

export function EventDescription({
  title,
  description,
  location,
  editingField,
  tempValue,
  onStartEditing,
  onEdit,
  setTempValue,
}: EventDescriptionProps) {
  return (
    <div className="space-y-2">
      {editingField === "title" ? (
        <Input
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => onEdit("title", tempValue)}
          autoFocus
          className="text-base md:text-lg font-serif mt-2 text-gray-800"
        />
      ) : (
        <h3 
          className="text-base md:text-lg font-serif mt-2 text-gray-800 cursor-pointer hover:underline"
          onClick={() => onStartEditing("title", title)}
        >
          {title}
        </h3>
      )}

      {editingField === "location" ? (
        <div className="relative">
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => onEdit("location", tempValue)}
            autoFocus
            className="pl-7 text-xs md:text-sm text-gray-600"
          />
          <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      ) : location ? (
        <div 
          className="flex items-center gap-1 text-xs md:text-sm text-gray-600 cursor-pointer hover:underline"
          onClick={() => onStartEditing("location", location)}
        >
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      ) : (
        <div 
          className="flex items-center gap-1 text-xs md:text-sm text-gray-600 cursor-pointer hover:underline italic"
          onClick={() => onStartEditing("location", "")}
        >
          <MapPin className="h-4 w-4" />
          <span>Add location...</span>
        </div>
      )}

      {editingField === "description" ? (
        <Textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => onEdit("description", tempValue)}
          autoFocus
          className="mt-2 text-gray-600 text-xs md:text-sm"
        />
      ) : description ? (
        <p 
          className="mt-2 text-gray-600 text-xs md:text-sm cursor-pointer hover:underline"
          onClick={() => onStartEditing("description", description)}
        >
          {description}
        </p>
      ) : (
        <p 
          className="mt-2 text-gray-600 text-xs md:text-sm cursor-pointer hover:underline italic"
          onClick={() => onStartEditing("description", "")}
        >
          Add description...
        </p>
      )}
    </div>
  );
}