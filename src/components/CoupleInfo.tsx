import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";

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
  return (
    <div className="bg-white rounded-lg p-6 mb-12 shadow-sm">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative">
          <div className="flex-1 w-full md:w-auto">
            <Input
              placeholder="Bride's Name"
              value={bride}
              onChange={(e) => onBrideChange(e.target.value)}
              className="bg-[#FFDEE2]/30 border-[#FFDEE2] focus:border-[#FFDEE2] text-center font-serif"
            />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden md:block">
            <Heart className="text-wedding-purple h-6 w-6" />
          </div>
          <div className="flex-1 w-full md:w-auto">
            <Input
              placeholder="Groom's Name"
              value={groom}
              onChange={(e) => onGroomChange(e.target.value)}
              className="bg-[#D3E4FD]/30 border-[#D3E4FD] focus:border-[#D3E4FD] text-center font-serif"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="max-w-[240px] text-center font-serif bg-wedding-pink/10 border-wedding-purple/20 focus:border-wedding-purple"
          />
        </div>
      </div>
    </div>
  );
}