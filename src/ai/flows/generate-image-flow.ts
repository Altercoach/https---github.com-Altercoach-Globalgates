
'use server';

import { z } from 'zod';
import { runReplicateImage } from '@/ai/genkit';
import type { GenerateImageOutput, GenerateImageInput } from '@/lib/types';
import { GenerateImageInputSchema } from '@/lib/types';


export async function generateImageFromPrompt(input: GenerateImageInput): Promise<GenerateImageOutput> {
  if (!input.creativeBrief?.trim()) {
    throw new Error('El brief creativo está vacío');
  }
  
  try {
    console.log(`🎨 Generating image with prompt: ${input.creativeBrief}`);
    
    const imageUrl = await runReplicateImage(input.creativeBrief, input.aspectRatio || '1:1');
    
    if (!imageUrl) {
      throw new Error('Replicate AI no devolvió una URL de imagen válida.');
    }
    
    console.log('✅ ÉXITO! Imagen generada.');
    
    return {
      imageUrl: imageUrl,
      refinedPrompt: input.creativeBrief, // Replicate doesn't refine the prompt in the same way
      cost: 0, // Cost calculation would require more specific logic for Replicate
      model: 'stability-ai/sdxl', // The model used in runReplicateImage
    };

  } catch (error: any) {
    console.error('❌ ERROR en la generación de imagen:', error.message);
    throw new Error(`Error al generar la imagen: ${error.message}`);
  }
}
