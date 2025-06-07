
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";
import type { Transaction } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function escapeCsvCell(cell: any): string {
  if (cell === null || cell === undefined) {
    return '';
  }
  const cellString = String(cell);
  if (cellString.includes('"') || cellString.includes(',') || cellString.includes('\n')) {
    return `"${cellString.replace(/"/g, '""')}"`;
  }
  return cellString;
}

export function exportTransactionsToCsv(filename: string, transactions: Transaction[]): void {
  if (!transactions || transactions.length === 0) {
    console.warn("No transactions to export.");
    // Optionally, show a toast message to the user
    return;
  }

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  
  const csvRows = transactions.map(t => {
    return [
      format(new Date(t.date), 'yyyy-MM-dd'),
      t.description,
      t.category,
      t.type,
      t.amount.toFixed(2)
    ].map(escapeCsvCell).join(',');
  });

  const csvString = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    console.error("Browser does not support automatic downloads.");
    // Optionally, provide feedback to the user
  }
}
