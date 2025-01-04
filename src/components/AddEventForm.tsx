import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventFormData {
  time: string;
  title: string;
  description: string;
  category: string;
}

interface AddEventFormProps {
  onSubmit: (event: EventFormData) => void;
  defaultTime?: string;
  defaultValues?: EventFormData;
}

export function AddEventForm({ onSubmit, defaultTime, defaultValues }: AddEventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    time: defaultValues?.time || defaultTime || "",
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
    category: defaultValues?.category || "",
  });

  useEffect(() => {
    if (defaultTime && !defaultValues) {
      setFormData(prev => ({ ...prev, time: defaultTime }));
    }
  }, [defaultTime, defaultValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ time: "", title: "", description: "", category: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-2">
        <Input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
          className="font-sans"
        />
      </div>
      <div className="space-y-2">
        <Input
          placeholder="Event Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <Select
        value={formData.category}
        onValueChange={(value) => setFormData({ ...formData, category: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Ceremony">Ceremony</SelectItem>
          <SelectItem value="Reception">Reception</SelectItem>
          <SelectItem value="Photos">Photos</SelectItem>
          <SelectItem value="Setup">Setup</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full bg-wedding-purple hover:bg-wedding-purple/90">
        {defaultValues ? "Update Event" : "Add Event"}
      </Button>
    </form>
  );
}