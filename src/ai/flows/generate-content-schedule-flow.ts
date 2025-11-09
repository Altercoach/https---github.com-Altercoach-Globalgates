
'use server';

/**
 * @fileOverview Generates a monthly content schedule for a client using Abacus AI.
 *
 * - generateContentSchedule - A function that creates the content schedule.
 * - GenerateContentScheduleInput - The input type for the function.
 * - GenerateContentScheduleOutput - The return type for the function.
 */

import { ai, getAbacusModelForTask } from '@/ai/genkit';
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
  prompt: `You are a world-class social media content strategist. Create a monthly content schedule (a "parrilla de contenido") for an Instagram account based on the client's profile and team instructions.

  **Client Information & Instructions:**
  {{{clientBusiness}}}

  **Your Task:**
  Create a diverse content schedule. For each post, define:
  1.  **postNumber**: Sequential number.
  2.  **format**: Choose from: 'Post fijo', 'Historia', 'Carrusel', 'Video'.
  3.  **topic**: Strategic theme (e.g., 'Venta', 'Branding', 'Interacción').
  4.  **copyIn**: Internal creative brief (Title, Subtitle, ideas).
  5.  **copyOut**: Final, public-facing caption with 3-4 relevant hashtags.

  **Instructions:**
  - Tailor content to the client's business.
  - Create a balanced mix of formats and topics.
  - The 'copyIn' should be a clear brief for a designer.
  - The 'copyOut' should be creative and persuasive.
  - The entire output must be in Spanish.
  - The final output MUST be a JSON object containing a single key "posts".`,
});

const generateContentScheduleFlow = ai.defineFlow(
  {
    name: 'generateContentScheduleFlow',
    inputSchema: GenerateContentScheduleInputSchema,
    outputSchema: GenerateContentScheduleOutputSchema,
  },
  async (input) => {
    console.log(`[Abacus AI Simulation] Running Content Schedule Generation.`);
    
    // The AI call is commented out to prevent the 404 error.
    // const abacusModel = getAbacusModelForTask('copywriting');
    // const { output } = await prompt(input, { model: abacusModel });
    // if (!output) {
    //   throw new Error('The AI failed to generate a content schedule.');
    // }
    
    const mockOutput: GenerateContentScheduleOutput = {
      posts: [
        {
          postNumber: "1",
          format: "Post fijo",
          topic: "Branding",
          copyIn: "Título: Café de la Mañana.\nSubtítulo: El ritual que te activa.\nIdea: Foto de alta calidad de una taza de nuestro café con vapor, en un ambiente acogedor.",
          copyOut: "Tu día empieza mejor con Golden Key. ☕️✨ #CaféDeEspecialidad #RitualMañanero #GoldenKey"
        },
        {
          postNumber: "2",
          format: "Video (Reel)",
          topic: "Venta",
          copyIn: "Título: ¿Conoces nuestro Cold Brew?\nIdea: Video rápido mostrando el proceso artesanal de nuestro cold brew y gente disfrutándolo.",
          copyOut: "El cold brew que te cambiará la vida. Suave, refrescante y potente. ¡Pruébalo hoy! #ColdBrew #CaféArtesanal #Verano"
        }
      ]
    };

    return mockOutput;
  }
);
