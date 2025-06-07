
"use client";

import React, { useState } from 'react';
import { useCategories } from '@/hooks/use-categories';
import { useBudgets } from '@/hooks/use-budgets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Trash2, Shapes } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function BudgetManager() {
  const { allCategories, isLoading: categoriesLoading } = useCategories();
  const { budgets, setBudgetForCategory, removeBudgetForCategory, isLoading: budgetsLoading } = useBudgets();
  const { toast } = useToast();

  // Local state to manage input values to avoid updating global state on every keystroke
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const expenseCategories = React.useMemo(() => {
    return allCategories.filter(cat => cat.type === 'expense');
  }, [allCategories]);

  React.useEffect(() => {
    // Initialize inputValues when budgets are loaded
    if (!budgetsLoading) {
      const initialInputValues: Record<string, string> = {};
      expenseCategories.forEach(category => {
        initialInputValues[category.id] = budgets[category.id]?.toString() || '';
      });
      setInputValues(initialInputValues);
    }
  }, [budgets, budgetsLoading, expenseCategories]);


  const handleInputChange = (categoryId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSetBudget = (categoryId: string, categoryName: string) => {
    const rawValue = inputValues[categoryId];
    if (rawValue === undefined || rawValue.trim() === '') {
      // If input is empty, consider it as removing the budget
      removeBudgetForCategory(categoryId);
      toast({
        title: "Budget Removed",
        description: `Budget for "${categoryName}" has been cleared.`,
      });
      return;
    }

    const amount = parseFloat(rawValue);
    if (isNaN(amount) || amount < 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid non-negative number for the budget.",
      });
      return;
    }
    setBudgetForCategory(categoryId, amount);
    toast({
      title: "Budget Set",
      description: `Budget for "${categoryName}" set to $${amount.toFixed(2)}.`,
    });
  };
  
  const handleRemoveBudget = (categoryId: string, categoryName: string) => {
    removeBudgetForCategory(categoryId);
    setInputValues(prev => ({ ...prev, [categoryId]: '' })); // Clear input field
    toast({
      title: "Budget Removed",
      description: `Budget for "${categoryName}" has been cleared.`,
    });
  };

  if (categoriesLoading || budgetsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Budgets</CardTitle>
          <CardDescription>Set monthly spending limits for your expense categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 p-2 border-b">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-1/4 ml-auto" />
                <Skeleton className="h-10 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          Manage Budgets
        </CardTitle>
        <CardDescription>Set monthly spending limits for your expense categories.</CardDescription>
      </CardHeader>
      <CardContent>
        {expenseCategories.length === 0 ? (
          <p className="text-muted-foreground">No expense categories found. Add some in Category Management first.</p>
        ) : (
          <ScrollArea className="h-[400px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-[150px] md:w-[200px]">Budget Amount ($)</TableHead>
                  <TableHead className="text-right w-[120px] md:w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseCategories.map((category) => {
                  const Icon = category.icon || Shapes;
                  return (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                           <Icon className="h-4 w-4" style={{ color: category.color || 'hsl(var(--foreground))' }} />
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          placeholder="e.g., 200"
                          value={inputValues[category.id] || ''}
                          onChange={(e) => handleInputChange(category.id, e.target.value)}
                          className="w-full"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button 
                          onClick={() => handleSetBudget(category.id, category.name)}
                          size="sm"
                        >
                          Set
                        </Button>
                        {budgets[category.id] !== undefined && (
                           <Button 
                            onClick={() => handleRemoveBudget(category.id, category.name)}
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            title="Clear Budget"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
