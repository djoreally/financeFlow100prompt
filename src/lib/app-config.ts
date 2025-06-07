
import type { Category } from '@/lib/types';
import {
  ShoppingCart,
  Car,
  Home,
  Film,
  DollarSign,
  Briefcase,
  Utensils,
  Zap,
  ShieldCheck,
  GraduationCap,
  Gift,
  HeartPulse,
  Plane,
  ReceiptText,
  Shirt,
  PiggyBank,
  TrendingUp,
  Wrench,
  Shapes, // Default for custom categories
  type LucideIcon,
} from 'lucide-react';

export const defaultCategories: Category[] = [
  // Expenses
  { id: 'Groceries', name: 'Groceries', type: 'expense', icon: ShoppingCart, color: 'hsl(var(--chart-1))' },
  { id: 'Transport', name: 'Transport', type: 'expense', icon: Car, color: 'hsl(var(--chart-2))' },
  { id: 'Housing', name: 'Housing', type: 'expense', icon: Home, color: 'hsl(var(--chart-3))' },
  { id: 'Entertainment', name: 'Entertainment', type: 'expense', icon: Film, color: 'hsl(var(--chart-4))' },
  { id: 'Food & Dining', name: 'Food & Dining', type: 'expense', icon: Utensils, color: 'hsl(var(--chart-5))' },
  { id: 'Utilities', name: 'Utilities', type: 'expense', icon: Zap, color: 'hsl(var(--chart-1))' },
  { id: 'Bills', name: 'Bills', type: 'expense', icon: ReceiptText, color: 'hsl(var(--chart-2))' },
  { id: 'Clothing', name: 'Clothing', type: 'expense', icon: Shirt, color: 'hsl(var(--chart-3))' },
  { id: 'Health & Wellness', name: 'Health & Wellness', type: 'expense', icon: HeartPulse, color: 'hsl(var(--chart-4))' },
  { id: 'Education', name: 'Education', type: 'expense', icon: GraduationCap, color: 'hsl(var(--chart-5))' },
  { id: 'Gifts & Donations', name: 'Gifts & Donations', type: 'expense', icon: Gift, color: 'hsl(var(--chart-1))' },
  { id: 'Travel', name: 'Travel', type: 'expense', icon: Plane, color: 'hsl(var(--chart-2))' },
  { id: 'Insurance', name: 'Insurance', type: 'expense', icon: ShieldCheck, color: 'hsl(var(--chart-3))'},
  { id: 'Maintenance', name: 'Maintenance', type: 'expense', icon: Wrench, color: 'hsl(var(--chart-4))'},
  { id: 'Savings Contribution', name: 'Savings Contribution', type: 'expense', icon: PiggyBank, color: 'hsl(var(--chart-5))' },
  { id: 'Other Expense', name: 'Other Expense', type: 'expense', icon: DollarSign, color: 'hsl(var(--muted))' },

  // Income
  { id: 'Salary', name: 'Salary', type: 'income', icon: Briefcase, color: 'hsl(var(--chart-1))' },
  { id: 'Freelance', name: 'Freelance', type: 'income', icon: DollarSign, color: 'hsl(var(--chart-2))' },
  { id: 'Investment', name: 'Investment', type: 'income', icon: TrendingUp, color: 'hsl(var(--chart-3))' },
  { id: 'Gift Received', name: 'Gift Received', type: 'income', icon: Gift, color: 'hsl(var(--chart-4))' },
  { id: 'Other Income', name: 'Other Income', type: 'income', icon: DollarSign, color: 'hsl(var(--chart-5))' },
];

// These functions can still be used as fallbacks or for default categories if needed directly.
// However, components should prefer using category objects from useCategories hook where possible.

export const getCategoryIcon = (categoryName: string, allCategories: Category[] = defaultCategories): LucideIcon => {
  const category = allCategories.find(cat => cat.name === categoryName);
  return category ? category.icon : Shapes; // Default to Shapes if not found
};

export const getCategoryColor = (categoryName: string, allCategories: Category[] = defaultCategories): string => {
  const category = allCategories.find(cat => cat.name === categoryName);
  return category?.color || 'hsl(var(--muted))';
};

export const getDefaultCategoryIcon = (categoryName: string): LucideIcon => {
  const category = defaultCategories.find(cat => cat.name === categoryName);
  return category ? category.icon : Shapes;
}

export const getDefaultCategoryColor = (categoryName: string): string => {
  const category = defaultCategories.find(cat => cat.name === categoryName);
  return category?.color || 'hsl(var(--muted))';
}

export { Shapes as DefaultCustomCategoryIcon }; // Export for use in useCategories
