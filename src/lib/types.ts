import type { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string; // ISO string for date
  description: string;
}

export interface Category {
  name: string;
  type: 'income' | 'expense';
  icon: LucideIcon;
  color?: string; // Optional: for specific category coloring in charts/UI
}
