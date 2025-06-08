
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout"; 
import { CategoryManager } from "@/components/settings/category-manager";
import { BudgetManager } from "@/components/settings/budget-manager";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  // Authentication checks and loading states removed
  // const { user, loading: authLoading } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     router.replace('/login');
  //   }
  // }, [user, authLoading, router]);

  // if (authLoading || (!user && !authLoading)) {
  //   return (
  //     <>
  //       <AppHeader /> 
  //       <div className="flex-1 container mx-auto space-y-6 mt-4">
  //         <Skeleton className="h-12 w-1/3 mb-6" />
  //         <Skeleton className="h-64 w-full mb-6" />
  //         <Skeleton className="h-64 w-full" />
  //       </div>
  //     </>
  //   );
  // }

  return (
    <DashboardLayout> 
      <div className="container mx-auto space-y-8 pt-6 pb-8"> {/* Added padding top/bottom */}
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <CategoryManager />

        <Separator className="my-8" /> 

        <BudgetManager />
      </div>
    </DashboardLayout>
  );
}
