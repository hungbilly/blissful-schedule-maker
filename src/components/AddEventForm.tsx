import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EventFormData {
  time: string;
  endTime: string;
  duration: string;
  title: string;
  description?: string;
}

interface AddEventFormProps {
  onSubmit: (event: EventFormData) => void;
  defaultTime?: string;
  defaultValues?: EventFormData;
}

export function AddEventForm({ onSubmit, defaultTime, defaultValues }: AddEventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    time: defaultValues?.time || defaultTime || "",
    endTime: defaultValues?.endTime || "",
    duration: defaultValues?.duration || "",
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
  });

  useEffect(() => {
    if (defaultTime && !defaultValues) {
      setFormData(prev => ({ ...prev, time: defaultTime }));
    }
  }, [defaultTime, defaultValues]);

  // Calculate duration when start and end time change
  useEffect(() => {
    if (formData.time && formData.endTime) {
      const duration = calculateDuration(formData.time, formData.endTime);
      setFormData(prev => ({ ...prev, duration }));
    }
  }, [formData.time, formData.endTime]);

  // Calculate end time when duration changes
  useEffect(() => {
    if (formData.time && formData.duration) {
      const endTime = calculateEndTime(formData.time, formData.duration);
      setFormData(prev => ({ ...prev, endTime }));
    }
  }, [formData.time, formData.duration]);

  const handleDurationChange = (value: string) => {
    // Remove any non-numeric characters as the user types
    const numericValue = value.replace(/\D/g, '');
    const formattedDuration = numericValue ? `${numericValue}mins` : '';
    setFormData(prev => ({ ...prev, duration: formattedDuration }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ time: "", endTime: "", duration: "", title: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
            className="font-sans bg-white"
            placeholder="Start Time"
          />
        </div>
        <div className="space-y-2 flex-1">
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
            className="font-sans bg-white"
            placeholder="End Time"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Input
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={(e) => handleDurationChange(e.target.value)}
          required
          className="bg-white"
        />
      </div>
      <div className="space-y-2">
        <Input
          placeholder="Event Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="bg-white"
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-white"
        />
      </div>
      <Button type="submit" className="w-full bg-wedding-purple hover:bg-wedding-purple/90">
        {defaultValues ? "Update Event" : "Add Event"}
      </Button>
    </form>
  );
}

function calculateDuration(startTime: string, endTime: string): string {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let durationInMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  if (durationInMinutes < 0) durationInMinutes += 24 * 60; // Handle overnight events
  
  return `${durationInMinutes}mins`;
}

function calculateEndTime(startTime: string, duration: string): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const durationMinutes = parseInt(duration);
  
  if (isNaN(durationMinutes)) return '';
  
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}