import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "./ui/use-toast";

interface EventFormData {
  time: string;
  endTime: string;
  duration: string;
  title: string;
  description?: string;
  category: string;
}

interface AddEventFormProps {
  onSubmit: (event: EventFormData) => void;
  defaultTime?: string;
  defaultValues?: EventFormData;
  categories: string[];
  onAddCategory: (category: string) => void;
}

export function AddEventForm({ onSubmit, defaultTime, defaultValues, categories, onAddCategory }: AddEventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    time: defaultValues?.time || defaultTime || "",
    endTime: defaultValues?.endTime || "",
    duration: defaultValues?.duration || "",
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
    category: defaultValues?.category || "",
  });
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();

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
    if (formData.time && formData.duration && !formData.endTime) {
      const endTime = calculateEndTime(formData.time, formData.duration);
      setFormData(prev => ({ ...prev, endTime }));
    }
  }, [formData.time, formData.duration]);

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    
    let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight events
    
    return `${totalMinutes}mins`;
  };

  const calculateEndTime = (startTime: string, duration: string) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const durationMatch = duration.match(/(\d+)mins/);
    
    if (!durationMatch) return "";
    
    const minutes = parseInt(durationMatch[1] || "0");
    
    let totalMinutes = startHours * 60 + startMinutes + minutes;
    totalMinutes = totalMinutes % (24 * 60); // Keep within 24 hours
    
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ time: "", endTime: "", duration: "", title: "", description: "", category: "" });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
      setIsNewCategoryDialogOpen(false);
      toast({
        title: "Category Added",
        description: `${newCategory} has been added to the categories list.`,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex gap-4">
          <div className="space-y-2 flex-1">
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="font-sans"
              placeholder="Start Time"
            />
          </div>
          <div className="space-y-2 flex-1">
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
              className="font-sans"
              placeholder="End Time"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Duration (e.g. 180mins)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
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
        <div className="flex gap-2">
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsNewCategoryDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button type="submit" className="w-full bg-wedding-purple hover:bg-wedding-purple/90">
          {defaultValues ? "Update Event" : "Add Event"}
        </Button>
      </form>

      <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleAddCategory} className="w-full">
              Add Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
