'use server';

/**
 * @fileOverview Evaluates the value of a food option based on the user's remaining budget.
 *
 * - evaluateFoodOptionValue - A function that evaluates the food option value.
 * - EvaluateFoodOptionValueInput - The input type for the evaluateFoodOptionValue function.
 * - EvaluateFoodOptionValueOutput - The return type for the evaluateFoodOptionValue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateFoodOptionValueInputSchema = z.object({
  foodName: z.string().describe('The name of the food option.'),
  foodPrice: z.number().describe('The price of the food option in USD.'),
  remainingBudget: z.number().describe('The user\'s remaining budget in USD.'),
});
export type EvaluateFoodOptionValueInput = z.infer<
  typeof EvaluateFoodOptionValueInputSchema
>;

const EvaluateFoodOptionValueOutputSchema = z.object({
  valueJudgment: z
    .string()
    .describe(
      'A short, subtly phrased judgment of the food option\'s value relative to the remaining budget. Examples: \'That\'s a steal!\', \'A reasonable choice.\', \'Might break the bank.\''
    ),
});
export type EvaluateFoodOptionValueOutput = z.infer<
  typeof EvaluateFoodOptionValueOutputSchema
>;

export async function evaluateFoodOptionValue(
  input: EvaluateFoodOptionValueInput
): Promise<EvaluateFoodOptionValueOutput> {
  return evaluateFoodOptionValueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateFoodOptionValuePrompt',
  input: {schema: EvaluateFoodOptionValueInputSchema},
  output: {schema: EvaluateFoodOptionValueOutputSchema},
  prompt: `You are a helpful assistant that provides subtle value judgements for food options based on the user's remaining budget.  Your response should be very short and use a conversational tone.

Consider the following:
- Food: {{foodName}}
- Price: \${{foodPrice}}
- Remaining Budget: \${{remainingBudget}}

Provide a value judgement:`,
});

const evaluateFoodOptionValueFlow = ai.defineFlow(
  {
    name: 'evaluateFoodOptionValueFlow',
    inputSchema: EvaluateFoodOptionValueInputSchema,
    outputSchema: EvaluateFoodOptionValueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
