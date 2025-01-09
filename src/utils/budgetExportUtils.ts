import * as XLSX from "xlsx";
import { format } from "date-fns";
import { BudgetCategory } from "@/components/project/types";

const prepareBudgetData = (
  categories: BudgetCategory[],
  currencySymbol: string,
  projectName?: string,
) => {
  const title = projectName ? `${projectName} - Budget` : "Wedding Budget";
  
  const data = categories.flatMap(category => 
    category.items.map(item => ({
      Category: category.name,
      Item: item.title,
      Amount: `${currencySymbol}${item.amount.toFixed(2)}`,
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
  const { data } = prepareBudgetData(categories, currencySymbol, projectName);
  const worksheet = XLSX.utils.json_to_sheet(data);
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
  const { data } = prepareBudgetData(categories, currencySymbol, projectName);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Budget");
  
  const fileName = `wedding-budget-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};