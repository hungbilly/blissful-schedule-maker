import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useGuests } from "@/hooks/useGuests";
import { useTables } from "@/hooks/useTables";
import { TableCard } from "@/components/table/TableCard";

export default function SittingPlan() {
  const [newTableName, setNewTableName] = useState("");
  const { toast } = useToast();
  const { guests, guestsLoading, assignGuestToTable } = useGuests();
  const { tables, tablesLoading, addTable, deleteTable } = useTables();

  const handleAddTable = async () => {
    if (!newTableName.trim()) {
      toast({
        title: "Error",
        description: "Table name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await addTable.mutateAsync(newTableName);
      setNewTableName("");
      toast({
        title: "Success",
        description: "Table added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add table",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTable = async (id: number) => {
    try {
      // First, remove all guests from this table
      const tableGuests = guests.filter(guest => guest.tableId === id);
      await Promise.all(
        tableGuests.map(guest => 
          assignGuestToTable.mutateAsync({ guestId: guest.id, tableId: null })
        )
      );
      
      // Then delete the table
      await deleteTable.mutateAsync(id);
      toast({
        title: "Success",
        description: "Table deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete table",
        variant: "destructive",
      });
    }
  };

  const handleAssignGuest = async (tableId: number, guestId: string) => {
    try {
      await assignGuestToTable.mutateAsync({ 
        guestId: parseInt(guestId), 
        tableId 
      });
      toast({
        title: "Success",
        description: "Guest assigned to table successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign guest to table",
        variant: "destructive",
      });
    }
  };

  const handleRemoveGuest = async (tableId: number, guestId: number) => {
    try {
      await assignGuestToTable.mutateAsync({ 
        guestId, 
        tableId: null 
      });
      toast({
        title: "Success",
        description: "Guest removed from table successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove guest from table",
        variant: "destructive",
      });
    }
  };

  if (guestsLoading || tablesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto"> {/* Changed from max-w-5xl to max-w-7xl to accommodate three columns */}
            <h1 className="text-3xl font-serif text-wedding-purple mb-8">
              Sitting Plan
            </h1>

            <div className="space-y-4 mb-8">
              <Input
                placeholder="Table Name"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
              />
              <Button onClick={handleAddTable} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Table
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Updated to show 3 columns on large screens */}
              {tables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  guests={guests}
                  onDeleteTable={handleDeleteTable}
                  onAssignGuest={handleAssignGuest}
                  onRemoveGuest={handleRemoveGuest}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}