import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BudgetCategory, BudgetItem } from "@/components/project/types";
import { Plus, Trash2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Budget = () => {
  const [totalBudget, setTotalBudget] = useState<number>(100000);
  const [categories, setCategories] = useState<BudgetCategory[]>([
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
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemAmount, setNewItemAmount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const totalSpent = categories.reduce(
    (total, category) =>
      total + category.items.reduce((sum, item) => sum + item.amount, 0),
    0
  );

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    const newCategoryObj: BudgetCategory = {
      id: categories.length + 1,
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

  const handleAddItem = () => {
    if (!selectedCategory || !newItemTitle || newItemAmount < 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields correctly",
        variant: "destructive",
      });
      return;
    }

    const updatedCategories = categories.map((category) => {
      if (category.name === selectedCategory) {
        return {
          ...category,
          items: [
            ...category.items,
            {
              id: Math.max(...category.items.map((item) => item.id), 0) + 1,
              category: selectedCategory,
              title: newItemTitle,
              amount: newItemAmount,
            },
          ],
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    setNewItemTitle("");
    setNewItemAmount(0);
    toast({
      title: "Success",
      description: "Item added successfully",
    });
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

  return (
    <div className="min-h-screen bg-wedding-pink py-12">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl text-wedding-purple text-center font-serif mb-8">
          Budget
        </h1>
        <p className="text-center text-wedding-gray mb-12">
          Keep track of every penny you spend. Drag and drop your budget categories
          and individual items into your preferred order. Switch to advanced mode
          for even more detailed options.
        </p>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-serif">Budget</h2>
            <Input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-48"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm p-6 space-y-4"
            >
              <h3 className="text-xl font-serif text-wedding-purple">
                {category.name}
              </h3>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <span>{item.title}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) => {
                            const updatedCategories = categories.map((c) => {
                              if (c.id === category.id) {
                                return {
                                  ...c,
                                  items: c.items.map((i) =>
                                    i.id === item.id
                                      ? { ...i, amount: Number(e.target.value) }
                                      : i
                                  ),
                                };
                              }
                              return c;
                            });
                            setCategories(updatedCategories);
                          }}
                          className="w-24"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(category.id, item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex gap-4">
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

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="newItem">Add new item</Label>
              <div className="flex gap-2">
                <select
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Item title"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(Number(e.target.value))}
                  className="w-32"
                />
                <Button onClick={handleAddItem}>
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
  );
};

export default Budget;