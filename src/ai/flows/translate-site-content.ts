'use server';

/**
 * @fileOverview Translates site content to a specified language using AI.
 *
 * - translateSiteContent - A function that translates the site content.
 * - TranslateSiteContentInput - The input type for the translateSiteContent function.
 * - TranslateSiteContentOutput - The return type for the translateSiteContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateSiteContentInputSchema = z.object({
  siteContent: z.string().describe('The JSON string representing the site content to translate.'),
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
  input: {schema: TranslateSiteContentInputSchema},
  output: {schema: z.string().nullable()},
  prompt: `You are a professional translator specializing in website content.  You will be provided with website content in JSON format and must translate it into the target language, preserving the JSON structure. Pay special attention to industry-specific verbiage and ensure it remains relevant and accurate in the translated content. The target language is: {{{targetLanguage}}}. Here is the website content to translate:

{{{siteContent}}}`, safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_ONLY_HIGH',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_LOW_AND_ABOVE',
    },
  ],
});

const translateSiteContentFlow = ai.defineFlow(
  {
    name: 'translateSiteContentFlow',
    inputSchema: TranslateSiteContentInputSchema,
    outputSchema: TranslateSiteContentOutputSchema.nullable(),
  },
  async input => {
    const {output} = await prompt(input);
    return output || '{}';
  }
);
