
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/'); // Redirect to the main page
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/20">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <UserPlus className="h-8 w-8 text-primary" />
              Redirecting...
            </CardTitle>
            <CardDescription>Authentication has been removed. You are being redirected to the main application.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
