
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { DashboardLayout } from "@/components/layout/dashboard-layout"; 
import { CategoryManager } from "@/components/settings/category-manager";
import { BudgetManager } from "@/components/settings/budget-manager";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, type MockUser } from "@/contexts/mock-auth-context";
import { useToast } from "@/hooks/use-toast";
import { UserCog } from 'lucide-react';


const profileFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").max(50, "Username too long."),
  email: z.string().email("Invalid email address."),
  // Password change could be added here if desired for a mock system
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;


export default function SettingsPage() {
  const { user, isLoading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
    if (user) { // Populate form when user data is available/updated
      profileForm.reset({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, authLoading, router, profileForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsSubmittingProfile(true);
    const success = await updateUser(data);
    if (success) {
      toast({ title: "Profile Updated", description: "Your information has been saved." });
    } else {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update profile. The new email might be in use." });
      // Re-populate with original user data if update failed, as local state might be stale
      if(user) profileForm.reset({ username: user.username, email: user.email });
    }
    setIsSubmittingProfile(false);
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <DashboardLayout> 
        <div className="container mx-auto space-y-8 pt-6 pb-8">
          <Skeleton className="h-10 w-1/4 mb-4" /> {/* Settings title */}
          
          {/* Profile Section Skeleton */}
          <Card>
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-1/4" />
            </CardContent>
          </Card>
          
          <Separator className="my-8" />
          <Skeleton className="h-64 w-full" /> {/* Category Manager Skeleton */}
          <Separator className="my-8" />
          <Skeleton className="h-64 w-full" /> {/* Budget Manager Skeleton */}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout> 
      <div className="container mx-auto space-y-8 pt-6 pb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <UserCog className="h-6 w-6 text-primary" />
                User Profile
            </CardTitle>
            <CardDescription>Manage your account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <FormField
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmittingProfile}>
                  {isSubmittingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Separator className="my-8" /> 
        <CategoryManager />
        <Separator className="my-8" /> 
        <BudgetManager />
      </div>
    </DashboardLayout>
  );
}
