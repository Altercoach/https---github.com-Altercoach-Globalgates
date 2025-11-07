
'use server';

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import Replicate from 'replicate';
import type { GenerateImageOutput, GenerateImageInput } from '@/lib/types';
import { GenerateImageInputSchema } from '@/lib/types';
import { getAbacusModelForTask } from '@/ai/genkit';


// This is the correct, free, and fast model ID based on user's research.
const REPLICATE_MODEL_ID = 'black-forest-labs/flux-schnell';

export const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImage',
    inputSchema: GenerateImageInputSchema,
    outputSchema: z.object({
      imageUrl: z.string(),
      refinedPrompt: z.string(),
      cost: z.number(),
      model: z.string(),
    }),
  },
  async (input) => {
    if (!input.creativeBrief?.trim()) {
      throw new Error('El brief creativo está vacío');
    }
    
    // Using Replicate directly as Abacus AI SDK doesn't have a direct image generation method shown
    // and this follows the user's executive order to use specific models.
    const apiToken = process.env.REPLICATE_API_TOKEN;

    if (!apiToken || apiToken === 'r8_tu_token_aqui') {
       console.warn('⚠️ REPLICATE_API_TOKEN no configurado, usando placeholder.');
       return {
        imageUrl: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
        refinedPrompt: input.creativeBrief,
        cost: 0,
        model: 'placeholder',
      };
    }
    
    try {
      const replicate = new Replicate({ auth: apiToken });

      console.log(`🎨 Generando imagen con ${REPLICATE_MODEL_ID}`);
      console.log('📝 Prompt:', input.creativeBrief.substring(0, 100));

      const output = await replicate.run(
        REPLICATE_MODEL_ID as `${string}/${string}`,
        {
          input: {
            prompt: input.creativeBrief,
            aspect_ratio: input.aspectRatio,
            // Parameters specific to flux-schnell
            go_fast: true,
            num_outputs: 1,
            output_format: "webp",
            output_quality: 80,
          }
        }
      );
      
      const imageUrl = Array.isArray(output) ? output[0] : output;
      
      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error('La API de Replicate no devolvió una URL de imagen válida.');
      }
      
      console.log('✅ ÉXITO! Imagen generada:', imageUrl);
      
      return {
        imageUrl: imageUrl,
        refinedPrompt: input.creativeBrief,
        cost: 0, // FLUX Schnell is free, so cost is 0.
        model: 'flux-schnell',
      };

    } catch (error: any) {
      console.error('❌ ERROR en la API de Replicate:', error.message);
      // Return a placeholder on failure to prevent app from breaking.
      return {
        imageUrl: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
        refinedPrompt: input.creativeBrief,
        cost: 0,
        model: 'error-fallback',
      };
    }
  }
);


export async function generateImageFromPrompt(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return await generateImageFlow(input);
}
