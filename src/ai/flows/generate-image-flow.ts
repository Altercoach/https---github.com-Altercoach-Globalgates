
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

// Cambiamos a un modelo más rápido y gratuito para la demostración
const REPLICATE_MODEL_ID = 'black-forest-labs/flux-schnell:399f6d3176d7c6e69956d04341c6404050e64f114a2c0746939933510443b624';

const ASPECT_RATIO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '1:1': { width: 1024, height: 1024 },
  '4:5': { width: 1024, height: 1280 },
  '9:16': { width: 720, height: 1280 },
  '16:9': { width: 1920, height: 1080 },
};


// ============================================
// FLUJO PRINCIPAL (GENERACIÓN ÚNICA)
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
    console.log('🎨 Iniciando generación de imagen con nuevo flujo...');
    
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN no está configurado en el archivo .env');
    }
    
    if (!input.creativeBrief || input.creativeBrief.trim().length === 0) {
      throw new Error('El brief creativo está vacío, no se puede generar una imagen.');
    }
    
    const dimensions = ASPECT_RATIO_DIMENSIONS[input.aspectRatio] || ASPECT_RATIO_DIMENSIONS['1:1'];

    try {
      console.log(`🖼️  Enviando prompt a Replicate: "${input.creativeBrief.substring(0, 50)}..."`);
      
      const output = await replicate.run(
        REPLICATE_MODEL_ID as `${string}/${string}:${string}`,
        {
          input: {
            prompt: input.creativeBrief,
            width: dimensions.width,
            height: dimensions.height,
            num_outputs: 1,
            guidance_scale: 7.5,
            num_inference_steps: 25,
          },
        }
      );
      
      const imageUrl = Array.isArray(output) ? output[0] : String(output);

      if (!imageUrl || !imageUrl.startsWith('https')) {
        throw new Error(`La respuesta de Replicate no fue una URL válida: ${imageUrl}`);
      }

      console.log('✅ Imagen generada exitosamente por IA.');

      return {
        imageUrl: imageUrl,
        refinedPrompt: input.creativeBrief, // Usamos el prompt directo
        cost: 0.00, // Este modelo es gratuito
        model: REPLICATE_MODEL_ID,
      };

    } catch (error: any) {
      console.error('❌ Error fatal al generar imagen con Replicate:', error);
      throw new Error(`Error en la API de Replicate: ${error.message}`);
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
