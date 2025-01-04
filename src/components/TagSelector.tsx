import { Check, Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

const TAG_OPTIONS = [
  { label: "Parents", color: "bg-[#E5DEFF] text-[#8B5CF6]" },
  { label: "Bridesmaid", color: "bg-[#FFDEE2] text-[#D946EF]" },
  { label: "Groomsmen", color: "bg-[#FDE1D3] text-[#F97316]" },
  { label: "Vendors", color: "bg-[#D3E4FD] text-[#0EA5E9]" },
  { label: "Guests", color: "bg-[#F2FCE2] text-green-600" },
  { label: "Family", color: "bg-[#FEF7CD] text-amber-600" },
];

export const getTagColor = (tagLabel: string) => {
  return TAG_OPTIONS.find(tag => tag.label === tagLabel)?.color || "bg-gray-100 text-gray-600";
};

interface TagSelectorProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagSelector({ tags, onTagsChange }: TagSelectorProps) {
  const handleToggleTag = (tagLabel: string) => {
    if (tags.includes(tagLabel)) {
      onTagsChange(tags.filter(t => t !== tagLabel));
    } else {
      onTagsChange([...tags, tagLabel]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
            getTagColor(tag)
          )}
        >
          {tag}
          <button
            onClick={() => handleToggleTag(tag)}
            className="hover:bg-black/5 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Tag
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {TAG_OPTIONS.map((tag) => (
            <DropdownMenuItem
              key={tag.label}
              onSelect={(e) => {
                e.preventDefault();
                handleToggleTag(tag.label);
              }}
              className="flex items-center gap-2"
            >
              <div className={cn(
                "w-3 h-3 rounded-full",
                tag.color.split(" ")[0]
              )} />
              {tag.label}
              {tags.includes(tag.label) && (
                <Check className="h-3 w-3 ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}