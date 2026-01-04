
'use server';

/**
 * @fileOverview Translates site content to a specified language using Gemini 1.5 Pro.
 *
 * - translateSiteContent - A function that translates the site content.
 * - TranslateSiteContentInput - The input type for the translateSiteContent function.
 * - TranslateSiteContentOutput - The return type for the translateSiteContent function.
 */

import { z } from 'zod';
import { ai, googleAI } from '@/ai/genkit';

const TranslateSiteContentInputSchema = z.object({
  siteContent: z.string().describe('The JSON string representing the site content to translate. This content is originally in Spanish.'),
  targetLanguage: z.string().describe('The target language code (e.g., es for Spanish, fr for French).'),
});
export type TranslateSiteContentInput = z.infer<typeof TranslateSiteContentInputSchema>;

// The output is still a string, but it's a JSON string.
const TranslateSiteContentOutputSchema = z.string().describe('The translated JSON string of the site content.');
export type TranslateSiteContentOutput = z.infer<typeof TranslateSiteContentOutputSchema>;

const translateSiteContentPrompt = ai.definePrompt(
  {
    name: 'translateSiteContentPrompt',
    input: { schema: TranslateSiteContentInputSchema },
    output: { schema: z.any() }, // Let Gemini return a JSON object directly
    prompt: `You are a professional translator specializing in marketing content. Translate the provided Spanish JSON content into the target language, preserving the JSON structure and keys perfectly.

**IMPORTANT**: Respond only with the translated JSON object. Do not add any extra explanations, comments, or markdown formatting. The JSON structure must remain identical to the input.

The target language is: **{{{targetLanguage}}}**.

Here is the website content to translate from Spanish:
{{{siteContent}}}
`,
  },
);

export async function translateSiteContent(input: TranslateSiteContentInput): Promise<TranslateSiteContentOutput> {
    // If the target is Spanish, just return the original content as it's already in Spanish.
    if (input.targetLanguage === 'es') {
      return input.siteContent;
    }
    
    console.log(`🤖 Calling Gemini 1.5 Pro for Translation to ${input.targetLanguage}`);

    try {
        const { output } = await translateSiteContentPrompt(input, { 
            model: googleAI.model('gemini-1.5-pro') 
        });

        if (!output) {
          throw new Error('AI returned no output.');
        }
        
        // Genkit with Zod output schema will parse the JSON. We need to stringify it back.
        return JSON.stringify(output);

    } catch (error) {
        console.error("==================== AI RESPONSE ERROR (translateSiteContent) ====================");
        console.error("Failed to get a valid response from Gemini. Error:", error);
        console.error("================================ END OF AI RESPONSE ERROR ================================");
        // Fallback to original content on error
        return input.siteContent; 
    }
}
