import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CoupleInfoProps {
  bride: string;
  groom: string;
  date: string;
  onBrideChange: (value: string) => void;
  onGroomChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

export function CoupleInfo({
  bride,
  groom,
  date,
  onBrideChange,
  onGroomChange,
  onDateChange
}: CoupleInfoProps) {
  const [localBride, setLocalBride] = useState(bride);
  const [localGroom, setLocalGroom] = useState(groom);
  const [localDate, setLocalDate] = useState(date);

  // Update local state when props change
  useEffect(() => {
    setLocalBride(bride);
    setLocalGroom(groom);
    setLocalDate(date);
  }, [bride, groom, date]);

  // Debounce updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localBride !== bride) {
        onBrideChange(localBride);
      }
    }, 1000); // Wait 1 second after last keystroke

    return () => clearTimeout(timer);
  }, [localBride, bride, onBrideChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localGroom !== groom) {
        onGroomChange(localGroom);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [localGroom, groom, onGroomChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localDate !== date) {
        onDateChange(localDate);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [localDate, date, onDateChange]);

  // Format the date to display like "Friday 31 Jan 2025"
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setLocalDate(formattedDate);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-12 shadow-sm">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative">
          <div className="flex-1 w-full md:w-auto">
            <Input
              placeholder="Bride's Name"
              value={localBride}
              onChange={(e) => setLocalBride(e.target.value)}
              className="bg-[#FFDEE2]/30 border-[#FFDEE2] focus:border-[#FFDEE2] text-center font-serif"
            />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden md:block">
            <Heart className="text-wedding-purple h-6 w-6" />
          </div>
          <div className="flex-1 w-full md:w-auto">
            <Input
              placeholder="Groom's Name"
              value={localGroom}
              onChange={(e) => setLocalGroom(e.target.value)}
              className="bg-[#D3E4FD]/30 border-[#D3E4FD] focus:border-[#D3E4FD] text-center font-serif"
            />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="text-lg font-serif text-wedding-purple">Wedding Date:</div>
          <Popover>
            <PopoverTrigger asChild>
              <div className="text-2xl font-serif text-wedding-purple border-b-2 border-wedding-purple/50 pb-1 px-4 cursor-pointer">
                {formatDate(localDate)}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={localDate ? new Date(localDate) : undefined}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}