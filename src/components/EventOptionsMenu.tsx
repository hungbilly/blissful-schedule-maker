import { MoreVertical, Trash2, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface EventOptionsMenuProps {
  onDelete: () => void;
  onHighlight: () => void;
  isHighlighted: boolean;
}

export function EventOptionsMenu({ onDelete, onHighlight, isHighlighted }: EventOptionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white border border-input shadow-md min-w-[8rem] z-50"
      >
        <DropdownMenuItem onClick={onHighlight} className="gap-2 hover:bg-gray-100">
          <Star className="h-4 w-4" />
          {isHighlighted ? 'Remove Highlight' : 'Highlight'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="gap-2 text-red-600 hover:bg-gray-100">
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}