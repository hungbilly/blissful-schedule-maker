import * as XLSX from "xlsx";
import { Guest, Table } from "@/components/project/types";

const getTableName = (tableId: number | null, tables: Table[]) => {
  if (!tableId) return "Unassigned";
  const table = tables.find((t) => t.id === tableId);
  return table ? table.name : "Unknown Table";
};

const prepareGuestData = (guests: Guest[], tables: Table[]) => {
  return guests.map((guest) => ({
    Name: guest.name,
    Category: guest.category || 'N/A',
    Table: getTableName(guest.tableId, tables),
  }));
};

const prepareTableData = (tables: Table[], guests: Guest[]) => {
  return tables.map((table) => {
    const tableGuests = guests.filter(guest => guest.tableId === table.id);
    return {
      'Table Name': table.name,
      'Number of Guests': tableGuests.length,
      'Guests': tableGuests.map(g => g.name).join(', '),
      'Categories': [...new Set(tableGuests.map(g => g.category || 'N/A'))].join(', ')
    };
  });
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

export const exportTablesToCSV = (tables: Table[], guests: Guest[]) => {
  const tableData = prepareTableData(tables, guests);
  const worksheet = XLSX.utils.json_to_sheet(tableData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tables");
  XLSX.writeFile(workbook, "wedding-tables.csv");
};

export const exportTablesToXLSX = (tables: Table[], guests: Guest[]) => {
  const tableData = prepareTableData(tables, guests);
  const worksheet = XLSX.utils.json_to_sheet(tableData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tables");
  XLSX.writeFile(workbook, "wedding-tables.xlsx");
};