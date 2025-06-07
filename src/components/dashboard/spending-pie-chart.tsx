
"use client"

import * as React from "react"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts" // Added ResponsiveContainer
import type { Transaction } from "@/lib/types"
import { useCategories } from "@/hooks/use-categories"; 
import { Shapes } from "lucide-react"; 

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
import { Skeleton } from "@/components/ui/skeleton";

interface SpendingPieChartProps {
  transactions: Transaction[]
}

export function SpendingPieChart({ transactions }: SpendingPieChartProps) {
  const { allCategories, isLoading: categoriesLoading } = useCategories();
  const expenseTransactions = transactions.filter((t) => t.type === "expense")

  const dataMap = new Map<string, number>()
  expenseTransactions.forEach((t) => {
    dataMap.set(t.category, (dataMap.get(t.category) || 0) + t.amount)
  })

  const chartData = Array.from(dataMap.entries()).map(([categoryName, amount]) => {
    const categoryDetails = allCategories.find(c => c.name === categoryName && c.type === 'expense');
    return {
      name: categoryName,
      value: amount,
      fill: categoryDetails?.color || "hsl(var(--muted))",
      icon: categoryDetails?.icon || Shapes,
    };
  })
  .sort((a,b) => b.value - a.value);

  const chartConfig = {} as ChartConfig
  chartData.forEach((item) => {
    chartConfig[item.name] = {
      label: item.name,
      color: item.fill,
      icon: item.icon,
    }
  })

  if (categoriesLoading) {
    return (
      <Card className="shadow-lg card-print">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Distribution of expenses by category.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
          <Skeleton className="h-48 w-48 rounded-full" />
          <Skeleton className="h-4 w-3/4 mt-4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardContent>
      </Card>
    );
  }

  if (expenseTransactions.length === 0) {
    return (
      <Card className="shadow-lg card-print">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Distribution of expenses by category.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground">No expense data to display.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col shadow-lg card-print">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Distribution of expenses by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 chart-print-container">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] w-full" // Ensure w-full for ResponsiveContainer
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="30%" // Adjusted for better responsiveness
                outerRadius="70%" // Adjusted for better responsiveness
                strokeWidth={2}
                labelLine={false} // Optionally hide label lines if too cluttered
                // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Example label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-1 [&>*]:basis-[45%] [&>*]:justify-center md:[&>*]:basis-1/4" // Adjusted for better wrapping
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
