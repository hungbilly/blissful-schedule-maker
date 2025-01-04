import { Input } from "./ui/input";

interface TimeFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;  // Added onBlur as an optional prop
  label: string;
  className?: string;
}

export function TimeField({ value, onChange, onBlur, label, className }: TimeFieldProps) {
  return (
    <span 
      className={className}
      onClick={() => {}}
    >
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}  // Added onBlur handler
        className="w-24 font-medium text-wedding-purple"
      />
    </span>
  );
}