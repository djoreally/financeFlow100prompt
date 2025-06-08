
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/20">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <UserPlus className="h-8 w-8 text-primary" />
              Sign Up
            </CardTitle>
            <CardDescription>Authentication functionality has been removed from this application.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              This page is no longer active.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
