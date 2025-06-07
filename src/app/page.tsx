"use client";

import { AppHeader } from "@/components/layout/app-header";
import { TransactionForm } from "@/components/dashboard/transaction-form";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { BudgetSummary } from "@/components/dashboard/budget-summary";
import { SpendingPieChart } from "@/components/dashboard/spending-pie-chart";
import { IncomeExpenseBarChart } from "@/components/dashboard/income-expense-bar-chart";
import { AIInsightsSection } from "@/components/dashboard/ai-insights-section";
import { useTransactions } from "@/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { transactions, addTransaction, deleteTransaction, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <main className="flex-1 container mx-auto p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[600px] w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto p-4 md:p-6 space-y-8">
          <BudgetSummary transactions={transactions} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Forms & AI */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Add New Transaction</CardTitle>
                  <CardDescription>Log your income or expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionForm addTransaction={addTransaction} />
                </CardContent>
              </Card>
              <AIInsightsSection transactions={transactions} />
            </div>

            {/* Right Column: Transaction List & Charts */}
            <div className="lg:col-span-2 space-y-6">
              <TransactionList transactions={transactions} deleteTransaction={deleteTransaction} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SpendingPieChart transactions={transactions} />
                <IncomeExpenseBarChart transactions={transactions} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Finance Flow. All rights reserved.
      </footer>
    </div>
  );
}
