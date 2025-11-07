
'use server';

import { z } from 'zod';
import { ai, getModelForTask } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import type { GenerateImageOutput, GenerateImageInput, GenerateBatchImagesInput, GenerateBatchImagesOutput } from '@/lib/types';
import { GenerateImageInputSchema } from '@/lib/types';

const generateImageFlow = ai.defineFlow(
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
    if (!process.env.GEMINI_API_KEY) {
      console.warn('❌ GEMINI_API_KEY no configurado');
      const seed = Date.now();
      return {
        imageUrl: `https://picsum.photos/seed/${seed}/1024/1024`,
        refinedPrompt: input.creativeBrief,
        cost: 0,
        model: 'placeholder',
      };
    }
    
    if (!input.creativeBrief?.trim()) {
      throw new Error('El brief está vacío');
    }
    
    try {
      console.log('🎨 Generando con Imagen 2...');
      console.log('📝 Prompt:', input.creativeBrief.substring(0, 100));

      const { media } = await ai.generate({
        model: googleAI.model('imagen-2'),
        prompt: input.creativeBrief,
        config: {
            aspectRatio: input.aspectRatio || '1:1',
            numImages: 1,
        }
      });
      
      const imageUrl = media[0]?.url;

      if (!imageUrl || !imageUrl.startsWith('data:')) {
        console.error('❌ URL inválida:', imageUrl);
        throw new Error('URL inválida de Google AI');
      }

      console.log('✅ ÉXITO! Imagen generada');
      
      return {
        imageUrl: imageUrl,
        refinedPrompt: input.creativeBrief,
        cost: 0, // El costo se puede calcular si es necesario
        model: 'imagen-2',
      };

    } catch (error: any) {
      console.error('❌ ERROR COMPLETO DE GOOGLE AI:');
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
      const seed = Date.now();
      return {
        imageUrl: `https://picsum.photos/seed/${seed}/1024/1024`,
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

export async function generateBatchImages(input: GenerateBatchImagesInput): Promise<GenerateBatchImagesOutput> {
    console.warn("Generación en lote no implementada");
    return {
        results: [],
        totalCost: 0,
        successCount: 0,
        failureCount: input.posts.length,
    };
}
