import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table as TableIcon,
  Plus,
  Edit2,
  Trash2,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Guest, Table } from "@/components/project/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function SittingPlan() {
  const [tables, setTables] = useState<Table[]>([]);
  const [newTableName, setNewTableName] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState("");
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const { toast } = useToast();

  // Mock guest list - in a real app, this would be shared state
  const [guests] = useState<Guest[]>([]);

  const handleAddTable = () => {
    if (!newTableName.trim() || !newTableCapacity) {
      toast({
        title: "Error",
        description: "Table name and capacity are required",
        variant: "destructive",
      });
      return;
    }

    const newTable: Table = {
      id: tables.length + 1,
      name: newTableName,
      capacity: parseInt(newTableCapacity),
      guests: [],
    };

    setTables([...tables, newTable]);
    setNewTableName("");
    setNewTableCapacity("");
    toast({
      title: "Success",
      description: "Table added successfully",
    });
  };

  const handleDeleteTable = (id: number) => {
    setTables(tables.filter((t) => t.id !== id));
    toast({
      title: "Success",
      description: "Table deleted successfully",
    });
  };

  const handleAssignGuest = (tableId: number, guest: Guest) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        if (table.guests.length >= table.capacity) {
          toast({
            title: "Error",
            description: "Table is at full capacity",
            variant: "destructive",
          });
          return table;
        }
        return {
          ...table,
          guests: [...table.guests, { ...guest, tableId }],
        };
      }
      return table;
    });
    setTables(updatedTables);
  };

  const handleRemoveGuest = (tableId: number, guestId: number) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          guests: table.guests.filter((g) => g.id !== guestId),
        };
      }
      return table;
    });
    setTables(updatedTables);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-serif text-wedding-purple mb-8">
              Sitting Plan
            </h1>

            <div className="space-y-4 mb-8">
              <Input
                placeholder="Table Name"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
              />
              <Input
                placeholder="Capacity"
                type="number"
                value={newTableCapacity}
                onChange={(e) => setNewTableCapacity(e.target.value)}
              />
              <Button onClick={handleAddTable} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Table
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="p-6 bg-white rounded-lg shadow space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TableIcon className="text-wedding-purple" />
                      <h3 className="font-medium">
                        {table.name} ({table.guests.length}/{table.capacity})
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTable(table.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {table.guests.map((guest) => (
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
                          onClick={() => handleRemoveGuest(table.id, guest.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {guests
                    .filter((g) => !g.tableId)
                    .map((guest) => (
                      <Button
                        key={guest.id}
                        variant="outline"
                        className="w-full"
                        onClick={() => handleAssignGuest(table.id, guest)}
                      >
                        Assign {guest.name}
                      </Button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}