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
    if (!tableId) return "Unassigned";
    const table = tables.find((t) => t.id === tableId);
    return table ? table.name : `Table ${tableId}`;
  };

  // CSV Export
  const csvContent = guests.map((guest) => {
    return {
      Name: guest.name,
      Category: guest.category,
      Table: getTableName(guest.tableId),
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(csvContent);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");
  XLSX.writeFile(workbook, "wedding-guest-list.xlsx");

  // PDF Export
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  doc.setFontSize(16);
  doc.text("Wedding Guest List", 14, 15);
  
  const tableData = guests.map((guest) => [
    guest.name,
    guest.category,
    getTableName(guest.tableId),
  ]);

  doc.autoTable({
    head: [["Name", "Category", "Table"]],
    body: tableData,
    startY: 25,
  });

  doc.save("wedding-guest-list.pdf");
};