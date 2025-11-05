
'use server';

import { z } from 'zod';
import { ai, getModelForTask } from '@/ai/genkit';
import { replicateImageService } from '@/lib/image-generation/replicate-service';
import type { GenerateImageOutput, GenerateImageInput, GenerateBatchImagesInput, GenerateBatchImagesOutput } from '@/lib/types';
import { GenerateImageInputSchema } from '@/lib/types';


// ============================================
// PROMPT DE REFINAMIENTO CREATIVO
// ============================================

const imagePromptRefiner = ai.definePrompt(
  {
    name: 'imagePromptRefiner',
    input: {
      schema: z.object({
        creativeBrief: z.string(),
        style: z.string().optional(),
      }),
    },
    output: {
      schema: z.string().describe('Prompt visual optimizado'),
    },
  },
  `
Eres un DIRECTOR CREATIVO experto nivel mundial con profundo conocimiento en:

📚 EXPERTOS DE REFERENCIA:
- Simon Sinek (propósito y storytelling)
- Seth Godin (ideas virales y tribus)
- Jürgen Klarić (neuromarketing)
- Gary Vaynerchuk (contenido social)
- Neil Patel (marketing digital)

🎨 DISCIPLINAS MAESTRAS:
- Marketing estratégico y psicología del consumidor
- Diseño visual y teoría del color
- Neuromarketing y triggers emocionales
- Arquetipos de marca y storytelling
- Composición fotográfica y dirección de arte

🎯 TU MISIÓN:
Transformar el brief creativo en un PROMPT VISUAL PROFESIONAL para generación de imagen.

BRIEF CREATIVO:
{{{creativeBrief}}}

{{#if style}}
ESTILO SOLICITADO:
{{style}}
{{/if}}

📐 PROCESO DE DIRECCIÓN CREATIVA:

1. ANÁLISIS DEL CONCEPTO:
   - Identifica el mensaje core y objetivo de marketing
   - Determina la emoción o reacción que debe provocar
   - Define el arquetipo visual más efectivo

2. SELECCIÓN DE ESTILO:
   Considera estos enfoques según el objetivo:
   - Realismo fotográfico (credibilidad, producto)
   - Ilustración conceptual (ideas abstractas)
   - Minimalismo (elegancia, premium)
   - Bold & colorido (energía, juventud)
   - Storytelling visual (conexión emocional)
   - Arte abstracto (innovación, creatividad)

3. ELEMENTOS DE DISEÑO:
   - Composición (regla de tercios, punto focal)
   - Paleta de colores (psicología del color)
   - Iluminación (mood y atmósfera)
   - Tipografía visual (si aplica)
   - Espacios negativos (jerarquía visual)

4. CONSTRUCCIÓN DEL PROMPT:
   Estructura tu prompt así:

   [SUJETO PRINCIPAL] + [ACCIÓN/EMOCIÓN] + [ESTILO VISUAL] + [COMPOSICIÓN] + [ILUMINACIÓN] + [PALETA] + [DETALLES TÉCNICOS]

   Ejemplo:
   "Professional female entrepreneur, confident pose, modern minimalist style, centered composition with negative space, natural window lighting, soft blues and whites, high quality photography, 8K, sharp focus, bokeh background"

🎨 INSTRUCCIONES CRÍTICAS:

- NO traduzcas literalmente el copy
- USA el brief como CONCEPTO, no como texto
- Sé ESPECÍFICO en detalles visuales
- Incluye triggers emocionales sutiles
- Considera el contexto de marketing (¿venta? ¿educación? ¿inspiración?)
- Optimiza para generación por IA (sé descriptivo pero conciso)
- EVITA: texto, logos, marcas específicas (a menos que sea esencial)

💡 ENTREGA:
Un prompt de máximo 200 palabras, profesional, detallado y optimizado para Stable Diffusion/FLUX.
Enfócate en la IDEA VISUAL, no en describir el copy.

PROMPT VISUAL OPTIMIZADO:
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
// FLUJO PRINCIPAL (NO EXPORTAR DIRECTAMENTE)
// ============================================

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImage',
    inputSchema: GenerateImageInputSchema,
    outputSchema: z.object({
      imageUrl: z.string().describe('URL de la imagen generada'),
      refinedPrompt: z.string().describe('Prompt refinado usado para generar la imagen'),
      cost: z.number().describe('Costo de la generación en USD'),
      model: z.string().describe('Modelo usado para la generación'),
    }),
  },
  async (input) => {
    console.log('🎨 Iniciando generación de imagen...');
    
    if (!input.creativeBrief || input.creativeBrief.trim().length === 0) {
      throw new Error('El brief creativo está vacío, no se puede generar una imagen.');
    }

    console.log('🧠 Refinando brief creativo con IA...');
    
    let refinedPrompt: string;
    try {
      const { output } = await imagePromptRefiner(
        {
          creativeBrief: input.creativeBrief,
          style: input.style,
        },
        {
          model: getModelForTask('copywriting'), 
        }
      );
      
      refinedPrompt = output || input.creativeBrief;
      console.log('✅ Prompt refinado:', refinedPrompt.substring(0, 100) + '...');
    } catch (error) {
      console.warn('⚠️ No se pudo refinar el prompt, usando brief original');
      refinedPrompt = input.creativeBrief;
    }

    const dimensions = ASPECT_RATIO_DIMENSIONS[input.aspectRatio] || ASPECT_RATIO_DIMENSIONS['1:1'];

    console.log('🖼️ Generando imagen con Replicate...');
    
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


// ============================================
// FLUJO EN LOTE (NO EXPORTAR DIRECTAMENTE)
// ============================================

const generateBatchImagesFlow = ai.defineFlow(
  {
    name: 'generateBatchImages',
    inputSchema: z.object({
      posts: z.array(z.object({
        copyIn: z.string(),
        aspectRatio: z.enum(['1:1', '4:5', '9:16', '16:9']).default('1:1'),
      })),
    }),
    outputSchema: z.object({
      results: z.array(z.object({
        imageUrl: z.string(),
        refinedPrompt: z.string(),
        cost: z.number(),
        success: z.boolean(),
        error: z.string().optional(),
      })),
      totalCost: z.number(),
      successCount: z.number(),
      failureCount: z.number(),
    }),
  },
  async (input) => {
    console.log(`🎨 Generando ${input.posts.length} imágenes en lote...`);
    
    const results = [];
    let totalCost = 0;
    let successCount = 0;
    let failureCount = 0;

    for (const post of input.posts) {
      try {
        const result = await generateImageFlow({
          creativeBrief: post.copyIn,
          aspectRatio: post.aspectRatio,
        });

        results.push({
          imageUrl: result.imageUrl,
          refinedPrompt: result.refinedPrompt,
          cost: result.cost,
          success: true,
        });

        totalCost += result.cost;
        successCount++;
      } catch (error: any) {
        console.error(`❌ Error en post:`, error);
        
        results.push({
          imageUrl: '',
          refinedPrompt: '',
          cost: 0,
          success: false,
          error: error.message,
        });

        failureCount++;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`✅ Lote completado: ${successCount} exitosas, ${failureCount} fallidas`);
    console.log(`💰 Costo total: $${totalCost.toFixed(3)}`);

    return {
      results,
      totalCost,
      successCount,
      failureCount,
    };
  }
);

// ============================================
// FUNCIONES WRAPPER ASÍNCRONAS (EXPORTABLES)
// ============================================

/**
 * Genera una sola imagen a partir de un brief creativo.
 * Esta función es segura para ser llamada desde un Server Action.
 */
export async function generateImageFromPrompt(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return await generateImageFlow(input);
}

/**
 * Genera un lote de imágenes en paralelo.
 * Esta función es segura para ser llamada desde un Server Action.
 */
export async function generateBatchImages(input: GenerateBatchImagesInput): Promise<GenerateBatchImagesOutput> {
  return await generateBatchImagesFlow(input);
}
