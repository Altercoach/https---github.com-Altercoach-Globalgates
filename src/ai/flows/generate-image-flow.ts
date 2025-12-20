
'use server';

import { z } from 'zod';
import Replicate from 'replicate';
import { ai } from '@/ai/genkit';
import type { GenerateImageOutput, GenerateImageInput } from '@/lib/types';
import { GenerateImageInputSchema } from '@/lib/types';
import { MODEL_BY_TASK } from '@/ai/genkit';


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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
      
      const imageModel = MODEL_BY_TASK.imageGeneration;
      
      const output = await replicate.run(
        imageModel,
        {
          input: {
            prompt: input.creativeBrief,
            width: 1024, // Valores estándar para SDXL
            height: 1024,
          }
        }
      );

      const imageUrl = Array.isArray(output) ? output[0] : null;

      if (!imageUrl) {
        throw new Error('Replicate no devolvió una URL de imagen válida.');
      }
      
      console.log('✅ ÉXITO! Imagen generada.');
      
      return {
        imageUrl: imageUrl,
        refinedPrompt: input.creativeBrief, // Replicate no refina el prompt, usamos el original
        cost: 0, // El costo se manejaría fuera del flujo en una app real
        model: imageModel,
      };

    } catch (error: any) {
      console.error('❌ ERROR en la generación de imagen:', error.message);
      return {
        imageUrl: '',
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
