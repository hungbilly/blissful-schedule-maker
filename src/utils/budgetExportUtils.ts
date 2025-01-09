import * as XLSX from "xlsx";
import { format } from "date-fns";
import { BudgetCategory } from "@/components/project/types";

const prepareBudgetData = (
  categories: BudgetCategory[],
  projectName?: string,
) => {
  const title = projectName ? `${projectName} - Budget` : "Wedding Budget";
  
  const data = categories.flatMap(category => 
    category.items.map(item => ({
      Category: category.name,
      Item: item.title,
      Amount: Number(item.amount), // Convert to number explicitly
    }))
  );

  return {
    title,
    data,
  };
};

export const exportToCSV = (
  categories: BudgetCategory[],
  currencySymbol: string,
  projectName?: string,
) => {
  const { data } = prepareBudgetData(categories, projectName);
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Set the Amount column to number format
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
  const amountCol = "C"; // Amount is the third column
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const cell = worksheet[amountCol + (row + 1)];
    if (cell) {
      cell.t = "n"; // Set cell type to number
      cell.z = "0.00"; // Format with 2 decimal places
    }
  }
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Budget");
  
  const fileName = `wedding-budget-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  XLSX.writeFile(workbook, fileName);
};

export const exportToExcel = (
  categories: BudgetCategory[],
  currencySymbol: string,
  projectName?: string,
) => {
  const { data } = prepareBudgetData(categories, projectName);
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Set the Amount column to number format
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
  const amountCol = "C"; // Amount is the third column
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const cell = worksheet[amountCol + (row + 1)];
    if (cell) {
      cell.t = "n"; // Set cell type to number
      cell.z = "0.00"; // Format with 2 decimal places
    }
  }
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Budget");
  
  const fileName = `wedding-budget-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};