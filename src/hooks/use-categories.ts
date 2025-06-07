
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo
import type { Category } from '@/lib/types';
import { defaultCategories, DefaultCustomCategoryIcon } from '@/lib/app-config';
// import type { LucideIcon } from 'lucide-react'; // Not directly needed here

const STORAGE_KEY_CUSTOM_CATEGORIES = 'financeFlowCustomCategories';
const CHART_COLORS_FOR_CUSTOM = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  // Add more distinct colors if needed, or a color generation function
  'hsl(var(--accent))', 
  'hsl(180 40% 50%)', // teal
  'hsl(30 80% 60%)',  // orange
  'hsl(120 40% 55%)', // green
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
    const combined = [...defaultCategories, ...customCategories];
    const uniqueCategories = Array.from(new Map(combined.map(cat => [cat.id, cat])).values());
    return uniqueCategories;
  }, [customCategories]);


  const addCustomCategory = useCallback((name: string, type: 'income' | 'expense') => {
    if (name.trim() === "") return; 
    
    const categoryExists = allCategories.some(
      cat => cat.name.toLowerCase() === name.trim().toLowerCase() && cat.type === type
    );
    if (categoryExists) {
        console.warn(`Category "${name.trim()}" of type "${type}" already exists.`);
        // Consider returning a status or throwing an error to be caught by UI for a toast
        return false; 
    }

    // Determine next color, ensuring it's somewhat unique among custom categories of the same type
    const existingCustomColorsForType = customCategories
      .filter(cat => cat.type === type)
      .map(cat => cat.color);
    
    let nextColor = CHART_COLORS_FOR_CUSTOM[0]; // Default fallback
    for (const color of CHART_COLORS_FOR_CUSTOM) {
        if (!existingCustomColorsForType.includes(color)) {
            nextColor = color;
            break;
        }
    }
    // If all standard colors are used, cycle through them
    if (existingCustomColorsForType.includes(nextColor) && existingCustomColorsForType.length >= CHART_COLORS_FOR_CUSTOM.length) {
         nextColor = CHART_COLORS_FOR_CUSTOM[customCategories.filter(c => c.type === type).length % CHART_COLORS_FOR_CUSTOM.length];
    }


    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      icon: DefaultCustomCategoryIcon, 
      color: nextColor,
      isCustom: true,
    };
    setCustomCategories(prev => [...prev, newCategory]);
    return true; // Indicate success
  }, [customCategories, allCategories]);

  const deleteCustomCategory = useCallback((id: string) => {
    setCustomCategories(prev => prev.filter(cat => cat.id !== id && cat.isCustom)); // Ensure only custom can be deleted
  }, []);
  
  const getCategoryDetails = useCallback((nameOrId: string, type?: 'income' | 'expense'): Category | undefined => {
    // Try finding by ID first, then by name if type is also provided
    let category = allCategories.find(cat => cat.id === nameOrId && (type ? cat.type === type : true));
    if (!category && type) {
      category = allCategories.find(cat => cat.name === nameOrId && cat.type === type);
    } else if (!category && !type) {
      // If type is not provided, finding by name can be ambiguous, but let's try
      category = allCategories.find(cat => cat.name === nameOrId);
    }
    return category;
  }, [allCategories]);


  return { 
    allCategories, 
    customCategories,
    defaultCategories, // Expose default if needed separately
    addCustomCategory, 
    deleteCustomCategory, 
    isLoading,
    getCategoryDetails
  };
}
