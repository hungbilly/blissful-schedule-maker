import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BudgetCategory as BudgetCategoryType, BudgetItem } from "@/components/project/types";
import { Plus, Settings } from "lucide-react";
import { BudgetCategory } from "@/components/budget/BudgetCategory";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Budget = () => {
  const [totalBudget, setTotalBudget] = useState<number>(100000);
  const [categories, setCategories] = useState<BudgetCategoryType[]>([
    {
      id: 1,
      name: "Entertainment",
      items: [
        { id: 1, category: "Entertainment", title: "Band", amount: 111 },
      ],
    },
    {
      id: 2,
      name: "Beauty and Health",
      items: [
        { id: 2, category: "Beauty and Health", title: "Hair and Makeup", amount: 0 },
        { id: 3, category: "Beauty and Health", title: "Prewedding Pampering", amount: 0 },
      ],
    },
    {
      id: 3,
      name: "Other",
      items: [
        { id: 4, category: "Other", title: "Firework!", amount: 0 },
        { id: 5, category: "Other", title: "Accommodations for Wedding Night", amount: 0 },
        { id: 6, category: "Other", title: "Bridesmaid Gifts", amount: 0 },
        { id: 7, category: "Other", title: "Groomsmen Gifts", amount: 0 },
        { id: 8, category: "Other", title: "Parent Gifts", amount: 0 },
        { id: 9, category: "Other", title: "Hotel Rooms for Out-of-Town Guests", amount: 0 },
      ],
    },
  ]);

  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");

  const totalSpent = categories.reduce(
    (total, category) =>
      total + category.items.reduce((sum, item) => sum + item.amount, 0),
    0
  );

  const handleUpdateItem = (categoryId: number, updatedItem: BudgetItem) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  const handleDeleteItem = (categoryId: number, itemId: number) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter((item) => item.id !== itemId),
        };
      }
      return category;
    });
    setCategories(updatedCategories);
    toast({
      title: "Success",
      description: "Item deleted successfully",
    });
  };

  const handleAddItem = (categoryId: number, title: string, amount: number) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: [
            ...category.items,
            {
              id: Math.max(...category.items.map((item) => item.id), 0) + 1,
              category: category.name,
              title,
              amount,
            },
          ],
        };
      }
      return category;
    });
    setCategories(updatedCategories);
    toast({
      title: "Success",
      description: "Item added successfully",
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    const newCategoryObj: BudgetCategoryType = {
      id: Math.max(...categories.map((cat) => cat.id), 0) + 1,
      name: newCategory,
      items: [],
    };

    setCategories([...categories, newCategoryObj]);
    setNewCategory("");
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const handleDeleteCategory = (categoryId: number) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        {/* Add margin-left for desktop and padding for mobile */}
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
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-8">
              {categories.map((category) => (
                <BudgetCategory
                  key={category.id}
                  category={category}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onAddItem={handleAddItem}
                  onDeleteCategory={handleDeleteCategory}
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
                <span className="text-wedding-purple">${totalSpent.toFixed(2)}</span>
              </div>
              <div className="mt-4 text-center text-3xl text-wedding-gray">
                Budget ${totalBudget.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Budget;