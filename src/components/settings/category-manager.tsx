
"use client";

import React, { useState } from 'react';
import { useCategories } from '@/hooks/use-categories';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit3, Shapes } from 'lucide-react';
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
    // For now, only adding expense categories as per user request context
    // Check if category already exists (case-insensitive)
    const existingCategory = allCategories.find(
      cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase() && cat.type === 'expense'
    );
    if (existingCategory) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Expense category "${newCategoryName.trim()}" already exists.`,
      });
      return;
    }

    addCustomCategory(newCategoryName, 'expense');
    toast({
      title: "Success",
      description: `Expense category "${newCategoryName.trim()}" added.`,
    });
    setNewCategoryName('');
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
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-8 w-1/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const expenseCategories = allCategories.filter(cat => cat.type === 'expense');
  // const incomeCategories = allCategories.filter(cat => cat.type === 'income');


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Manage Expense Categories</CardTitle>
        <CardDescription>Add or remove your custom expense categories. Income categories and default expense categories are managed by the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-2">
          <Input
            type="text"
            placeholder="New expense category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        <h3 className="text-lg font-semibold mb-2">Expense Categories</h3>
        {expenseCategories.length === 0 ? (
          <p className="text-muted-foreground">No expense categories found. Add one above!</p>
        ) : (
          <ScrollArea className="h-[300px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                                  This action cannot be undone. Transactions using this category will not be automatically reassigned.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                      deleteCustomCategory(category.id);
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
                        {/* Edit button placeholder
                        <Button variant="ghost" size="icon" className="ml-1 hover:text-primary">
                            <Edit3 className="h-4 w-4" />
                        </Button>
                        */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
        {/* Placeholder for income categories if needed in future
        <h3 className="text-lg font-semibold mt-6 mb-2">Income Categories</h3>
        ... list income categories ...
        */}
      </CardContent>
    </Card>
  );
}
