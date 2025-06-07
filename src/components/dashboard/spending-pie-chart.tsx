"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import type { Transaction } from "@/lib/types"
import { getCategoryColor, defaultCategories } from "@/lib/app-config"

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

interface SpendingPieChartProps {
  transactions: Transaction[]
}

export function SpendingPieChart({ transactions }: SpendingPieChartProps) {
  const expenseTransactions = transactions.filter((t) => t.type === "expense")

  const dataMap = new Map<string, number>()
  expenseTransactions.forEach((t) => {
    dataMap.set(t.category, (dataMap.get(t.category) || 0) + t.amount)
  })

  const chartData = Array.from(dataMap.entries()).map(([category, amount]) => ({
    name: category,
    value: amount,
    fill: getCategoryColor(category) || "hsl(var(--muted))",
  }))
  .sort((a,b) => b.value - a.value); // Sort for consistent legend and color order

  const chartConfig = {} as ChartConfig
  chartData.forEach((item) => {
    const categoryDetails = defaultCategories.find(c => c.name === item.name);
    chartConfig[item.name] = {
      label: item.name,
      color: item.fill,
      icon: categoryDetails?.icon
    }
  })


  if (expenseTransactions.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Distribution of expenses by category.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[250px]">
          <p className="text-muted-foreground">No expense data to display.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Distribution of expenses by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={2}
              activeIndex={0} // Allows for hover effect on first slice
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
             <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
