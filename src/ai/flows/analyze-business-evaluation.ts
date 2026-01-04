
'use server';

/**
 * @fileOverview Analyzes a business evaluation questionnaire using Replicate.
 *
 * - analyzeBusinessEvaluation - A function that analyzes the questionnaire answers.
 * - AnalyzeBusinessEvaluationInput - The input type for the function.
 * - AnalyzeBusinessEvaluationOutput - The return type for the function.
 */

import { z } from 'zod';
import { runReplicateText } from '@/ai/genkit';

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
  const prompt = `You are an expert business consultant named "Business Doctor RX". Your task is to analyze a client's questionnaire answers and provide a comprehensive SWOT analysis and strategic recommendations.

**Rules:**
1.  **Analyze the Answers:** Review all responses to understand the business, goals, and challenges.
2.  **Language**: The entire output MUST be in the target language: ${input.targetLanguage}.
3.  **Output Format:** Your entire response MUST be a valid JSON object matching the requested output schema. Do not add any text, explanations, or markdown formatting before or after the JSON object.

**Client's Questionnaire Answers (JSON format):**
${input.answersJson}

**IMPORTANT**: Your entire response MUST be a valid JSON object. Do not add any text, explanations, or markdown formatting before or after the JSON object.
`;

    let responseText = '';
    try {
        responseText = await runReplicateText(prompt);

        // Robust JSON parsing
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON object found in the AI response.');
        }
        const jsonString = jsonMatch[0];
        const parsedOutput = JSON.parse(jsonString);

        // Validate the parsed object against the Zod schema
        const validatedOutput = AnalyzeBusinessEvaluationOutputSchema.parse(parsedOutput);
        
        return validatedOutput;

    } catch (error) {
        console.error("==================== AI RESPONSE ERROR (analyzeBusinessEvaluation) ====================");
        console.error("Failed to parse or validate AI output. Error:", error);
        console.error("--------------------------------- Raw AI Response ---------------------------------");
        console.error(responseText);
        console.error("================================ END OF AI RESPONSE ERROR ================================");
        
        // Fallback to a safe, informative error object instead of throwing
        return {
            swot: {
                strengths: "Información insuficiente para determinar.",
                weaknesses: "Información insuficiente para determinar.",
                opportunities: "Información insuficiente para determinar.",
                threats: "Información insuficiente para determinar.",
            },
            recommendations: "No se pudo generar un análisis debido a un error en la respuesta de la IA. Por favor, asegúrese de que el cuestionario esté completo y vuelva a intentarlo. Si el problema persiste, contacte a soporte."
        };
    }
}
