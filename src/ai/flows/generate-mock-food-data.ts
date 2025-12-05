'use server';

/**
 * @fileOverview Generates mock food data for the Empty Beli app.
 *
 * - generateMockFoodData - A function that generates mock food data.
 * - MockFoodDataInput - The input type for the generateMockFoodData function.
 * - MockFoodDataOutput - The return type for the generateMockFoodData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MockFoodDataInputSchema = z.object({
  count: z
    .number()
    .min(1)
    .max(10)
    .default(5)
    .describe('The number of mock food items to generate.'),
});
export type MockFoodDataInput = z.infer<typeof MockFoodDataInputSchema>;

const MockFoodDataOutputSchema = z.array(
  z.object({
    name: z.string().describe('The name of the food item.'),
    price: z.number().describe('The price of the food item in USD.'),
    heavinessScore: z
      .number()
      .min(1)
      .max(5)
      .describe('A score from 1 to 5 indicating how filling the food is.'),
    generosityIndex: z.string().describe('A description of any extras included with the food item, e.g., \'Free Soda included\''),
  })
);
export type MockFoodDataOutput = z.infer<typeof MockFoodDataOutputSchema>;

export async function generateMockFoodData(input: MockFoodDataInput): Promise<MockFoodDataOutput> {
  return generateMockFoodDataFlow(input);
}

const generateMockFoodDataPrompt = ai.definePrompt({
  name: 'generateMockFoodDataPrompt',
  input: {schema: MockFoodDataInputSchema},
  output: {schema: MockFoodDataOutputSchema},
  prompt: `You are a helpful assistant that generates mock food data for a mobile app called \"Empty Beli\", which helps users find affordable food options in NYC.

  Generate {{count}} NYC-style cheap eats, including the following details:

  - name: The name of the food item.
  - price: The price of the food item in USD.
  - heavinessScore: A score from 1 to 5 indicating how filling the food is.
  - generosityIndex: A description of any extras included with the food item (e.g., \"Free Soda included\").

  Ensure that the generated data is diverse and realistic for NYC cheap eats.  Make the prices appropriate for the food, and the heaviness score consistent with the type of food.  The Generosity Index should add some flair and local color to the result.

  Format the output as a JSON array.
  `,
});

const generateMockFoodDataFlow = ai.defineFlow(
  {
    name: 'generateMockFoodDataFlow',
    inputSchema: MockFoodDataInputSchema,
    outputSchema: MockFoodDataOutputSchema,
  },
  async input => {
    const {output} = await generateMockFoodDataPrompt(input);
    return output!;
  }
);
