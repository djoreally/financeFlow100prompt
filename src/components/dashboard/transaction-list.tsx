
"use client";

import { format } from "date-fns";
import { Trash2, TrendingUp, TrendingDown, Edit3 } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { getCategoryIcon, getCategoryColor } from "@/lib/app-config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

interface TransactionListProps {
  transactions: Transaction[];
  deleteTransaction: (id: string) => void;
  // onEdit: (transaction: Transaction) => void; // For future edit functionality
}

export function TransactionList({ transactions, deleteTransaction }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>All your income and expense entries will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[200px] border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground text-center">No transactions yet. <br/>Add one using the form to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>A list of your recent income and expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] md:h-[500px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const Icon = getCategoryIcon(transaction.category);
                const categoryColor = getCategoryColor(transaction.category);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-xs">{format(new Date(transaction.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        style={{ borderColor: categoryColor, color: categoryColor }} 
                        className="flex items-center gap-1 w-fit capitalize"
                      >
                        <Icon className="h-3 w-3" />
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        transaction.type === "income" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)} className="mr-1 hover:text-primary">
                        <Edit3 className="h-4 w-4" />
                      </Button> */}
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the transaction: <span className="font-semibold">&quot;{transaction.description}&quot;</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteTransaction(transaction.id)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              Delete Transaction
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
