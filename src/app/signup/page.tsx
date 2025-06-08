
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/mock-auth-context";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const signupFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isLoading: authLoading, user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    const success = await signUp(data.username, data.email, data.password);
    if (success) {
      toast({ title: "Account Created", description: "Welcome to Finance Flow!" });
      router.push('/'); 
    } else {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "This email might already be in use or an error occurred.",
      });
    }
    setIsSubmitting(false);
  };
  
  if (authLoading || user) { // Show loading or redirect if user becomes available
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center p-4">
           <Card className="w-full max-w-md shadow-xl">
             <CardHeader className="items-center">
                <UserPlus className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
             </CardHeader>
             <CardContent className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
             </CardContent>
           </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/20">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
             <div className="flex justify-center mb-4">
                <UserPlus className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-center">Create Your Account</CardTitle>
            <CardDescription className="text-center">Get started with managing your finances today.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
                  {isSubmitting ? "Creating Account..." : "Sign Up"}
                </Button>
              </CardContent>
            </form>
          </Form>
          <CardFooter className="flex flex-col items-center space-y-2 pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
