
"use client";

import React, { useState } from 'react';
import { useCategories } from '@/hooks/use-categories';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit3, Shapes, FolderPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export function CategoryManager() {
  const { 
    allCategories, 
    addCustomCategory, 
    deleteCustomCategory, 
    isLoading: categoriesLoading 
  } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name cannot be empty.",
      });
      return;
    }
    
    const success = addCustomCategory(newCategoryName, 'expense'); // Returns true if added, false if exists
    
    if (success) {
      toast({
        title: "Success",
        description: `Expense category "${newCategoryName.trim()}" added.`,
      });
      setNewCategoryName('');
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: `Expense category "${newCategoryName.trim()}" already exists or could not be added.`,
      });
    }
  };

  if (categoriesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>View, add, or remove your custom transaction categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-2">
            <Skeleton className="h-10 w-full md:w-1/2" />
            <Skeleton className="h-8 w-1/4" />
          </div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2 border-b">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-8 w-10 ml-auto" />
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const expenseCategories = allCategories.filter(cat => cat.type === 'expense');


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderPlus className="h-6 w-6 text-primary"/>
           Manage Expense Categories
        </CardTitle>
        <CardDescription>Add or remove your custom expense categories. Income categories and default expense categories are managed by the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="New expense category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-grow"
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
          />
          <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        {/* <h3 className="text-lg font-semibold mb-2">Expense Categories</h3> */}
        {expenseCategories.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No expense categories found. Add one above!</p>
        ) : (
          <ScrollArea className="h-[300px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseCategories.map((category) => {
                  const Icon = category.icon || Shapes;
                  return (
                    <TableRow key={category.id}>
                      <TableCell>
                        <Icon className="h-5 w-5" style={{ color: category.color || 'hsl(var(--foreground))' }} />
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <Badge variant={category.isCustom ? "secondary" : "outline"}>
                          {category.isCustom ? 'Custom' : 'Default'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {category.isCustom && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category &quot;{category.name}&quot;?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. Transactions using this category will not be automatically reassigned. Associated budget settings for this category will also be removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                      deleteCustomCategory(category.id);
                                      // Note: Associated budgets are not automatically deleted here. 
                                      // The useBudgets hook could be extended to clean up if needed, or leave orphaned budget data.
                                      // For now, let's assume BudgetManager will just not show inputs for deleted categories.
                                      toast({title: "Success", description: `Category "${category.name}" deleted.`});
                                    }}
                                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

