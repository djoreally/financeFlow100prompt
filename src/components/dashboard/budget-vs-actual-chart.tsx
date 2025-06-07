
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import type { Transaction } from "@/lib/types"
import { useCategories } from "@/hooks/use-categories"
import { useBudgets } from "@/hooks/use-budgets"
import { Target } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface BudgetVsActualChartProps {
  transactions: Transaction[]
}

const chartConfig = {
  budget: {
    label: "Budget",
    color: "hsl(var(--chart-3))", 
  },
  actual: {
    label: "Actual Spending",
    color: "hsl(var(--chart-1))", 
  },
  overBudget: { 
    label: "Actual (Over Budget)",
    color: "hsl(var(--destructive))",
  }
} satisfies ChartConfig

export function BudgetVsActualChart({ transactions }: BudgetVsActualChartProps) {
  const { allCategories, isLoading: categoriesLoading } = useCategories();
  const { budgets, isLoading: budgetsLoading } = useBudgets();
  const [chartData, setChartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (categoriesLoading || budgetsLoading || !transactions) return;

    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    const expenseCategoriesWithBudget = allCategories.filter(
      (cat) => cat.type === "expense" && budgets[cat.id] !== undefined && budgets[cat.id] > 0
    );

    const data = expenseCategoriesWithBudget.map((category) => {
      const budgetAmount = budgets[category.id] || 0;
      const actualSpending = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category === category.name &&
            isWithinInterval(parseISO(t.date), { start: currentMonthStart, end: currentMonthEnd })
        )
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category.name,
        budget: budgetAmount,
        actual: actualSpending,
        fillActual: actualSpending > budgetAmount ? 'var(--color-overBudget)' : 'var(--color-actual)',
      };
    }).sort((a,b) => (b.actual / (b.budget || 1)) - (a.actual / (a.budget || 1))); // Sort by percentage of budget spent, avoid division by zero

    setChartData(data);
  }, [allCategories, budgets, transactions, categoriesLoading, budgetsLoading]);

  if (categoriesLoading || budgetsLoading) {
    return (
      <Card className="shadow-lg card-print">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Budget vs. Actual Spending (Current Month)
          </CardTitle>
          <CardDescription>Comparing your monthly budgets to actual expenses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="shadow-lg card-print">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Budget vs. Actual Spending (Current Month)
          </CardTitle>
          <CardDescription>Comparing your monthly budgets to actual expenses.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground text-center">
            No budgets set for expense categories, or no spending this month.
            <br />Set some budgets in Settings to see this chart.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg card-print">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Budget vs. Actual Spending (Current Month)
        </CardTitle>
        <CardDescription>
          Comparison of budgeted amounts vs. actual spending for your expense categories this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="chart-print-container">
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                interval={0} 
              />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                    formatter={(value, name, props) => {
                        if (name === 'actual') {
                           const budget = props.payload?.budget || 0;
                           const over = value > budget;
                           const diff = Math.abs(value - budget);
                           return (
                             <div className="flex flex-col">
                               <span>{`Actual: $${(value as number).toFixed(2)}`}</span>
                               <span style={{color: over ? 'hsl(var(--destructive))' : 'hsl(var(--chart-5))'}} >
                                {over ? `Over by $${diff.toFixed(2)}` : `Under by $${diff.toFixed(2)}`}
                               </span>
                             </div>
                           )
                        }
                        return `$${(value as number).toFixed(2)}`;
                    }}
                />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
              {chartData.map((entry, index) => (
                <Bar key={`actual-${index}`} dataKey="actual" name="actual" fill={entry.fillActual} radius={4}  stackId="a" data={[entry]}/>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
