import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface CoupleInfoProps {
  date: string;
  onDateChange: (value: string) => void;
}

export function CoupleInfo({ date, onDateChange }: CoupleInfoProps) {
  const [localBride, setLocalBride] = useState("");
  const [localGroom, setLocalGroom] = useState("");
  const [localDate, setLocalDate] = useState(date);
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('bride_name, groom_name')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setLocalBride(data.bride_name || "");
        setLocalGroom(data.groom_name || "");
      }
    };

    fetchProfile();
  }, [session?.user?.id, supabase]);

  // Update local state when props change
  useEffect(() => {
    setLocalDate(date);
  }, [date]);

  // Update profile in Supabase
  const updateProfile = async (bride: string, groom: string) => {
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        bride_name: bride,
        groom_name: groom
      })
      .eq('id', session.user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      console.error('Error updating profile:', error);
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  // Debounce updates for bride's name
  useEffect(() => {
    const timer = setTimeout(() => {
      updateProfile(localBride, localGroom);
    }, 1000);

    return () => clearTimeout(timer);
  }, [localBride]);

  // Debounce updates for groom's name
  useEffect(() => {
    const timer = setTimeout(() => {
      updateProfile(localBride, localGroom);
    }, 1000);

    return () => clearTimeout(timer);
  }, [localGroom]);

  // Debounce updates for date
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
                {localDate ? formatDate(localDate) : "Set the date"}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-50" align="center">
              <Calendar
                mode="single"
                selected={localDate ? new Date(localDate) : undefined}
                onSelect={handleDateSelect}
                initialFocus
                className="bg-white rounded-lg"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}