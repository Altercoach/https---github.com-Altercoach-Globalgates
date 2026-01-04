
'use server';

/**
 * @fileOverview Translates site content to a specified language using Replicate.
 *
 * - translateSiteContent - A function that translates the site content.
 * - TranslateSiteContentInput - The input type for the translateSiteContent function.
 * - TranslateSiteContentOutput - The return type for the translateSiteContent function.
 */

import { z } from 'zod';
import { runReplicateText } from '@/ai/genkit';


const TranslateSiteContentInputSchema = z.object({
  siteContent: z.string().describe('The JSON string representing the site content to translate. This content is originally in Spanish.'),
  targetLanguage: z.string().describe('The target language code (e.g., es for Spanish, fr for French).'),
});
export type TranslateSiteContentInput = z.infer<typeof TranslateSiteContentInputSchema>;

const TranslateSiteContentOutputSchema = z.string().describe('The translated JSON string of the site content.');
export type TranslateSiteContentOutput = z.infer<typeof TranslateSiteContentOutputSchema>;

export async function translateSiteContent(input: TranslateSiteContentInput): Promise<TranslateSiteContentOutput> {
    // If the target is Spanish, just return the original content as it's already in Spanish.
    if (input.targetLanguage === 'es') {
      return input.siteContent;
    }

    const systemPrompt = `You are a professional translator specializing in marketing content. Translate the provided Spanish JSON content into the target language, preserving the JSON structure and keys perfectly.

**IMPORTANT**: Respond only with the translated JSON object as a string. Do not add any extra explanations, comments, or markdown formatting. The JSON structure must remain identical to the input.

The target language is: **${input.targetLanguage}**.
`;

    const userPrompt = `Here is the website content to translate from Spanish:
${input.siteContent}

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
        
        // Just validate it's valid JSON before returning
        JSON.parse(jsonString); 
        
        return jsonString;

    } catch (error) {
        console.error("==================== AI RESPONSE ERROR (translateSiteContent) ====================");
        console.error("Failed to parse or validate AI output. Error:", error);
        console.error("--------------------------------- Raw AI Response ---------------------------------");
        console.error(responseText);
        console.error("================================ END OF AI RESPONSE ERROR ================================");
        // Fallback to original content on error
        return input.siteContent; 
    }
}
