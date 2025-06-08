
"use client";

import React from "react"; // Added this line
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/use-categories"; // Import useCategories

const formSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Transaction type is required.",
  }),
  amount: z.coerce.number().positive("Amount must be positive."),
  category: z.string().min(1, "Category is required."),
  date: z.date({ required_error: "Date is required." }),
  description: z.string().min(1, "Description is required.").max(100, "Description too long."),
});

type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  className?: string;
}

export function TransactionForm({ addTransaction, className }: TransactionFormProps) {
  const { toast } = useToast();
  const { allCategories, isLoading: categoriesLoading } = useCategories(); // Use categories hook

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: '', // Changed from undefined to empty string
      category: "",
      date: new Date(),
      description: "",
    },
  });

  const transactionType = form.watch("type");

  const onSubmit = (data: TransactionFormValues) => {
    addTransaction({
      ...data,
      date: data.date.toISOString(),
    });
    toast({
      title: "Transaction Added",
      description: `${data.type === 'income' ? 'Income' : 'Expense'} of $${data.amount.toFixed(2)} for ${data.category} added.`,
    });
    form.reset();
    form.setValue("date", new Date());
    form.setValue("type", "expense");
  };

  const filteredCategories = React.useMemo(() => {
    return allCategories.filter((cat) => cat.type === transactionType);
  }, [allCategories, transactionType]);


  if (categoriesLoading) {
    return <p>Loading categories...</p>; // Or a skeleton loader
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("category", "");
                  }}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal">Income</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expense" />
                    </FormControl>
                    <FormLabel className="font-normal">Expense</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Coffee, Salary"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={filteredCategories.length === 0}>
                      <SelectValue placeholder={filteredCategories.length === 0 ? "No categories for this type" : "Select a category"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </form>
    </Form>
  );
}
