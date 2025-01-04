import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

interface EventDescriptionProps {
  title: string;
  description?: string;
  editingField: "title" | "description" | null;
  tempValue: string;
  onStartEditing: (field: "title" | "description", value: string) => void;
  onEdit: (field: "title" | "description", value: string) => void;
  setTempValue: (value: string) => void;
}

export function EventDescription({
  title,
  description,
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
          className="text-lg font-serif mt-2 text-gray-800"
        />
      ) : (
        <h3 
          className="text-lg font-serif mt-2 text-gray-800 cursor-pointer hover:underline"
          onClick={() => onStartEditing("title", title)}
        >
          {title}
        </h3>
      )}

      {editingField === "description" ? (
        <Textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => onEdit("description", tempValue)}
          autoFocus
          className="mt-2 text-gray-600 text-sm"
        />
      ) : description ? (
        <p 
          className="mt-2 text-gray-600 text-sm cursor-pointer hover:underline"
          onClick={() => onStartEditing("description", description)}
        >
          {description}
        </p>
      ) : (
        <p 
          className="mt-2 text-gray-600 text-sm cursor-pointer hover:underline italic"
          onClick={() => onStartEditing("description", "")}
        >
          Add description...
        </p>
      )}
    </div>
  );
}