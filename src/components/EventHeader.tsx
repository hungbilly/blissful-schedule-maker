import { TimeField } from "./TimeField";
import { Input } from "./ui/input";

interface EventHeaderProps {
  time: string;
  endTime: string;
  duration: string;
  editingField: string | null;
  tempValue: string;
  use24Hour: boolean;
  onStartEditing: (field: string, value: string) => void;
  onEdit: (field: string, value: string) => void;
  setTempValue: (value: string) => void;
}

export function EventHeader({
  time,
  endTime,
  duration,
  editingField,
  tempValue,
  use24Hour,
  onStartEditing,
  onEdit,
  setTempValue,
}: EventHeaderProps) {
  const formatTime = (timeString: string) => {
    if (!use24Hour) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    return timeString;
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        {editingField === "time" ? (
          <TimeField
            value={tempValue}
            onChange={setTempValue}
            onBlur={() => onEdit("time", tempValue)}
            label="Start Time"
            className="text-2xl md:text-3xl font-serif text-wedding-purple"
          />
        ) : (
          <span 
            className="text-2xl md:text-3xl font-serif text-wedding-purple cursor-pointer hover:underline" 
            onClick={() => onStartEditing("time", time)}
          >
            {formatTime(time)}
          </span>
        )}
        <span className="text-xl md:text-2xl font-serif text-wedding-gray">-</span>
        {editingField === "endTime" ? (
          <TimeField
            value={tempValue}
            onChange={setTempValue}
            onBlur={() => onEdit("endTime", tempValue)}
            label="End Time"
            className="text-2xl md:text-3xl font-serif text-wedding-purple"
          />
        ) : (
          <span 
            className="text-2xl md:text-3xl font-serif text-wedding-purple cursor-pointer hover:underline" 
            onClick={() => onStartEditing("endTime", endTime)}
          >
            {formatTime(endTime)}
          </span>
        )}
      </div>
      
      <div className="text-xs md:text-sm text-wedding-gray">
        Duration: {' '}
        {editingField === "duration" ? (
          <Input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => onEdit("duration", tempValue)}
            className="inline-block w-16 md:w-20 h-6 px-1 py-0"
            min="1"
          />
        ) : (
          <span
            className="cursor-pointer hover:underline"
            onClick={() => onStartEditing("duration", duration)}
          >
            {duration}
          </span>
        )}
      </div>
    </div>
  );
}