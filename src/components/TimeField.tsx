import { Input } from "./ui/input";

interface TimeFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

export function TimeField({ value, onChange, label, className }: TimeFieldProps) {
  return (
    <span 
      className={className}
      onClick={() => {}}
    >
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 font-medium text-wedding-purple"
      />
    </span>
  );
}