import { Button } from "@/components/ui/button";
import { Table, Guest } from "@/components/project/types";
import { TableIcon, Trash2, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TableCardProps {
  table: Table;
  guests: Guest[];
  onDeleteTable: (id: number) => void;
  onAssignGuest: (tableId: number, guestId: string) => void;
  onRemoveGuest: (tableId: number, guestId: number) => void;
}

export const TableCard = ({
  table,
  guests,
  onDeleteTable,
  onAssignGuest,
  onRemoveGuest,
}: TableCardProps) => {
  const unassignedGuests = guests.filter(guest => !guest.tableId);
  const tableGuests = guests.filter(guest => guest.tableId === table.id);

  return (
    <div className="p-3 md:p-6 bg-white rounded-lg shadow space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TableIcon className="text-wedding-purple h-4 w-4 md:h-5 md:w-5" />
          <h3 className="font-medium text-sm md:text-base">{table.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteTable(table.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {tableGuests.map((guest) => (
          <div
            key={guest.id}
            className="flex items-start justify-between p-2 bg-gray-50 rounded"
          >
            <div className="space-y-1">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-wedding-purple shrink-0" />
                  <span className="text-sm md:text-base">{guest.name}</span>
                </div>
                {guest.category && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs ml-6"
                  >
                    {guest.category}
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveGuest(table.id, guest.id)}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {unassignedGuests.length > 0 && (
        <Select onValueChange={(value) => onAssignGuest(table.id, value)}>
          <SelectTrigger className="text-sm md:text-base">
            <SelectValue placeholder="Assign guest to table" />
          </SelectTrigger>
          <SelectContent>
            {unassignedGuests.map((guest) => (
              <SelectItem key={guest.id} value={guest.id.toString()}>
                {guest.name} {guest.category && `(${guest.category})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};