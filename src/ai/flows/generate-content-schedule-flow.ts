
'use server';

/**
 * @fileOverview Generates a monthly content schedule for a client using Replicate.
 *
 * - generateContentSchedule - A function that creates the content schedule.
 * - GenerateContentScheduleInput - The input type for the function.
 * - GenerateContentScheduleOutput - The return type for the function.
 */

import { z } from 'zod';
import { runReplicateText } from '@/ai/genkit';

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
  const prompt = `You are a world-class social media content strategist. Create a monthly content schedule (a "parrilla de contenido") for an Instagram account based on the client's profile and team instructions. The entire output must be in Spanish.

**Your Task:**
Create a diverse content schedule of 10-12 posts. For each post, define:
1.  **postNumber**: Sequential number.
2.  **format**: Choose from: 'Post fijo', 'Historia', 'Carrusel', 'Video'.
3.  **topic**: Strategic theme (e.g., 'Venta', 'Branding', 'Interacción').
4.  **copyIn**: Internal creative brief (Title, Subtitle, ideas).
5.  **copyOut**: Final, public-facing caption with 3-4 relevant hashtags.

**Output Format:** Your entire response MUST be a valid JSON object matching the requested output schema. Do not add any text before or after the JSON.

**Client Information & Instructions:**
${input.clientBusiness}

**IMPORTANT**: Your entire response MUST be a valid JSON object. Do not add any text, explanations, or markdown formatting before or after the JSON object.
`;
    
    let responseText = '';
    try {
        responseText = await runReplicateText(prompt);

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON object found in the AI response.');
        }
        const jsonString = jsonMatch[0];
        const parsedOutput = JSON.parse(jsonString);
        
        const validatedOutput = GenerateContentScheduleOutputSchema.parse(parsedOutput);
        
        return validatedOutput;

    } catch (error) {
        console.error("==================== AI RESPONSE ERROR (generateContentSchedule) ====================");
        console.error("Failed to parse or validate AI output. Error:", error);
        console.error("--------------------------------- Raw AI Response ---------------------------------");
        console.error(responseText);
        console.error("================================ END OF AI RESPONSE ERROR ================================");
        throw new Error('The AI returned an invalid response format.');
    }
}
