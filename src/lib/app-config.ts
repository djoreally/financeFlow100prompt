import type { Category } from '@/lib/types';
import {
  ShoppingCart,
  Car,
  Home,
  Film, // Changed from PlayCircle for better fit
  DollarSign,
  Briefcase,
  Utensils,
  Zap, // For utilities
  ShieldCheck, // For Insurance
  GraduationCap, // For Education
  Gift, // For Gifts
  HeartPulse, // For Health
  Plane, // For Travel
  ReceiptText, // For Bills
  Shirt, // For Clothing
  PiggyBank, // For Savings
  TrendingUp, // For Investments
  Wrench, // For Maintenance
} from 'lucide-react';

export const defaultCategories: Category[] = [
  // Expenses
  { name: 'Groceries', type: 'expense', icon: ShoppingCart, color: 'hsl(var(--chart-1))' },
  { name: 'Transport', type: 'expense', icon: Car, color: 'hsl(var(--chart-2))' },
  { name: 'Housing', type: 'expense', icon: Home, color: 'hsl(var(--chart-3))' },
  { name: 'Entertainment', type: 'expense', icon: Film, color: 'hsl(var(--chart-4))' },
  { name: 'Food & Dining', type: 'expense', icon: Utensils, color: 'hsl(var(--chart-5))' },
  { name: 'Utilities', type: 'expense', icon: Zap, color: 'hsl(var(--chart-1))' },
  { name: 'Bills', type: 'expense', icon: ReceiptText, color: 'hsl(var(--chart-2))' },
  { name: 'Clothing', type: 'expense', icon: Shirt, color: 'hsl(var(--chart-3))' },
  { name: 'Health & Wellness', type: 'expense', icon: HeartPulse, color: 'hsl(var(--chart-4))' },
  { name: 'Education', type: 'expense', icon: GraduationCap, color: 'hsl(var(--chart-5))' },
  { name: 'Gifts & Donations', type: 'expense', icon: Gift, color: 'hsl(var(--chart-1))' },
  { name: 'Travel', type: 'expense', icon: Plane, color: 'hsl(var(--chart-2))' },
  { name: 'Insurance', type: 'expense', icon: ShieldCheck, color: 'hsl(var(--chart-3))'},
  { name: 'Maintenance', type: 'expense', icon: Wrench, color: 'hsl(var(--chart-4))'},
  { name: 'Savings Contribution', type: 'expense', icon: PiggyBank, color: 'hsl(var(--chart-5))' }, // Expense towards a savings goal
  { name: 'Other Expense', type: 'expense', icon: DollarSign, color: 'hsl(var(--muted))' },

  // Income
  { name: 'Salary', type: 'income', icon: Briefcase, color: 'hsl(var(--chart-1))' },
  { name: 'Freelance', type: 'income', icon: DollarSign, color: 'hsl(var(--chart-2))' },
  { name: 'Investment', type: 'income', icon: TrendingUp, color: 'hsl(var(--chart-3))' },
  { name: 'Gift Received', type: 'income', icon: Gift, color: 'hsl(var(--chart-4))' },
  { name: 'Other Income', type: 'income', icon: DollarSign, color: 'hsl(var(--chart-5))' },
];

export const getCategoryIcon = (categoryName: string): LucideIcon => {
  const category = defaultCategories.find(cat => cat.name === categoryName);
  return category ? category.icon : DollarSign;
};

export const getCategoryColor = (categoryName: string): string => {
  const category = defaultCategories.find(cat => cat.name === categoryName);
  return category?.color || 'hsl(var(--muted))';
};
