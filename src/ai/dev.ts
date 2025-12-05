import { config } from 'dotenv';
config();

import '@/ai/flows/generate-mock-food-data.ts';
import '@/ai/flows/evaluate-food-option-value.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/find-food-on-a-budget.ts';
