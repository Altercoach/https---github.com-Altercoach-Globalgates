
'use server';

import { z } from 'zod';
import { ai, MODEL_BY_TASK } from '@/ai/genkit';
import type { GenerateImageOutput, GenerateImageInput } from '@/lib/types';
import { GenerateImageInputSchema } from '@/lib/types';


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
      
      const { media, usage } = await ai.generate({
        model: imageModel,
        prompt: input.creativeBrief,
        config: {
          aspectRatio: input.aspectRatio,
        }
      });
      
      const imageUrl = media?.url;

      if (!imageUrl) {
        throw new Error('Google AI no devolvió una URL de imagen válida.');
      }
      
      console.log('✅ ÉXITO! Imagen generada.');
      
      return {
        imageUrl: imageUrl,
        refinedPrompt: input.creativeBrief,
        cost: usage?.totalTokens || 0, // Placeholder for cost
        model: imageModel,
      };

    } catch (error: any) {
      console.error('❌ ERROR en la generación de imagen:', error.message);
      throw new Error(`Error al generar la imagen: ${error.message}`);
    }
  }
);


export async function generateImageFromPrompt(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return await generateImageFlow(input);
}
