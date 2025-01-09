import { Guest, Table } from "@/components/project/types";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import { UserOptions } from 'jspdf-autotable';

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

const getTableName = (tableId: number | null, tables: Table[]) => {
  if (!tableId) return "Unassigned";
  const table = tables.find((t) => t.id === tableId);
  return table ? table.name : `Table ${tableId}`;
};

const prepareGuestData = (guests: Guest[], tables: Table[]) => {
  return guests.map((guest) => ({
    Name: guest.name,
    Category: guest.category || 'N/A',
    Table: getTableName(guest.tableId, tables),
  }));
};

export const exportGuestsToCSV = (guests: Guest[], tables: Table[]) => {
  const guestData = prepareGuestData(guests, tables);
  const worksheet = XLSX.utils.json_to_sheet(guestData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");
  XLSX.writeFile(workbook, "wedding-guest-list.csv");
};

export const exportGuestsToXLSX = (guests: Guest[], tables: Table[]) => {
  const guestData = prepareGuestData(guests, tables);
  const worksheet = XLSX.utils.json_to_sheet(guestData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");
  XLSX.writeFile(workbook, "wedding-guest-list.xlsx");
};

export const exportGuestsToPDF = (guests: Guest[], tables: Table[]) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  doc.setFontSize(16);
  doc.text("Wedding Guest List", 14, 15);
  
  const tableData = guests.map((guest) => [
    guest.name,
    guest.category || 'N/A',
    getTableName(guest.tableId, tables),
  ]);

  doc.autoTable({
    head: [["Name", "Category", "Table"]],
    body: tableData,
    startY: 25,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [147, 51, 234], // wedding-purple color
      textColor: 255,
      fontSize: 11,
      fontStyle: 'bold',
    },
  });

  doc.save("wedding-guest-list.pdf");
};