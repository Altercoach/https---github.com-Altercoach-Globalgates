
'use server';

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import Replicate from 'replicate';
import type { GenerateImageOutput, GenerateImageInput, GenerateBatchImagesInput, GenerateBatchImagesOutput } from '@/lib/types';
import { GenerateImageInputSchema } from '@/lib/types';

// ============================================
// MODELO Y FALLBACK
// ============================================

const REPLICATE_MODEL_ID = 'black-forest-labs/flux-schnell';

function generatePlaceholder(brief: string): GenerateImageOutput {
    console.warn('⚠️  Replicate falló (puede ser por falta de créditos o error de API). Usando placeholder de picsum.photos.');
    const seed = brief.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '');
    return {
        imageUrl: `https://picsum.photos/seed/${seed}/1024/1024`,
        refinedPrompt: brief,
        cost: 0,
        model: 'placeholder',
    };
}

// ============================================
// FLUJO PRINCIPAL DE GENERACIÓN
// ============================================

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImage',
    inputSchema: GenerateImageInputSchema,
    outputSchema: z.object({
      imageUrl: z.string().describe('URL de la imagen generada'),
      refinedPrompt: z.string().describe('Prompt usado para generar la imagen'),
      cost: z.number().describe('Costo de la generación en USD'),
      model: z.string().describe('Modelo usado para la generación'),
    }),
  },
  async (input) => {
    
    if (!process.env.REPLICATE_API_TOKEN) {
      console.warn('REPLICATE_API_TOKEN no está configurado. Usando modo placeholder.');
      return generatePlaceholder(input.creativeBrief);
    }
    
    if (!input.creativeBrief || input.creativeBrief.trim().length === 0) {
      throw new Error('El brief creativo está vacío, no se puede generar una imagen.');
    }
    
    try {
      const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
      
      console.log(`🎨 Generando imagen con FLUX Schnell (GRATIS)`);
      console.log('📝 Prompt:', input.creativeBrief.substring(0, 100));

      const output = await replicate.run(
        REPLICATE_MODEL_ID as `${string}/${string}:${string}`,
        {
          input: {
            prompt: input.creativeBrief,
            go_fast: true,
            num_outputs: 1,
            aspect_ratio: input.aspectRatio,
            output_format: "webp",
            output_quality: 80,
          }
        }
      );
      
      const imageUrl = Array.isArray(output) ? output[0] : String(output);

      if (!imageUrl || !imageUrl.startsWith('https')) {
        throw new Error(`La respuesta de Replicate no fue una URL válida: ${imageUrl}`);
      }

      console.log('✅ Imagen generada exitosamente por IA.');
      console.log('🔗 URL:', imageUrl);

      return {
        imageUrl: imageUrl,
        refinedPrompt: input.creativeBrief,
        cost: 0, 
        model: 'flux-schnell',
      };

    } catch (error: any) {
      console.error('❌ Error al generar imagen con Replicate:', error.message);
      return generatePlaceholder(input.creativeBrief);
    }
  }
);


// ============================================
// FUNCIONES WRAPPER (EXPORTABLES)
// ============================================

/**
 * Genera una sola imagen a partir de un brief creativo.
 */
export async function generateImageFromPrompt(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return await generateImageFlow(input);
}

/**
 * Genera un lote de imágenes (FUNCIONALIDAD FUTURA, NO IMPLEMENTADA).
 */
export async function generateBatchImages(input: GenerateBatchImagesInput): Promise<GenerateBatchImagesOutput> {
    console.warn("La generación en lote aún no está implementada en este flujo simplificado.");
    return {
        results: [],
        totalCost: 0,
        successCount: 0,
        failureCount: input.posts.length,
    };
}
