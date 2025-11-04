
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
  productIds: z.array(z.string()).describe('Un array de IDs de los productos recomendados. Si no hay suficiente información, este array puede estar vacío.'),
  reasoning: z.string().describe('Una explicación de por qué se recomendaron estos productos, o una pregunta para obtener más detalles si la información es insuficiente.'),
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
  1.  Lee cuidadosamente la descripción del negocio para entender sus necesidades (p. ej., empezar, conseguir leads, construir marca, análisis de mercado, etc.).
  2.  Revisa la lista de productos disponibles y sus descripciones para entender qué ofrece cada uno.
  3.  **Análisis y Acción:**
      *   **Si la descripción del negocio es clara y suficiente:** Selecciona uno o más IDs de productos que mejor se adapten a las necesidades. No recomiendes productos de tipo 'info'. Proporciona una explicación clara y concisa (en español) de por qué estás recomendando esos productos.
      *   **Si la descripción es muy vaga o insuficiente para tomar una decisión informada:** No selecciones ningún producto (deja 'productIds' como un array vacío). En su lugar, formula una pregunta específica y amigable (en español) en el campo 'reasoning' para ayudar al usuario a proporcionar la información que necesitas. Por ejemplo, si dicen "quiero crecer", podrías preguntar: "¿Excelente! Para darte la mejor recomendación, ¿podrías decirme si tu prioridad es aumentar tus seguidores en redes sociales o capturar directamente datos de clientes potenciales (leads)?".

  4.  Devuelve tu respuesta en el formato solicitado.`,
});

const recommendPlanFlow = ai.defineFlow(
  {
    name: 'recommendPlanFlow',
    inputSchema: RecommendPlanInputSchema,
    outputSchema: RecommendPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, { model: 'gemini-1.5-flash' });
    return output!;
  }
);
