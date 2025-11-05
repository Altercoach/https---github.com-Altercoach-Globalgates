
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
    output: { schema: z.string().nullable() },
    prompt: `You are an elite Creative Director at a world-class advertising agency, blending the strategic mind of Simon Sinek, the marketing savvy of Seth Godin, and the visual eye of a top-tier designer. You are an expert in marketing psychology, neuromarketing, sales funnels, and branding.

    The user will provide a "Creative Brief" which is NOT a literal script, but a conceptual axis or theme. Your task is to TRANSLATE this core idea into a powerful, professional, and highly effective visual prompt for a text-to-image AI model.

    **Creative Brief (Conceptual Axis):**
    {{{creativeBrief}}}

    **Your Process:**

    1.  **Deconstruct the Goal:** What is the underlying business objective? (e.g., generate desire, build trust, create urgency, convey simplicity).
    2.  **Choose a Creative Archetype:** Do not be literal. Decide if the concept is best expressed through realism, abstraction, surrealism, humor, irony, sarcasm, or metaphor.
    3.  **Synthesize Your Expertise:** Infuse principles of marketing and psychology. If the brief is about "security," think about what visual elements evoke trust (e.g., solid structures, calming colors, open postures).
    4.  **Construct the Master Prompt:** Build a detailed prompt for the image generation model. This is your "Director's Instruction". It must include:
        *   **Core Concept:** A powerful, evocative sentence that captures the main idea.
        *   **Style:** (e.g., photorealistic, cinematic lighting, 3D render, minimalist digital art, moody, vibrant).
        *   **Subject & Composition:** Describe the scene, the focus, the angle (e.g., close-up on a character's determined expression, wide shot of a serene landscape).
        *   **Lighting & Color:** Specify the mood (e.g., dramatic Rembrandt lighting, soft morning light, a palette of cool blues and greys).
        *   **Key Emotion/Feeling to Evoke:** (e.g., confidence, curiosity, relief, ambition).
        *   **Negative Prompts (crucial):** What to absolutely avoid (e.g., -no text, -no blurry elements, -no generic stock-photo feel).

    **Example:**
    -   **Creative Brief:** "Flyer for a new coffee that gives you energy."
    -   **Your (Bad) Literal Prompt:** "A person drinking coffee and feeling energetic."
    -   **Your (GOOD) Creative Director Prompt:** "Cinematic shot of a young entrepreneur at dawn in a modern, minimalist office. Golden sunlight streams through the window, illuminating a single, elegant cup of black coffee on their desk. The focus is on their determined, focused eyes, reflecting the glow of a computer screen. The overall mood is one of quiet ambition and potential. Style: Photorealistic, moody, high-contrast. -no cliché imagery, -no text."

    Now, take the user's brief and transform it. Respond ONLY with the final, detailed prompt. Do not add any extra text or explanation.`,
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
    
    // Use the refined prompt if available, otherwise fall back to the original brief.
    const finalPrompt = refinedPrompt ?? input.creativeBrief;

    if (!finalPrompt || finalPrompt.trim() === '') {
        throw new Error('Creative brief is empty, cannot generate an image.');
    }

    // Step 2: Use the final prompt to generate the image.
    const { media } = await ai.generate({
      model: getModelForTask('contentGeneration'), // Use a compatible model for image generation
      prompt: finalPrompt,
    });

    const imageUrl = media?.url;
    if (!imageUrl) {
        throw new Error("The AI failed to generate an image.");
    }
    
    return { imageUrl };
  }
);
