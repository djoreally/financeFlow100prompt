
import type { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string; // This will be the category name
  amount: number;
  date: string; // ISO string for date
  description: string;
}

export interface Category {
  id: string; // Unique ID, especially for custom categories. For defaults, can be same as name.
  name: string;
  type: 'income' | 'expense';
  icon: LucideIcon;
  color?: string; 
  isCustom?: boolean; // Flag to identify custom categories
}
