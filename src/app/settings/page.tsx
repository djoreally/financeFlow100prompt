
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout"; 
import { useAuth } from "@/contexts/auth-context";
import { CategoryManager } from "@/components/settings/category-manager";
import { BudgetManager } from "@/components/settings/budget-manager"; // Import BudgetManager
import { Separator } from "@/components/ui/separator"; // Import Separator
import { Skeleton } from "@/components/ui/skeleton";
import { AppHeader } from "@/components/layout/app-header"; 

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
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
          <Skeleton className="h-12 w-1/3 mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </>
    );
  }

  return (
    <DashboardLayout> 
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <CategoryManager />

        <Separator className="my-8" /> 

        <BudgetManager />
      </div>
    </DashboardLayout>
  );
}
