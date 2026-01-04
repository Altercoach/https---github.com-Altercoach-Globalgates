
'use server';

/**
 * @fileOverview Recommends a marketing plan based on the user's business description, using Abacus AI.
 *
 * - recommendPlan - A function that recommends a plan.
 * - RecommendPlanInput - The input type for the function.
 * - RecommendPlanOutput - The return type for the function.
 */

import { ai, runReplicateText } from '@/ai/genkit';
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


const recommendPlanFlow = ai.defineFlow(
  {
    name: 'recommendPlanFlow',
    inputSchema: RecommendPlanInputSchema,
    outputSchema: RecommendPlanOutputSchema,
  },
  async (input) => {
    const outputSchemaAsJson = `{
      "productIds": ["prod_social_2", "prod_launch_1"],
      "reasoning": "Based on your goal to increase sales and launch a new product, these plans offer the best combination of brand presence and sales funnels."
    }`;

    const constructedPrompt = `<s>[INST] <<SYS>>
You are an expert business consultant. Your task is to analyze a business description and recommend the best plan(s) from the available products.

**Instructions:**
1.  Analyze the business description to understand its needs.
2.  Review the available products provided in JSON format.
3.  **If the description is clear:** Select one or more product IDs that are the best fit. Provide a clear reasoning in Spanish. Do not recommend 'info' type products.
4.  **If the description is vague:** Do not select any products (leave 'productIds' empty). Instead, ask a specific, friendly question in Spanish in the 'reasoning' field to get the necessary information.
5.  **Output Format:** Your entire response MUST be a valid JSON object matching the structure provided below. Do not add any text before or after the JSON.

**JSON Output Structure:**
${outputSchemaAsJson}
<</SYS>>

**Business Description:**
${input.businessDescription}

**Available Products (JSON):**
${input.products}
[/INST]`;

    const responseText = await runReplicateText(constructedPrompt, 'chat');

    try {
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        
        if (jsonStart === -1 || jsonEnd === -1 || jsonStart > jsonEnd) {
            throw new Error("No valid JSON object found in the AI response for plan recommendation.");
        }

        const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
        const parsedOutput = JSON.parse(jsonString);

        return RecommendPlanOutputSchema.parse(parsedOutput);
      } catch (error) {
        console.error("Failed to parse or validate AI output for plan recommendation:", error, "Raw response:", responseText);
        throw new Error('The AI returned an invalid response format for plan recommendation.');
      }
  }
);
