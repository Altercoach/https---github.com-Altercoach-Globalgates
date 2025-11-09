
'use server';

/**
 * @fileOverview Analyzes a business evaluation questionnaire using Abacus AI.
 *
 * - analyzeBusinessEvaluation - A function that analyzes the questionnaire answers.
 * - AnalyzeBusinessEvaluationInput - The input type for the function.
 * - AnalyzeBusinessEvaluationOutput - The return type for the function.
 */

import { ai, getAbacusModelForTask } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeBusinessEvaluationInputSchema = z.object({
  answersJson: z.string().describe('The JSON string representing the questionnaire answers.'),
  targetLanguage: z.string().describe('The target language for the analysis (e.g., es, en).'),
});
export type AnalyzeBusinessEvaluationInput = z.infer<typeof AnalyzeBusinessEvaluationInputSchema>;

const AnalyzeBusinessEvaluationOutputSchema = z.object({
  swot: z.object({
      strengths: z.string().describe("The business's strengths."),
      weaknesses: z.string().describe("The business's weaknesses. If info is missing, ask for it."),
      opportunities: z.string().describe("The business's opportunities."),
      threats: z.string().describe("The business's threats. If info is missing, ask for it."),
  }),
  recommendations: z.string().describe("Detailed strategic recommendations, including suggested plans based on the analysis. Use markdown for formatting."),
});
export type AnalyzeBusinessEvaluationOutput = z.infer<typeof AnalyzeBusinessEvaluationOutputSchema>;


export async function analyzeBusinessEvaluation(input: AnalyzeBusinessEvaluationInput): Promise<AnalyzeBusinessEvaluationOutput> {
  return analyzeBusinessEvaluationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBusinessEvaluationPrompt',
  input: { schema: AnalyzeBusinessEvaluationInputSchema },
  output: { schema: AnalyzeBusinessEvaluationOutputSchema },
  prompt: `You are an expert business consultant named "Business Doctor RX". Your task is to analyze a client's questionnaire answers and provide a comprehensive SWOT analysis and strategic recommendations in the specified language, using a JSON output format.

  **Client's Answers (JSON format):**
  {{{answersJson}}}

  **Your Task:**
  1.  **Analyze the Answers:** Review all responses to understand the business, goals, and challenges.
  2.  **Conduct a SWOT Analysis:** Generate a concise SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).
  3.  **Provide Strategic Recommendations:** Based on the analysis, provide clear, actionable recommendations.
  4.  **Language**: The entire output MUST be in the target language: **{{{targetLanguage}}}**.
  5.  **Output Format:** Your entire response must be a valid JSON object matching the defined schema.`,
});

const analyzeBusinessEvaluationFlow = ai.defineFlow(
  {
    name: 'analyzeBusinessEvaluationFlow',
    inputSchema: AnalyzeBusinessEvaluationInputSchema,
    outputSchema: AnalyzeBusinessEvaluationOutputSchema,
  },
  async (input) => {
    // This is a mocked response to prevent API errors.
    console.log(`[Abacus AI Simulation] Running Business Evaluation for language: ${input.targetLanguage}`);
    
    // const abacusModel = getAbacusModelForTask('evaluation');
    // const { output } = await prompt(input, { model: abacusModel });
    
    const mockOutput: AnalyzeBusinessEvaluationOutput = {
      swot: {
        strengths: "Producto estrella (cold brew) con alta demanda potencial y buena reputación local.",
        weaknesses: "Baja presencia de marca en redes sociales y ausencia de un canal de ventas digital directo.",
        opportunities: "Mercado en crecimiento para cafés de especialidad y eventos locales para aumentar visibilidad.",
        threats: "Competencia agresiva de cadenas de cafeterías establecidas en la zona."
      },
      recommendations: `**1. Campaña de Branding Digital:**
- **Objetivo:** Aumentar el reconocimiento de marca y atraer nuevos clientes.
- **Acciones:**
  - Crear contenido visual atractivo en Instagram y Facebook enfocado en el 'cold brew' y el ambiente de la cafetería.
  - Lanzar una campaña de anuncios geolocalizados para llegar a residentes y trabajadores de la zona.
- **Plan Sugerido:** *Impulso Esencial (1 Red)* para empezar.

**2. Implementación de un Funnel de Ventas para Pedidos Grandes:**
- **Objetivo:** Capturar leads para pedidos de pastelería al por mayor o eventos.
- **Acciones:**
  - Desarrollar una landing page sencilla que destaque la oferta para eventos.
  - Configurar un Agente de IA básico para responder preguntas frecuentes y tomar los datos de contacto.
- **Plan Sugerido:** *Setup Funnel*.`
    };

    return mockOutput;
  }
);
