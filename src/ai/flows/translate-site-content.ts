
'use server';

/**
 * @fileOverview Translates site content to a specified language using Abacus AI.
 *
 * - translateSiteContent - A function that translates the site content.
 * - TranslateSiteContentInput - The input type for the translateSiteContent function.
 * - TranslateSiteContentOutput - The return type for the translateSiteContent function.
 */

import { ai, getAbacusModelForTask } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateSiteContentInputSchema = z.object({
  siteContent: z.string().describe('The JSON string representing the site content to translate. This content is originally in Spanish.'),
  targetLanguage: z.string().describe('The target language code (e.g., es for Spanish, fr for French).'),
});
export type TranslateSiteContentInput = z.infer<typeof TranslateSiteContentInputSchema>;

const TranslateSiteContentOutputSchema = z.string().describe('The translated JSON string of the site content.');
export type TranslateSiteContentOutput = z.infer<typeof TranslateSiteContentOutputSchema>;

export async function translateSiteContent(input: TranslateSiteContentInput): Promise<TranslateSiteContentOutput> {
  return translateSiteContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateSiteContentPrompt',
  input: { schema: TranslateSiteContentInputSchema },
  output: { schema: z.string().nullable() },
  prompt: `You are a professional translator specializing in marketing content. Translate the provided Spanish JSON content into the target language, preserving the JSON structure and keys perfectly.

The target language is: **{{{targetLanguage}}}**.

Here is the website content to translate from Spanish:
{{{siteContent}}}

**IMPORTANT**: Respond only with the translated JSON object as a string. Do not add any extra explanations, comments, or markdown formatting. The JSON structure must remain identical to the input.`,
});

const translateSiteContentFlow = ai.defineFlow(
  {
    name: 'translateSiteContentFlow',
    inputSchema: TranslateSiteContentInputSchema,
    outputSchema: TranslateSiteContentOutputSchema.nullable(),
  },
  async input => {
    // If the target is Spanish, just return the original content as it's already in Spanish.
    if (input.targetLanguage === 'es') {
      return input.siteContent;
    }
    
    const abacusModel = getAbacusModelForTask('onboarding');
    const { output } = await prompt(input, { model: abacusModel });
    return output || '{}';
  }
);
