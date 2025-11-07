
'use server';

import { z } from 'zod';
import { ai, getAbacusModelForTask } from '@/ai/genkit';
import type { GenerateImageOutput, GenerateImageInput } from '@/lib/types';
import { GenerateImageInputSchema } from '@/lib/types';
import { MediaPart } from '@genkit-ai/core';


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
    
    try {
      console.log(`🎨 Generating image with prompt: ${input.creativeBrief}`);
      
      const abacusModel = getAbacusModelForTask('imageGeneration');
      
      const { media } = await ai.generate({
        model: abacusModel,
        prompt: input.creativeBrief,
        config: {
          // You can add model-specific config here if needed
          // For Imagen, you might specify things like aspectRatio if supported by the model version.
        },
      });

      const imageUrl = media?.url;
      if (!imageUrl) {
        throw new Error('La IA no devolvió una URL de imagen válida.');
      }
      
      console.log('✅ ÉXITO! Imagen generada.');
      
      return {
        imageUrl: imageUrl,
        refinedPrompt: input.creativeBrief,
        cost: 0, // Assuming cost is handled elsewhere or is 0 for this model.
        model: abacusModel.name,
      };

    } catch (error: any) {
      console.error('❌ ERROR en la generación de imagen:', error.message);
      // Return a placeholder on failure to prevent app from breaking.
       return {
        imageUrl: '', // Return empty string on failure
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
