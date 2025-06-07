'use server';

/**
 * @fileOverview Generates personalized budget insights and recommendations based on user's transaction history.
 *
 * - getBudgetInsights - A function that generates budget insights.
 * - BudgetInsightsInput - The input type for the getBudgetInsights function.
 * - BudgetInsightsOutput - The return type for the getBudgetInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetInsightsInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe(
      'A string containing the user transaction history as a JSON array. Each transaction should include category, date, and amount.'
    ),
});
export type BudgetInsightsInput = z.infer<typeof BudgetInsightsInputSchema>;

const BudgetInsightsOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'Personalized insights and recommendations on how to save money based on the transaction history.'
    ),
});
export type BudgetInsightsOutput = z.infer<typeof BudgetInsightsOutputSchema>;

export async function getBudgetInsights(input: BudgetInsightsInput): Promise<BudgetInsightsOutput> {
  return budgetInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetInsightsPrompt',
  input: {schema: BudgetInsightsInputSchema},
  output: {schema: BudgetInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's transaction history and provide personalized insights and recommendations on how to save money.

Transaction History:
{{{transactionHistory}}}

Provide specific and actionable advice.`,
});

const budgetInsightsFlow = ai.defineFlow(
  {
    name: 'budgetInsightsFlow',
    inputSchema: BudgetInsightsInputSchema,
    outputSchema: BudgetInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
