'use server';

/**
 * @fileOverview Recomienda un plan de marketing basado en la descripción del negocio del usuario.
 *
 * - recommendPlan - Una función que recomienda un plan.
 * - RecommendPlanInput - El tipo de entrada para la función recommendPlan.
 * - RecommendPlanOutput - El tipo de retorno para la función recommendPlan.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendPlanInputSchema = z.object({
  businessDescription: z.string().describe('La descripción del negocio del usuario.'),
  products: z.string().describe('El JSON string que representa la lista de productos disponibles.'),
});
export type RecommendPlanInput = z.infer<typeof RecommendPlanInputSchema>;

const RecommendPlanOutputSchema = z.object({
  productIds: z.array(z.string()).describe('Un array de IDs de los productos recomendados.'),
  reasoning: z.string().describe('Una explicación de por qué se recomendaron estos productos.'),
});
export type RecommendPlanOutput = z.infer<typeof RecommendPlanOutputSchema>;

export async function recommendPlan(input: RecommendPlanInput): Promise<RecommendPlanOutput> {
  return recommendPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPlanPrompt',
  input: {schema: RecommendPlanInputSchema},
  output: {schema: RecommendPlanOutputSchema},
  prompt: `Eres un consultor de negocios experto especializado en marketing digital y crecimiento. Tu tarea es analizar la descripción de un negocio y recomendar el mejor plan o combinación de planes de los productos disponibles.

  **Descripción del Negocio:**
  {{{businessDescription}}}

  **Productos Disponibles (en formato JSON):**
  {{{products}}}

  **Instrucciones:**
  1. Lee cuidadosamente la descripción del negocio para entender sus necesidades (p. ej., empezar, conseguir leads, construir marca, análisis de mercado, etc.).
  2. Revisa la lista de productos disponibles.
  3. Selecciona uno o más IDs de productos que mejor se adapten a las necesidades del negocio. No recomiendes productos de tipo 'info'.
  4. Proporciona una explicación clara y concisa (en español) de por qué estás recomendando esos productos específicos.
  5. Devuelve los IDs de los productos recomendados en el campo 'productIds' y tu explicación en el campo 'reasoning'.`,
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_ONLY_HIGH',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_LOW_AND_ABOVE',
    },
  ],
});

const recommendPlanFlow = ai.defineFlow(
  {
    name: 'recommendPlanFlow',
    inputSchema: RecommendPlanInputSchema,
    outputSchema: RecommendPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
