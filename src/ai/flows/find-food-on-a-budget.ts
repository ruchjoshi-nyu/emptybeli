'use server';

/**
 * @fileOverview Finds a food option based on a user's query and available options.
 *
 * - findFoodOnABudget - A function that finds the best food option.
 * - FindFoodOnABudgetInput - The input type for the findFoodOnABudget function.
 * - FindFoodOnABudgetOutput - The return type for the findFoodOnABudget function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { FoodOption } from '@/lib/types';

const FindFoodOnABudgetSchema = z.object({
  userQuery: z.string().describe("The user's spoken request. e.g., 'I only have 5 dollars' or 'I need something heavy'"),
  foodOptions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      heavinessScore: z.number(),
      generosityIndex: z.string(),
    })
  ).describe('The list of available food options to choose from.'),
});
export type FindFoodOnABudgetInput = z.infer<typeof FindFoodOnABudgetSchema>;

const FindFoodOnABudgetOutputSchema = z.object({
  foodId: z.string().describe('The ID of the recommended food item from the provided list.'),
  response: z.string().describe("A short, helpful, and conversational response to the user, explaining the choice. Example: 'I found a 99 cent slice around the corner. It's not heavy, but it'll keep you going.'"),
});
export type FindFoodOnABudgetOutput = z.infer<
  typeof FindFoodOnABudgetOutputSchema
>;

export async function findFoodOnABudget(
  input: FindFoodOnABudgetInput
): Promise<FindFoodOnABudgetOutput> {
  return findFoodOnABudgetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findFoodOnABudgetPrompt',
  input: { schema: FindFoodOnABudgetSchema },
  output: { schema: FindFoodOnABudgetOutputSchema },
  prompt: `You are an expert AI assistant for an app called "Empty Beli", designed to help users find the best value food based on their budget and needs.

Analyze the user's query and the available food options. Your goal is to pick the single best food option that satisfies the user's request.

Consider the user's stated budget, and any preference for "heavy" or "filling" food.

User's Request: "{{userQuery}}"

Available Food Options:
{{#each foodOptions}}
- ID: {{id}}, Name: {{name}}, Price: \${{price}}, Heaviness: {{heavinessScore}}/5, Extras: {{generosityIndex}}
{{/each}}

Based on the query, select the best food option ID and formulate a short, helpful, and slightly witty response to guide the user. Your response should be spoken, so keep it conversational.`,
});

const findFoodOnABudgetFlow = ai.defineFlow(
  {
    name: 'findFoodOnABudgetFlow',
    inputSchema: FindFoodOnABudgetSchema,
    outputSchema: FindFoodOnABudgetOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
