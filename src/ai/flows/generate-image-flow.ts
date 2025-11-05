
'use server';

/**
 * @fileOverview Generates an image from a creative brief using AI.
 * This flow refines a creative concept into a professional visual prompt using Genkit,
 * then calls a dedicated image generation service (Replicate) to create the image.
 */

import { z } from 'zod';
import { ai, getModelForTask } from '@/ai/genkit';
import { replicateImageService } from '@/lib/image-generation/replicate-service';
import type { ImageGenerationOptions } from '@/lib/image-generation/replicate-service';

// ============================================
// SCHEMAS
// ============================================

export const GenerateImageInputSchema = z.object({
  creativeBrief: z.string().describe("The creative brief or idea for the image."),
  aspectRatio: z.enum(['1:1', '4:5', '9:16', '16:9']).default('1:1').optional(),
  style: z.string().optional().describe('Estilo visual deseado (ej. "cinematic", "minimalist")'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated image."),
  refinedPrompt: z.string().describe('The refined prompt used to generate the image.'),
  cost: z.number().describe('The cost of the generation in USD.'),
  model: z.string().describe('The model used for generation.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;


// ============================================
// PROMPT DE REFINAMIENTO CREATIVO
// ============================================

const imagePromptRefiner = ai.definePrompt(
  {
    name: 'imagePromptRefiner',
    input: { schema: GenerateImageInputSchema.pick({ creativeBrief: true, style: true }) },
    output: { schema: z.string().nullable().describe('Prompt visual optimizado para IA') },
  },
  `Eres un DIRECTOR CREATIVO de clase mundial en una agencia de publicidad, un híbrido entre Simon Sinek, Seth Godin y un diseñador visual de élite. Tu especialidad es traducir conceptos de marketing en arte visual impactante.

    **Tu Misión:**
    Transformar un "Brief Creativo" (un eje conceptual) en un PROMPT VISUAL PROFESIONAL y detallado, optimizado para un modelo de IA de texto a imagen (como Stable Diffusion o FLUX).

    **Brief Creativo (Eje Conceptual):**
    {{{creativeBrief}}}
    
    {{#if style}}
    **Estilo Solicitado:**
    {{style}}
    {{/if}}

    **Tu Proceso Mental (Paso a Paso):**

    1.  **Deconstruir el Objetivo:** ¿Qué se quiere lograr? (generar deseo, construir confianza, crear urgencia, comunicar simplicidad).
    2.  **Elegir un Arquetipo Visual:** No seas literal. Decide si el concepto se expresa mejor a través de:
        *   **Realismo Fotográfico:** para credibilidad (ej. producto en uso).
        *   **Abstracción/Conceptual:** para ideas complejas (ej. seguridad de datos).
        *   **Surrealismo/Metáfora:** para impacto emocional (ej. "libertad financiera").
        *   **Estilo Minimalista:** para elegancia o premium.
    3.  **Sintetizar tu Expertise:** Infunde principios de marketing y psicología. Si el brief es sobre "seguridad", usa elementos que evocan confianza (estructuras sólidas, colores calmados, posturas abiertas).
    4.  **Construir el Prompt Maestro (Tu Instrucción de Director):**
        *   **Core Concept:** Una frase evocadora que captura la idea principal.
        *   **Estilo Visual:** (e.g., photorealistic, cinematic lighting, 3D render, minimalist digital art, moody, vibrant, epic).
        *   **Sujeto y Composición:** Describe la escena, el foco, el ángulo (e.g., close-up on a character's determined expression, wide shot of a serene landscape).
        *   **Iluminación y Color:** Especifica el ambiente (e.g., dramatic Rembrandt lighting, soft morning light, a palette of cool blues and greys).
        *   **Emoción Clave a Evocar:** (e.g., confianza, curiosidad, alivio, ambición).
        *   **Negative Prompts (Crucial):** Lo que NO debe aparecer (e.g., -no text, -no blurry elements, -no generic stock-photo feel, -no logos).

    **Ejemplo de Transformación:**
    -   **Brief Creativo (Malo):** "Flyer para un café que da energía."
    -   **Tu Prompt (EXCELENTE):** "Cinematic shot of a young entrepreneur at dawn in a modern, minimalist office. Golden sunlight streams through the window, illuminating a single, elegant cup of black coffee on their desk. The focus is on their determined, focused eyes, reflecting the glow of a computer screen. The overall mood is one of quiet ambition and potential. Style: Photorealistic, moody, high-contrast. -no cliché imagery, -no text."

    **Tu Tarea:**
    Ahora, transforma el brief del usuario. Responde **ÚNICAMENTE** con el prompt final y detallado, listo para ser usado por la IA generadora de imágenes. No añadas explicaciones.
    `
);

// ============================================
// DIMENSIONES SEGÚN ASPECT RATIO
// ============================================

const ASPECT_RATIO_DIMENSIONS: Record<string, { width: number; height: number }> = {
    '1:1': { width: 1024, height: 1024 },   // Instagram/Facebook posts
    '4:5': { width: 1024, height: 1280 },   // Instagram feed optimizado
    '9:16': { width: 720, height: 1280 },   // Stories/Reels
    '16:9': { width: 1920, height: 1080 },  // YouTube/LinkedIn
};


// ============================================
// FLUJO PRINCIPAL
// ============================================

export async function generateImageFromPrompt(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    console.log('🎨 Iniciando generación de imagen...');
    
    // PASO 1: Validar que hay un brief
    if (!input.creativeBrief || input.creativeBrief.trim().length === 0) {
      throw new Error('El brief creativo está vacío, no se puede generar una imagen.');
    }

    // PASO 2: Refinar el brief con IA para convertirlo en prompt visual profesional
    console.log('🧠 Refinando brief creativo con IA...');
    
    let refinedPrompt: string;
    try {
      const { output } = await imagePromptRefiner(
        {
          creativeBrief: input.creativeBrief,
          style: input.style,
        },
        {
          model: getModelForTask('copywriting'), // Usa modelo de texto rápido
        }
      );
      
      refinedPrompt = output || input.creativeBrief;
      console.log('✅ Prompt refinado:', refinedPrompt.substring(0, 100) + '...');
    } catch (error) {
      console.warn('⚠️ No se pudo refinar el prompt, usando brief original');
      refinedPrompt = input.creativeBrief;
    }

    // PASO 3: Obtener dimensiones según aspect ratio
    const dimensions = ASPECT_RATIO_DIMENSIONS[input.aspectRatio || '1:1'] || ASPECT_RATIO_DIMENSIONS['1:1'];

    // PASO 4: Generar imagen con el servicio de Replicate
    console.log(`🖼️ Generando imagen con Replicate (${dimensions.width}x${dimensions.height})...`);
    
    try {
      const result = await replicateImageService.generateImage({
        prompt: refinedPrompt,
        width: dimensions.width,
        height: dimensions.height,
        negativePrompt: 'low quality, blurry, distorted, watermark, text overlay, logo, brand name, ugly, deformed',
      });

      console.log('✅ Imagen generada exitosamente');

      return {
        imageUrl: result.url,
        refinedPrompt,
        cost: result.cost,
        model: result.model,
      };
    } catch (error: any) {
      console.error('❌ Error al generar imagen con Replicate:', error);
      throw new Error(`Error al generar la imagen: ${error.message}`);
    }
  }
);
