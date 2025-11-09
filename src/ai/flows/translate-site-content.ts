
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
    console.log(`[Abacus AI Simulation] Running Translation for language: ${input.targetLanguage}`);

    // If the target is Spanish, just return the original content as it's already in Spanish.
    if (input.targetLanguage === 'es') {
      return input.siteContent;
    }
    
    // The AI call is commented out to prevent the 404 error.
    // const abacusModel = getAbacusModelForTask('onboarding');
    // const { output } = await prompt(input, { model: abacusModel });
    // return output || '{}';

    // Mock response: We just add a suffix to show it was "translated".
    // A real implementation would require a full translation.
    try {
      const parsedContent = JSON.parse(input.siteContent);
      const translatedContent = { ...parsedContent };
      // This is a very basic mock translation, just appending the lang code.
      translatedContent.brand.name = `${translatedContent.brand.name} (${input.targetLanguage})`;
      translatedContent.brand.tagline = `${translatedContent.brand.tagline} (${input.targetLanguage})`;
      return JSON.stringify(translatedContent);
    } catch {
      return input.siteContent; // Return original if parsing fails
    }
  }
);
