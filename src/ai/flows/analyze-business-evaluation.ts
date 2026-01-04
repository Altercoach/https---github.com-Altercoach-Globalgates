
'use server';

/**
 * @fileOverview Analyzes a business evaluation questionnaire using Google AI.
 *
 * - analyzeBusinessEvaluation - A function that analyzes the questionnaire answers.
 * - AnalyzeBusinessEvaluationInput - The input type for the function.
 * - AnalyzeBusinessEvaluationOutput - The return type for the function.
 */

import { ai, MODEL_BY_TASK } from '@/ai/genkit';
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

const analyzeBusinessEvaluationPrompt = ai.definePrompt({
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
});


const analyzeBusinessEvaluationFlow = ai.defineFlow(
  {
    name: 'analyzeBusinessEvaluationFlow',
    inputSchema: AnalyzeBusinessEvaluationInputSchema,
    outputSchema: AnalyzeBusinessEvaluationOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeBusinessEvaluationPrompt(input, { model: MODEL_BY_TASK.evaluation });
    
    if (!output) {
      console.error("AI failed to generate a business evaluation.", output);
      throw new Error('The AI failed to generate a valid business evaluation.');
    }
    
    return output;
  }
);
