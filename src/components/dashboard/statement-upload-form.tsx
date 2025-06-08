
"use client";

import React, { useState } from 'react';
import { FileUp, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTransactions } from '@/hooks/use-transactions';
import type { Transaction } from '@/lib/types';
import { Label } from '../ui/label';

export function StatementUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addTransaction } = useTransactions();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'text/csv') {
        setSelectedFile(file);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a CSV file.',
        });
        setSelectedFile(null);
        event.target.value = ''; // Reset file input
      }
    }
  };

  const parseCSV = (csvText: string): Omit<Transaction, 'id'>[] => {
    const transactions: Omit<Transaction, 'id'>[] = [];
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');

    if (lines.length < 2) {
      throw new Error('CSV file must contain a header row and at least one data row.');
    }

    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    const dateIndex = headers.indexOf('date');
    const descriptionIndex = headers.indexOf('description');
    const amountIndex = headers.indexOf('amount');

    if (dateIndex === -1 || descriptionIndex === -1 || amountIndex === -1) {
      throw new Error('CSV headers must include "Date", "Description", and "Amount".');
    }

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length < Math.max(dateIndex, descriptionIndex, amountIndex) + 1) {
        console.warn(`Skipping malformed row ${i + 1}: ${lines[i]}`);
        continue;
      }

      const dateStr = values[dateIndex]?.trim();
      const description = values[descriptionIndex]?.trim();
      const amountStr = values[amountIndex]?.trim();
      
      if (!dateStr || !description || amountStr === undefined || amountStr === '') {
        console.warn(`Skipping row ${i + 1} due to missing essential data: ${lines[i]}`);
        continue;
      }

      const date = new Date(dateStr);
      const amount = parseFloat(amountStr);

      if (isNaN(date.getTime())) {
        console.warn(`Skipping row ${i + 1} due to invalid date: ${dateStr}`);
        continue;
      }
      if (isNaN(amount)) {
        console.warn(`Skipping row ${i + 1} due to invalid amount: ${amountStr}`);
        continue;
      }

      transactions.push({
        date: date.toISOString(),
        description,
        amount: Math.abs(amount),
        type: amount < 0 ? 'expense' : 'income',
        category: 'Statement Import', // Default category
      });
    }
    return transactions;
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a CSV file to upload.',
      });
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const csvText = e.target?.result as string;
        if (!csvText) {
            throw new Error("Could not read file content.");
        }
        const parsedTransactions = parseCSV(csvText);

        if (parsedTransactions.length === 0) {
          toast({
            title: 'No Transactions Found',
            description: 'The CSV file was processed, but no valid transactions were found or all rows had issues.',
          });
        } else {
          parsedTransactions.forEach(addTransaction); // This will trigger budget alerts per transaction
          toast({
            title: 'Upload Successful',
            description: `${parsedTransactions.length} transaction(s) imported successfully.`,
          });
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: error.message || 'An error occurred while parsing the CSV file.',
        });
      } finally {
        setIsLoading(false);
        setSelectedFile(null);
        // Reset the file input visually - a bit of a hack for native inputs
        const fileInput = document.getElementById('statement-upload-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
      }
    };

    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: 'Could not read the selected file.',
      });
      setIsLoading(false);
    };

    reader.readAsText(selectedFile);
  };

  return (
    <Card className="shadow-lg" data-testid="statement-upload-form-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-6 w-6 text-primary" />
          Upload Bank Statement
        </CardTitle>
        <CardDescription>
          Upload a CSV file with your transactions. Expected columns: <strong>Date, Description, Amount</strong>.
          <ul className="list-disc list-inside text-xs mt-1">
            <li>Date: e.g., YYYY-MM-DD or MM/DD/YYYY</li>
            <li>Amount: Positive for income, negative for expenses.</li>
            <li>Imported transactions will be categorized as "Statement Import".</li>
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="statement-upload-input" className="sr-only">Bank statement CSV</Label>
          <Input
            id="statement-upload-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            disabled={isLoading}
          />
        </div>
        {selectedFile && (
          <p className="text-sm text-muted-foreground">
            Selected file: {selectedFile.name}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!selectedFile || isLoading} className="w-full">
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" /> Upload & Process
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
