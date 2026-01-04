
'use server';

/**
 * @fileOverview Analyzes a business evaluation questionnaire using Gemini 1.5 Pro.
 *
 * - analyzeBusinessEvaluation - A function that analyzes the questionnaire answers.
 * - AnalyzeBusinessEvaluationInput - The input type for the function.
 * - AnalyzeBusinessEvaluationOutput - The return type for the function.
 */

import { z } from 'zod';
import { ai, googleAI } from '@/ai/genkit';

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

const analyzeBusinessEvaluationPrompt = ai.definePrompt(
  {
    name: 'analyzeBusinessEvaluationPrompt',
    input: { schema: AnalyzeBusinessEvaluationInputSchema },
    output: { schema: AnalyzeBusinessEvaluationOutputSchema },
    prompt: `You are an expert business consultant named "Business Doctor RX". Your task is to analyze a client's questionnaire answers and provide a comprehensive SWOT analysis and strategic recommendations.

**Rules:**
1.  **Analyze the Answers:** Review all responses to understand the business, goals, and challenges.
2.  **Language**: The entire output MUST be in the target language: {{{targetLanguage}}}.
3.  **Output Format:** Your entire response MUST be a valid JSON object matching the requested output schema. Do not add any text, explanations, or markdown formatting before or after the JSON object.

**Client's Questionnaire Answers (JSON format):**
{{{answersJson}}}
`,
  },
);

export async function analyzeBusinessEvaluation(input: AnalyzeBusinessEvaluationInput): Promise<AnalyzeBusinessEvaluationOutput> {
  console.log("🤖 Calling Gemini 1.5 Pro for Business Evaluation Analysis");
  try {
      const { output } = await analyzeBusinessEvaluationPrompt(input, { 
        model: googleAI.model('gemini-1.5-pro') 
      });
      
      if (!output) {
        throw new Error('AI returned no output.');
      }
      return output;
  } catch (error) {
      console.error("==================== AI RESPONSE ERROR (analyzeBusinessEvaluation) ====================");
      console.error("Failed to get a valid response from Gemini. Error:", error);
      console.error("================================ END OF AI RESPONSE ERROR ================================");
      
      const errorMessage = input.targetLanguage === 'es' 
          ? "No se pudo generar un análisis debido a un error en la respuesta de la IA. Por favor, asegúrese de que el cuestionario esté completo y vuelva a intentarlo."
          : "Could not generate analysis due to an error in the AI's response. Please ensure the questionnaire is complete and try again.";

      return {
          swot: {
              strengths: "Información insuficiente para determinar.",
              weaknesses: "Información insuficiente para determinar.",
              opportunities: "Información insuficiente para determinar.",
              threats: "Información insuficiente para determinar.",
          },
          recommendations: errorMessage,
      };
  }
}
