
'use server';

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import Replicate from 'replicate';
import type { GenerateImageOutput, GenerateImageInput, GenerateBatchImagesInput, GenerateBatchImagesOutput } from '@/lib/types';
import { GenerateImageInputSchema } from '@/lib/types';

// ============================================
// CONFIGURACIÓN DE REPLICATE
// ============================================

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Modelo gratuito y actualizado recomendado (FLUX.1.1 Pro)
const REPLICATE_MODEL_ID = 'black-forest-labs/flux-1.1-pro:1c59f6236b3f5a8398b1b7029519c636f332208a9947843194a2b220377461e1';

// ============================================
// FUNCIÓN DE FALLBACK (PLACEHOLDER)
// ============================================

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
      console.log(`🎨  Enviando prompt a Replicate con FLUX.1.1 Pro: "${input.creativeBrief.substring(0, 80)}..."`);
      
      const replicateInput = {
        prompt: input.creativeBrief,
        aspect_ratio: input.aspectRatio,
        num_outputs: 1,
      };

      const output = await replicate.run(REPLICATE_MODEL_ID as `${string}/${string}:${string}`, { input: replicateInput });
      
      const imageUrl = Array.isArray(output) ? output[0] : String(output);

      if (!imageUrl || !imageUrl.startsWith('https')) {
        throw new Error(`La respuesta de Replicate no fue una URL válida: ${imageUrl}`);
      }

      console.log('✅ Imagen generada exitosamente por IA.');

      return {
        imageUrl: imageUrl,
        refinedPrompt: input.creativeBrief,
        cost: 0, // El modelo FLUX es gratuito
        model: REPLICATE_MODEL_ID,
      };

    } catch (error: any) {
      console.error('❌ Error al generar imagen con Replicate:', error.message);
      // Si falla (por crédito u otra razón), devolvemos un placeholder.
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
    // Devolvemos una respuesta vacía para no romper la interfaz
    return {
        results: [],
        totalCost: 0,
        successCount: 0,
        failureCount: input.posts.length,
    };
}
