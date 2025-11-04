
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
  input: {schema: TranslateSiteContentInputSchema},
  output: {schema: z.string().nullable()},
  prompt: `You are a professional translator specializing in website and marketing content. You will be provided with website content in JSON format, which is originally in Spanish. Your task is to translate it into the target language, preserving the JSON structure and keys perfectly. Pay special attention to marketing and business terminology to ensure it is accurate and culturally relevant in the translated language.

The target language is: **{{{targetLanguage}}}**.

Here is the website content to translate from Spanish:
{{{siteContent}}}

**IMPORTANT**: Respond only with the translated JSON object as a string. Do not add any extra explanations, comments, or markdown formatting. The JSON structure must remain identical to the input.`,
  safetySettings: [
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
    // If the target is Spanish, just return the original content as it's already in Spanish.
    if (input.targetLanguage === 'es') {
      return input.siteContent;
    }
    
    const {output} = await prompt(input, { model: 'googleai/gemini-pro' });
    return output || '{}';
  }
);
