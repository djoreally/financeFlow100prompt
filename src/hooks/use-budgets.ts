
"use client";

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_BUDGETS = 'financeFlowBudgets';

// Budgets are stored as a Record: { [categoryId: string]: number }
export interface Budgets {
  [categoryId: string]: number;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budgets>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedBudgets = localStorage.getItem(STORAGE_KEY_BUDGETS);
      if (storedBudgets) {
        setBudgets(JSON.parse(storedBudgets));
      }
    } catch (error) {
      console.error("Failed to load budgets from localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(budgets));
      } catch (error) {
        console.error("Failed to save budgets to localStorage:", error);
      }
    }
  }, [budgets, isLoading]);

  const setBudgetForCategory = useCallback((categoryId: string, amount: number) => {
    if (amount < 0) {
        // Or handle this with a toast in the component
        console.error("Budget amount cannot be negative.");
        return;
    }
    setBudgets(prev => ({
      ...prev,
      [categoryId]: amount,
    }));
  }, []);

  const getBudgetForCategory = useCallback((categoryId: string): number | undefined => {
    return budgets[categoryId];
  }, [budgets]);

  const removeBudgetForCategory = useCallback((categoryId: string) => {
    setBudgets(prev => {
      const newBudgets = { ...prev };
      delete newBudgets[categoryId];
      return newBudgets;
    });
  }, []);

  return {
    budgets,
    setBudgetForCategory,
    getBudgetForCategory,
    removeBudgetForCategory,
    isLoading,
    allBudgets: budgets // Expose all for convenience if needed
  };
}
