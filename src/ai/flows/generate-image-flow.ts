
'use server';

/**
 * @fileOverview Generates an image from a creative brief using AI.
 *
 * - generateImageFromPrompt - A function that creates the image.
 * - GenerateImageInput - The input type for the function.
 * - GenerateImageOutput - The return type for the function.
 */

import { ai, getModelForTask } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  creativeBrief: z.string().describe("The creative brief or idea for the image."),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated image."),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImageFromPrompt(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

// 1. First, a flow to refine the creative brief into a powerful image prompt.
const imagePromptRefiner = ai.definePrompt({
    name: 'imagePromptRefiner',
    input: { schema: GenerateImageInputSchema },
    output: { schema: z.string() },
    prompt: `You are an expert prompt engineer for text-to-image models. Your task is to convert a simple creative brief into a rich, detailed, and effective prompt.

    **Creative Brief:**
    {{{creativeBrief}}}

    **Your Task:**
    Expand the brief into a powerful prompt. Include details about:
    - **Subject:** What is the main focus?
    - **Style:** (e.g., photorealistic, cinematic, minimalist, 3D render, digital art, watercolor)
    - **Composition:** (e.g., close-up, wide shot, dynamic angle)
    - **Lighting:** (e.g., soft light, dramatic lighting, golden hour)
    - **Color Palette:** (e.g., vibrant, pastel, monochrome)
    - **Details:** Add specific, evocative details to make the image stand out.
    - **Negative Prompts:** (optional) What to avoid (e.g., text, blurry background).

    Respond ONLY with the final, detailed prompt. Do not add any extra text or explanation.`,
});


// 2. The main flow that uses the refined prompt to generate the image.
const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    // Step 1: Refine the user's brief into a better prompt.
    const { output: refinedPrompt } = await imagePromptRefiner(input, { model: getModelForTask('copywriting') });
    
    if (!refinedPrompt) {
        throw new Error('Failed to refine the image prompt.');
    }

    // Step 2: Use the refined prompt to generate the image.
    const { media } = await ai.generate({
      model: googleAI.model('imagen-4.0-fast-generate-001'),
      prompt: refinedPrompt,
    });

    const imageUrl = media?.url;
    if (!imageUrl) {
        throw new Error("The AI failed to generate an image.");
    }
    
    return { imageUrl };
  }
);
