import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Settings } from "lucide-react";
import { BudgetCategory } from "@/components/budget/BudgetCategory";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useBudget } from "@/hooks/useBudget";
import { useProjectData } from "@/components/project/useProjectData";
import { useProjects } from "@/hooks/useProjects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "HKD", symbol: "HK$" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "EUR", symbol: "€" },
];

const Budget = () => {
  const [totalBudget, setTotalBudget] = useState<number>(100000);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const { data: projects = [] } = useProjects();
  const currentProjectId = projects.length > 0 ? projects[0].id : null;
  const { currentProject } = useProjectData(currentProjectId);
  const { 
    categories, 
    isLoading,
    addCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    updateCategory
  } = useBudget(currentProject?.id ?? null);

  const totalSpent = categories.reduce(
    (total, category) =>
      total + category.items.reduce((sum, item) => sum + Number(item.amount), 0),
    0
  );

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    addCategory.mutate(newCategory, {
      onSuccess: () => setNewCategory("")
    });
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 bg-wedding-pink py-12 md:ml-64 px-4 md:px-8">
            <div className="container max-w-3xl mx-auto">
              Loading...
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-wedding-pink py-12 md:ml-64 px-4 md:px-8">
          <div className="container max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl text-wedding-purple text-center font-serif mb-8">
              Budget
            </h1>
            <p className="text-center text-wedding-gray mb-12">
              Keep track of every penny you spend. Hover over items to edit them or add
              new ones to your categories.
            </p>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <h2 className="text-2xl font-serif">Budget</h2>
                <Input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full md:w-48"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-white border border-gray-200 shadow-lg"
                >
                  {CURRENCIES.map((currency) => (
                    <DropdownMenuItem
                      key={currency.code}
                      onClick={() => setSelectedCurrency(currency)}
                      className="hover:bg-gray-100"
                    >
                      {currency.code} ({currency.symbol})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-8">
              {categories.map((category) => (
                <BudgetCategory
                  key={category.id}
                  category={category}
                  onUpdateItem={(categoryId, updatedItem) => updateItem.mutate(updatedItem)}
                  onDeleteItem={(categoryId, itemId) => deleteItem.mutate({ categoryId, itemId })}
                  onAddItem={(categoryId, title, amount) => addItem.mutate({ categoryId, title, amount })}
                  onDeleteCategory={(categoryId) => deleteCategory.mutate(categoryId)}
                  onUpdateCategory={(categoryId, name) => updateCategory.mutate({ categoryId, name })}
                  currencySymbol={selectedCurrency.symbol}
                />
              ))}
            </div>

            <div className="mt-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="newCategory">Add category</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newCategory"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Category name"
                    />
                    <Button onClick={handleAddCategory}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center text-xl font-serif">
                <span>Actual total</span>
                <span className="text-wedding-purple">{selectedCurrency.symbol}{totalSpent.toFixed(2)}</span>
              </div>
              <div className="mt-4 text-center text-3xl text-wedding-gray">
                Budget {selectedCurrency.symbol}{totalBudget.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Budget;
