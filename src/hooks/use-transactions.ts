
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo
import type { Transaction } from '@/lib/types';

const STORAGE_KEY = 'financeFlowTransactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        // Sort transactions by date descending before saving
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedTransactions));
      } catch (error) {
        console.error("Failed to save transactions to localStorage:", error);
      }
    }
  }, [transactions, isLoading]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => {
        const newTransaction = { ...transaction, id: crypto.randomUUID() };
        // Add new transaction and then re-sort
        const updated = [newTransaction, ...prev];
        return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactions(prev => {
        const updated = prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
        return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, []);
  
  const getTransactionById = useCallback((id: string) => {
    return transactions.find(t => t.id === id);
  }, [transactions]);

  // Use useMemo to sort transactions for display, ensuring list is always sorted
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  return { 
    transactions: sortedTransactions, // Return sorted transactions
    addTransaction, 
    deleteTransaction, 
    updateTransaction, 
    getTransactionById, 
    isLoading 
  };
}
