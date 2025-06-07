"use client";

import { useState } from "react";
import { Bot, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBudgetInsights } from "@/ai/flows/budget-insights";
import type { Transaction } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface AIInsightsSectionProps {
  transactions: Transaction[];
}

export function AIInsightsSection({ transactions }: AIInsightsSectionProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetInsights = async () => {
    if (transactions.length < 5) {
        setError("Please add at least 5 transactions to get meaningful insights.");
        setInsights(null);
        return;
    }
    setIsLoading(true);
    setError(null);
    setInsights(null);
    try {
      const relevantTransactions = transactions.map(t => ({
        category: t.category,
        date: t.date,
        amount: t.amount,
        type: t.type, // Include type for better context for AI
      }));
      const result = await getBudgetInsights({
        transactionHistory: JSON.stringify(relevantTransactions),
      });
      setInsights(result.insights);
    } catch (err) {
      console.error("Failed to get AI insights:", err);
      setError("Sorry, we couldn't generate insights at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          AI Budget Advisor
        </CardTitle>
        <CardDescription>
          Get personalized insights and recommendations based on your spending habits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}
        {error && (
          <div className="text-destructive p-4 bg-destructive/10 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
        {insights && !isLoading && (
          <ScrollArea className="h-[200px] p-1">
             <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line rounded-md border p-4 bg-muted/50">
                {insights}
            </div>
          </ScrollArea>
        )}
        {!insights && !isLoading && !error && transactions.length > 0 && (
            <p className="text-muted-foreground text-center py-4">
                Click the button below to generate your personalized budget insights.
            </p>
        )}
         {!insights && !isLoading && !error && transactions.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
                Add some transactions first to enable AI insights.
            </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetInsights} disabled={isLoading || transactions.length === 0} className="w-full">
          {isLoading ? (
            "Generating Insights..."
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Get AI Insights
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
