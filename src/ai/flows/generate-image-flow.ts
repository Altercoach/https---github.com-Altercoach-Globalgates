
'use server';

import { ai, googleAI } from '@/ai/genkit';
import type { GenerateImageOutput, GenerateImageInput } from '@/lib/types';

export async function generateImageFromPrompt(input: GenerateImageInput): Promise<GenerateImageOutput> {
  if (!input.creativeBrief?.trim()) {
    throw new Error('El brief creativo está vacío');
  }
  
  console.log("🤖 Calling Imagen 3 for Image Generation");

  try {
    const { media } = await ai.generate({
      model: googleAI.model('imagen-3.0-fast-generate-001'),
      prompt: input.creativeBrief,
      config: {
        aspectRatio: input.aspectRatio || '1:1',
      }
    });

    if (!media?.url) {
      throw new Error('Gemini AI did not return a valid image URL.');
    }
    
    console.log('✅ ÉXITO! Imagen generada.');
    
    return {
      imageUrl: media.url,
      refinedPrompt: input.creativeBrief, // Imagen doesn't provide a refined prompt in this way
      cost: 0, // Cost calculation requires token/pricing info
      model: 'imagen-3.0-fast-generate-001',
    };

  } catch (error: unknown) {
    console.error('❌ ERROR en la generación de imagen:', error instanceof Error ? error.message : String(error));
    throw new Error(`Error al generar la imagen: ${error instanceof Error ? error.message : String(error)}`);
  }
}
