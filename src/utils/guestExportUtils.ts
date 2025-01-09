import * as XLSX from "xlsx";
import { Guest, Table } from "@/components/project/types";

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