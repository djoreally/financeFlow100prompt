
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Category } from '@/lib/types';
import { defaultCategories, DefaultCustomCategoryIcon } from '@/lib/app-config';
import type { LucideIcon } from 'lucide-react';

const STORAGE_KEY_CUSTOM_CATEGORIES = 'financeFlowCustomCategories';
const CHART_COLORS_FOR_CUSTOM = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function useCategories() {
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedCustomCategories = localStorage.getItem(STORAGE_KEY_CUSTOM_CATEGORIES);
      if (storedCustomCategories) {
        setCustomCategories(JSON.parse(storedCustomCategories));
      }
    } catch (error) {
      console.error("Failed to load custom categories from localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_CATEGORIES, JSON.stringify(customCategories));
      } catch (error) {
        console.error("Failed to save custom categories to localStorage:", error);
      }
    }
  }, [customCategories, isLoading]);

  const allCategories = useMemo(() => {
    // Ensure default categories are not duplicated if custom ones have same name (though ID should differ)
    const combined = [...defaultCategories, ...customCategories];
    // Simple deduplication by ID, prioritizing custom categories if IDs clash (shouldn't happen with UUIDs)
    const uniqueCategories = Array.from(new Map(combined.map(cat => [cat.id, cat])).values());
    return uniqueCategories;
  }, [customCategories]);


  const addCustomCategory = useCallback((name: string, type: 'income' | 'expense') => {
    if (name.trim() === "") return; // Basic validation
    if (allCategories.some(cat => cat.name.toLowerCase() === name.toLowerCase() && cat.type === type)) {
        // Potentially show a toast message here that category already exists
        console.warn(`Category "${name}" of type "${type}" already exists.`);
        return; 
    }

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      icon: DefaultCustomCategoryIcon, // Default icon
      color: CHART_COLORS_FOR_CUSTOM[customCategories.length % CHART_COLORS_FOR_CUSTOM.length], // Cycle through colors
      isCustom: true,
    };
    setCustomCategories(prev => [...prev, newCategory]);
  }, [customCategories.length, allCategories]);

  const deleteCustomCategory = useCallback((id: string) => {
    setCustomCategories(prev => prev.filter(cat => cat.id !== id));
  }, []);
  
  // Helper function to get a category by its name, useful for finding its icon/color
  const getCategoryDetails = useCallback((name: string, type?: 'income' | 'expense'): Category | undefined => {
    return allCategories.find(cat => cat.name === name && (type ? cat.type === type : true));
  }, [allCategories]);


  return { 
    allCategories, 
    customCategories,
    addCustomCategory, 
    deleteCustomCategory, 
    isLoading,
    getCategoryDetails
  };
}
