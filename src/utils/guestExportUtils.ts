import { Guest } from "@/components/project/types";

export const exportGuestsToCSV = (guests: Guest[]) => {
  // Define CSV headers
  const headers = ['Name', 'Category', 'Table'];
  
  // Convert guests to CSV rows
  const rows = guests.map(guest => [
    guest.name,
    guest.category,
    guest.tableId ? `Table ${guest.tableId}` : 'Not Assigned'
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'guest_list.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};