
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Printer } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout"; 
import { TransactionForm } from "@/components/dashboard/transaction-form";
import { StatementUploadForm } from "@/components/dashboard/statement-upload-form"; // Added import
import { TransactionList } from "@/components/dashboard/transaction-list";
import { BudgetSummary } from "@/components/dashboard/budget-summary";
import { SpendingPieChart } from "@/components/dashboard/spending-pie-chart";
import { IncomeExpenseBarChart } from "@/components/dashboard/income-expense-bar-chart";
import { BudgetVsActualChart } from "@/components/dashboard/budget-vs-actual-chart";
import { AIInsightsSection } from "@/components/dashboard/ai-insights-section";
import { useTransactions } from "@/hooks/use-transactions";
import { useAuth } from '@/contexts/mock-auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';


export default function DashboardPage() {
  const { transactions, addTransaction, deleteTransaction, isLoading: transactionsLoading } = useTransactions();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const handlePrint = () => {
    window.print();
  };

  if (authLoading || transactionsLoading || (!user && !authLoading)) { 
    return (
      <DashboardLayout>
        <div className="container mx-auto space-y-6 print-hide pt-6 pb-8">
          <div className="flex justify-between items-center print-hide mb-6">
            <Skeleton className="h-9 w-48" /> {/* Page Title Skeleton */}
            <Skeleton className="h-9 w-32" /> {/* Print Button Skeleton */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-24 w-full rounded-lg" /> {/* BudgetSummary Card Skeleton */}
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-1 space-y-6">
              <Skeleton className="h-96 w-full rounded-lg" />  {/* TransactionForm Card Skeleton */}
              <Skeleton className="h-80 w-full rounded-lg" />  {/* StatementUploadForm Card Skeleton */}
              <Skeleton className="h-72 w-full rounded-lg" />  {/* AIInsightsSection Card Skeleton */}
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[550px] w-full rounded-lg" /> {/* TransactionList Card Skeleton */}
              <Skeleton className="h-96 w-full rounded-lg" /> {/* BudgetVsActualChart Card Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-80 w-full rounded-lg" /> {/* SpendingPieChart Skeleton */}
                <Skeleton className="h-80 w-full rounded-lg" /> {/* IncomeExpenseBarChart Skeleton */}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout> 
      <div className="container mx-auto space-y-8 print-container pt-6 pb-8">
        <div className="flex justify-between items-center print-hide">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </div>
        
        <BudgetSummary transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1 space-y-6 print-hide" data-testid="transaction-form-ai-column">
            <Card className="shadow-lg" data-testid="transaction-form-card">
              <CardHeader>
                <CardTitle>Add New Transaction</CardTitle>
                <CardDescription>Log your income or expenses manually.</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionForm addTransaction={addTransaction} />
              </CardContent>
            </Card>
            
            <StatementUploadForm />
            
            <AIInsightsSection transactions={transactions} data-testid="ai-insights-card"/>
          </div>

          <div className="lg:col-span-2 space-y-6 print-w-full">
            <TransactionList transactions={transactions} deleteTransaction={deleteTransaction} />
            <BudgetVsActualChart transactions={transactions} /> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-w-full">
              <SpendingPieChart transactions={transactions} />
              <IncomeExpenseBarChart transactions={transactions} />
            </div>
          </div>
        </div>
        <div className="print-footer">
          Finance Flow Report - Generated on {new Date().toLocaleDateString()}
        </div>
      </div>
    </DashboardLayout>
  );
}
