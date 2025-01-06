import { Button } from "@/components/ui/button";
import { Table, Guest } from "@/components/project/types";
import { TableIcon, Trash2, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="p-6 bg-white rounded-lg shadow space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TableIcon className="text-wedding-purple" />
          <h3 className="font-medium">{table.name}</h3>
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
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{guest.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveGuest(table.id, guest.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {unassignedGuests.length > 0 && (
        <Select onValueChange={(value) => onAssignGuest(table.id, value)}>
          <SelectTrigger>
            <SelectValue placeholder="Assign guest to table" />
          </SelectTrigger>
          <SelectContent>
            {unassignedGuests.map((guest) => (
              <SelectItem key={guest.id} value={guest.id.toString()}>
                {guest.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};