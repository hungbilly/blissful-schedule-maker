import { Guest } from "@/components/project/types";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import { UserOptions } from 'jspdf-autotable';

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

export const exportGuestsToCSV = (guests: Guest[], tables: { id: number; name: string }[]) => {
  const getTableName = (tableId: number | null) => {
    if (!tableId) return 'Not Assigned';
    const table = tables.find(t => t.id === tableId);
    return table ? table.name : `Table ${tableId}`;
  };

  // Define CSV headers
  const headers = ['Name', 'Category', 'Table'];
  
  // Convert guests to CSV rows
  const rows = guests.map(guest => [
    guest.name,
    guest.category,
    getTableName(guest.tableId)
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
  link.setAttribute('download', 'sitting_plan.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportGuestsToXLSX = (guests: Guest[], tables: { id: number; name: string }[]) => {
  const getTableName = (tableId: number | null) => {
    if (!tableId) return 'Not Assigned';
    const table = tables.find(t => t.id === tableId);
    return table ? table.name : `Table ${tableId}`;
  };

  const data = guests.map(guest => ({
    Name: guest.name,
    Category: guest.category,
    Table: getTableName(guest.tableId)
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sitting Plan");
  XLSX.writeFile(wb, "sitting_plan.xlsx");
};

export const exportGuestsToPDF = (guests: Guest[], tables: { id: number; name: string }[]) => {
  const getTableName = (tableId: number | null) => {
    if (!tableId) return 'Not Assigned';
    const table = tables.find(t => t.id === tableId);
    return table ? table.name : `Table ${tableId}`;
  };

  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  doc.setFontSize(16);
  doc.text("Wedding Sitting Plan", 14, 15);
  
  const tableData = guests.map(guest => [
    guest.name,
    guest.category,
    getTableName(guest.tableId)
  ]);

  doc.autoTable({
    head: [['Name', 'Category', 'Table']],
    body: tableData,
    startY: 25,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [107, 78, 113], // wedding-purple in RGB
      textColor: 255,
    },
  });

  doc.save("sitting_plan.pdf");
};