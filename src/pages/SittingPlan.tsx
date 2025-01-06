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
import { useGuests } from "@/hooks/useGuests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export default function SittingPlan() {
  const [tables, setTables] = useState<Table[]>([]);
  const [newTableName, setNewTableName] = useState("");
  const { toast } = useToast();
  const { guests, guestsLoading } = useGuests();
  const session = useSession();
  const queryClient = useQueryClient();

  const unassignedGuests = guests.filter(guest => !guest.tableId);

  const assignGuestMutation = useMutation({
    mutationFn: async ({ guestId, tableId }: { guestId: number, tableId: number }) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('guests')
        .update({ table_id: tableId })
        .eq('id', guestId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Success",
        description: "Guest assigned to table successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign guest to table",
        variant: "destructive",
      });
    },
  });

  const removeGuestFromTableMutation = useMutation({
    mutationFn: async (guestId: number) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('guests')
        .update({ table_id: null })
        .eq('id', guestId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Success",
        description: "Guest removed from table successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove guest from table",
        variant: "destructive",
      });
    },
  });

  const handleAddTable = () => {
    if (!newTableName.trim()) {
      toast({
        title: "Error",
        description: "Table name is required",
        variant: "destructive",
      });
      return;
    }

    const newTable: Table = {
      id: tables.length + 1,
      name: newTableName,
      capacity: 8,
      guests: [],
    };

    setTables([...tables, newTable]);
    setNewTableName("");
    toast({
      title: "Success",
      description: "Table added successfully",
    });
  };

  const handleDeleteTable = (id: number) => {
    // Remove all guests from this table first
    const tableGuests = tables.find(t => t.id === id)?.guests || [];
    tableGuests.forEach(guest => {
      removeGuestFromTableMutation.mutate(guest.id);
    });
    
    setTables(tables.filter((t) => t.id !== id));
    toast({
      title: "Success",
      description: "Table deleted successfully",
    });
  };

  const handleAssignGuest = (tableId: number, guestId: string) => {
    assignGuestMutation.mutate({ 
      guestId: Number(guestId), 
      tableId 
    });
  };

  const handleRemoveGuest = (tableId: number, guestId: number) => {
    removeGuestFromTableMutation.mutate(guestId);
  };

  if (guestsLoading) {
    return <div>Loading guests...</div>;
  }

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
                      <h3 className="font-medium">{table.name}</h3>
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

                  {unassignedGuests.length > 0 && (
                    <Select onValueChange={(value) => handleAssignGuest(table.id, value)}>
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}