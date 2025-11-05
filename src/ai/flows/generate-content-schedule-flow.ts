
'use server';

/**
 * @fileOverview Generates a monthly content schedule for a client using AI.
 *
 * - generateContentSchedule - A function that creates the content schedule.
 * - GenerateContentScheduleInput - The input type for the function.
 * - GenerateContentScheduleOutput - The return type for the function.
 */

import { ai, getModelForTask } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateContentScheduleInputSchema = z.object({
  clientBusiness: z.string().describe("A description of the client's business, their purchased plan, and any specific instructions from the marketing team."),
});
export type GenerateContentScheduleInput = z.infer<typeof GenerateContentScheduleInputSchema>;

const ContentPostSchema = z.object({
    postNumber: z.string().describe("The post number or range, e.g., '1', '2-3'."),
    format: z.string().describe("The format of the post (e.g., 'Post fijo', 'Historia', 'Carrusel', 'Video')."),
    topic: z.string().describe("The main topic or theme (e.g., 'Venta', 'Branding', 'Dato curioso', 'Recomendación')."),
    copyIn: z.string().describe("The internal copy or creative brief. Includes Title, Subtitle, and ideas for slides or content."),
    copyOut: z.string().describe("The final, public-facing copy for the post, including text and relevant hashtags."),
});
export type ContentPost = z.infer<typeof ContentPostSchema>;

const GenerateContentScheduleOutputSchema = z.object({
  posts: z.array(ContentPostSchema).describe("An array of 10-12 content post objects for the monthly schedule."),
});
export type GenerateContentScheduleOutput = z.infer<typeof GenerateContentScheduleOutputSchema>;


export async function generateContentSchedule(input: GenerateContentScheduleInput): Promise<GenerateContentScheduleOutput> {
  return generateContentScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentSchedulePrompt',
  input: { schema: GenerateContentScheduleInputSchema },
  output: { schema: GenerateContentScheduleOutputSchema },
  prompt: `You are a world-class social media content strategist. Your task is to create a monthly content schedule (a "parrilla de contenido") for an Instagram account based on the client's profile and specific instructions from the marketing team.

  **Client Information & Team Instructions:**
  {{{clientBusiness}}}

  **Your Task:**
  Based on the provided information, create a diverse and engaging content schedule. For each post, you must define the following:
  1.  **postNumber**: The sequential number of the post (e.g., "1", "2", "3-4").
  2.  **format**: The type of post. Choose from: 'Post fijo', 'Historia', 'Carrusel', 'Video'.
  3.  **topic**: The strategic theme. Choose from: 'Venta' (Sales), 'Branding', 'Dato curioso' (Fun Fact), 'Recomendación' (Recommendation), 'Interacción' (Interaction).
  4.  **copyIn**: The internal creative brief. This should include a 'Título', a 'Subtítulo', and if it's a carousel or video, ideas for 'Slide 1', 'Slide 2', etc. This is the core idea for the creative team.
  5.  **copyOut**: The final, ready-to-publish text for the post's caption. This should be engaging, well-written, and MUST include 3-4 relevant, popular hashtags.

  **Instructions & Tone:**
  - Analyze the client's business and the team's instructions to tailor the content perfectly.
  - Create a balanced mix of formats and topics. Don't just make sales posts. Include branding, educational, and interactive content to build a community.
  - The 'copyIn' should be a clear instruction for a designer or video editor.
  - The 'copyOut' should be creative, persuasive, and reflect the brand's voice.
  - Ensure the hashtags are specific to the industry and the post's content.
  - The entire output must be in Spanish.
  - The final output MUST be a JSON object containing a single key "posts", which is an array of the post objects you generate.`,
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

const generateContentScheduleFlow = ai.defineFlow(
  {
    name: 'generateContentScheduleFlow',
    inputSchema: GenerateContentScheduleInputSchema,
    outputSchema: GenerateContentScheduleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input, { model: getModelForTask('socialMedia') });
    if (!output) {
      throw new Error('The AI failed to generate a content schedule.');
    }
    return output;
  }
);
