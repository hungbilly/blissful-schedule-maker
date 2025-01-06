import { Button } from "@/components/ui/button";
import { Edit2, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGuests } from "@/hooks/useGuests";
import { Guest } from "@/components/project/types";

interface GuestListProps {
  guests: Guest[];
  onEditGuest: (guest: Guest) => void;
}

export const GuestListComponent = ({ guests, onEditGuest }: GuestListProps) => {
  const { deleteGuest } = useGuests();
  const { toast } = useToast();

  const handleDeleteGuest = async (id: number) => {
    try {
      await deleteGuest.mutateAsync(id);
      toast({
        title: "Success",
        description: "Guest deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete guest",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-8 space-y-4">
      {guests.map((guest) => (
        <div
          key={guest.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <User className="text-wedding-purple" />
            <div>
              <h3 className="font-medium">{guest.name}</h3>
              <div className="text-sm text-gray-500">
                Category: {guest.category}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditGuest(guest)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteGuest(guest.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};