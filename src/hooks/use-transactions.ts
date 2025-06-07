
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import { useBudgets } from './use-budgets';
import { useCategories } from './use-categories';
import { useToast } from './use-toast';
import { isWithinInterval, startOfMonth, endOfMonth, parseISO } from 'date-fns';

const STORAGE_KEY = 'financeFlowTransactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { budgets, isLoading: budgetsLoading } = useBudgets();
  const { getCategoryDetails, isLoading: categoriesLoading } = useCategories();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem(STORAGE_KEY);
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error("Failed to load transactions from localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedTransactions));
      } catch (error) {
        console.error("Failed to save transactions to localStorage:", error);
      }
    }
  }, [transactions, isLoading]);

  const addTransaction = useCallback((transactionData: Omit<Transaction, 'id'>) => {
    if (budgetsLoading || categoriesLoading) {
      // Avoid acting if budget/category data isn't ready, could queue or log
      console.warn("Attempted to add transaction while budgets/categories are loading.");
      // Fallback to just adding the transaction without alert if critical data is missing
      const newTransactionWithoutAlert = { ...transactionData, id: crypto.randomUUID() };
      setTransactions(prev => {
          const updated = [newTransactionWithoutAlert, ...prev];
          return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
      return;
    }

    const newTransaction = { ...transactionData, id: crypto.randomUUID() };

    // Budget alert logic
    if (newTransaction.type === 'expense') {
      const categoryDetails = getCategoryDetails(newTransaction.category, 'expense');
      
      if (categoryDetails && budgets[categoryDetails.id] !== undefined) {
        const budgetAmount = budgets[categoryDetails.id];
        const now = new Date();
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);

        let currentMonthSpendingBefore = 0;
        transactions.forEach(t => {
          if (
            t.type === 'expense' &&
            t.category === newTransaction.category && // Match based on category name
            isWithinInterval(parseISO(t.date), { start: currentMonthStart, end: currentMonthEnd })
          ) {
            currentMonthSpendingBefore += t.amount;
          }
        });

        const currentMonthSpendingAfter = currentMonthSpendingBefore + newTransaction.amount;

        if (budgetAmount >= 0 && currentMonthSpendingBefore <= budgetAmount && currentMonthSpendingAfter > budgetAmount) {
          toast({
            variant: "destructive",
            title: "Budget Alert",
            description: `You've exceeded your budget for "${newTransaction.category}" this month. Budget: $${budgetAmount.toFixed(2)}, Spent: $${currentMonthSpendingAfter.toFixed(2)}.`,
            duration: 5000, // Show for 5 seconds
          });
        }
      }
    }

    setTransactions(prev => {
        const updated = [newTransaction, ...prev];
        return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, [transactions, budgets, getCategoryDetails, toast, setTransactions, budgetsLoading, categoriesLoading]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactions(prev => {
        const updated = prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
        // Budget alert logic could also be added here if needed, similar to addTransaction
        return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, []);
  
  const getTransactionById = useCallback((id: string) => {
    return transactions.find(t => t.id === id);
  }, [transactions]);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  return { 
    transactions: sortedTransactions, 
    addTransaction, 
    deleteTransaction, 
    updateTransaction, 
    getTransactionById, 
    isLoading: isLoading || budgetsLoading || categoriesLoading // Combine loading states
  };
}
