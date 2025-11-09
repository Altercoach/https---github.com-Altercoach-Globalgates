
'use server';

/**
 * @fileOverview Recommends a marketing plan based on the user's business description, using Abacus AI.
 *
 * - recommendPlan - A function that recommends a plan.
 * - RecommendPlanInput - The input type for the function.
 * - RecommendPlanOutput - The return type for the function.
 */

import { ai, getAbacusModelForTask } from '@/ai/genkit';
import { z } from 'genkit';

const RecommendPlanInputSchema = z.object({
  businessDescription: z.string().describe('The description of the user\'s business.'),
  products: z.string().describe('A JSON string representing the list of available products.'),
});
export type RecommendPlanInput = z.infer<typeof RecommendPlanInputSchema>;

const RecommendPlanOutputSchema = z.object({
  productIds: z.array(z.string()).describe('An array of IDs of the recommended products. If there is not enough information, this array may be empty.'),
  reasoning: z.string().describe('An explanation of why these products were recommended, or a question to get more details if the information is insufficient.'),
});
export type RecommendPlanOutput = z.infer<typeof RecommendPlanOutputSchema>;

export async function recommendPlan(input: RecommendPlanInput): Promise<RecommendPlanOutput> {
  return recommendPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPlanPrompt',
  input: { schema: RecommendPlanInputSchema },
  output: { schema: RecommendPlanOutputSchema },
  prompt: `You are an expert business consultant. Your task is to analyze a business description and recommend the best plan(s) from the available products.

  **Business Description:**
  {{{businessDescription}}}

  **Available Products (JSON):**
  {{{products}}}

  **Instructions:**
  1.  Analyze the business description to understand its needs.
  2.  Review the available products.
  3.  **If the description is clear:** Select one or more product IDs that are the best fit. Provide a clear reasoning in Spanish. Do not recommend 'info' type products.
  4.  **If the description is vague:** Do not select any products (leave 'productIds' empty). Instead, ask a specific, friendly question in Spanish in the 'reasoning' field to get the necessary information.
  5.  Return your response in the requested JSON format.`,
});

const recommendPlanFlow = ai.defineFlow(
  {
    name: 'recommendPlanFlow',
    inputSchema: RecommendPlanInputSchema,
    outputSchema: RecommendPlanOutputSchema,
  },
  async (input) => {
    console.log(`[Abacus AI Simulation] Running Plan Recommendation.`);

    // const abacusModel = getAbacusModelForTask('chat');
    // const { output } = await prompt(input, { model: abacusModel });
    // if (!output) {
    //   throw new Error('Failed to recommend a plan.');
    // }

    // Mock response based on a sample input
    const mockOutput: RecommendPlanOutput = {
      productIds: ['prod_sm_1'],
      reasoning: "Basado en tu descripción, para empezar a construir tu presencia online, te recomiendo el plan 'Impulso Esencial (1 Red)'. Es ideal para arrancar y generar visibilidad."
    };
    
    return mockOutput;
  }
);
