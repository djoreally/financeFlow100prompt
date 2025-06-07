
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import type { Transaction } from "@/lib/types"
import { format, parseISO } from "date-fns"

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

interface IncomeExpenseBarChartProps {
  transactions: Transaction[]
}

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))", // Using accent color for income
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-1))", // Using primary color for expenses
  },
} satisfies ChartConfig

export function IncomeExpenseBarChart({ transactions }: IncomeExpenseBarChartProps) {
  const monthlyData: { [key: string]: { income: number; expenses: number } } = {}

  transactions.forEach((t) => {
    const monthYear = format(parseISO(t.date), "MMM yyyy")
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { income: 0, expenses: 0 }
    }
    if (t.type === "income") {
      monthlyData[monthYear].income += t.amount
    } else {
      monthlyData[monthYear].expenses += t.amount
    }
  })

  const chartData = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      ...data,
    }))
    .sort((a,b) => parseISO(format(parseISO(`01 ${a.month}`), 'yyyy-MM-dd')) - parseISO(format(parseISO(`01 ${b.month}`), 'yyyy-MM-dd'))); // Sort by month


  if (transactions.length === 0) {
     return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Income vs Expenses</CardTitle>
          <CardDescription>Comparison of total income and expenses per month.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[250px]">
          <p className="text-muted-foreground">No transaction data to display.</p>
        </CardContent>
      </Card>
    )
  }


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Monthly Income vs Expenses</CardTitle>
        <CardDescription>Comparison of total income and expenses per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                // tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
