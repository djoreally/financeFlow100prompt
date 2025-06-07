
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout"; 
import { TransactionForm } from "@/components/dashboard/transaction-form";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { BudgetSummary } from "@/components/dashboard/budget-summary";
import { SpendingPieChart } from "@/components/dashboard/spending-pie-chart";
import { IncomeExpenseBarChart } from "@/components/dashboard/income-expense-bar-chart";
import { AIInsightsSection } from "@/components/dashboard/ai-insights-section";
import { useTransactions } from "@/hooks/use-transactions";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AppHeader } from "@/components/layout/app-header"; 

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { transactions, addTransaction, deleteTransaction, isLoading: transactionsLoading } = useTransactions();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <>
        <AppHeader /> 
        <div className="flex-1 container mx-auto p-4 md:p-6 space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[600px] w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }
  
  if (transactionsLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
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
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout> 
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <BudgetSummary transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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

          <div className="lg:col-span-2 space-y-6">
            <TransactionList transactions={transactions} deleteTransaction={deleteTransaction} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SpendingPieChart transactions={transactions} />
              <IncomeExpenseBarChart transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
