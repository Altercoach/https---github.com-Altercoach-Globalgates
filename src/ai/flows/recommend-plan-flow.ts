
'use server';

/**
 * @fileOverview Recommends a marketing plan based on the user's business description, using Replicate.
 *
 * - recommendPlan - A function that recommends a plan.
 * - RecommendPlanInput - The input type for the function.
 * - RecommendPlanOutput - The return type for the function.
 */

import { z } from 'zod';
import { runReplicateText } from '@/ai/genkit';

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
  const systemPrompt = `You are an expert business consultant. Your task is to analyze a business description and recommend the best plan(s) from the available products.

**Instructions:**
1.  Analyze the business description to understand its needs.
2.  Review the available products provided in JSON format.
3.  **If the description is clear:** Select one or more product IDs that are the best fit. Provide a clear reasoning in Spanish. Do not recommend 'info' type products.
4.  **If the description is vague:** Do not select any products (leave 'productIds' empty). Instead, ask a specific, friendly question in Spanish in the 'reasoning' field to get the necessary information.
5.  **Output Format:** Your entire response MUST be a valid JSON object matching the requested output schema. Do not add any text before or after the JSON.
`;

    const userPrompt = `**Business Description:**
${input.businessDescription}

**Available Products (JSON):**
${input.products}

**IMPORTANT**: Your entire response MUST be a valid JSON object. Do not add any text, explanations, or markdown formatting before or after the JSON object.`;

    const constructedPrompt = `<s>[INST] <<SYS>>
${systemPrompt}
<</SYS>>

${userPrompt} [/INST]`;

    let responseText = '';
    try {
        responseText = await runReplicateText(constructedPrompt);

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON object found in the AI response.');
        }
        const jsonString = jsonMatch[0];
        const parsedOutput = JSON.parse(jsonString);
        
        const validatedOutput = RecommendPlanOutputSchema.parse(parsedOutput);
        
        return validatedOutput;

    } catch (error) {
        console.error("==================== AI RESPONSE ERROR (recommendPlan) ====================");
        console.error("Failed to parse or validate AI output. Error:", error);
        console.error("--------------------------------- Raw AI Response ---------------------------------");
        console.error(responseText);
        console.error("================================ END OF AI RESPONSE ERROR ================================");
        throw new Error('The AI returned an invalid response format.');
    }
}
