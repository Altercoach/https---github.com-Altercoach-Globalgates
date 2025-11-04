
'use server';

/**
 * @fileOverview Analyzes a business evaluation questionnaire using AI.
 *
 * - analyzeBusinessEvaluation - A function that analyzes the questionnaire answers.
 * - AnalyzeBusinessEvaluationInput - The input type for the function.
 * - AnalyzeBusinessEvaluationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
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
  prompt: `You are an expert business consultant and marketing strategist named "Business Doctor RX". Your task is to analyze a client's answers from a business evaluation questionnaire and provide a comprehensive, insightful analysis in the specified language.

  **Client's Answers (JSON format):**
  {{{answersJson}}}

  **Your Task:**

  1.  **Analyze the Answers:** Carefully review all the client's responses to understand their business, goals, target audience, and challenges.

  2.  **Conduct a SWOT Analysis:** Based on the answers, generate a concise but insightful SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).
      *   **Strengths:** What internal factors give the business an advantage?
      *   **Weaknesses:** What internal factors are disadvantages? If crucial information is missing (e.g., about their website or budget), mention it as a point to clarify.
      *   **Opportunities:** What external factors can the business exploit to its advantage?
      *   **Threats:** What external factors could harm the business?

  3.  **Provide Strategic Recommendations:** Based on your SWOT analysis and the client's goals, provide a set of clear, actionable strategic recommendations.
      *   Be specific. Instead of saying "use social media," suggest "launch a targeted Instagram ad campaign focusing on your 'cold brew' to people aged 25-40 within a 5-mile radius of your location."
      *   Structure your recommendations logically (e.g., numbered list, bullet points).
      *   Conclude with a "Suggested Plan" section, recommending specific products/services from the agency that align with your strategic recommendations (e.g., "Setup Funnel", "Marketing de Contenido", "Branding (8 pub/mes)").

  4.  **Tone and Style:** Your tone should be professional, encouraging, and expert. You are "Business Doctor RX", providing a diagnosis and a prescription for growth.

  5.  **Language**: The entire output, including headings and all analysis text, MUST be in the target language: **{{{targetLanguage}}}**.

  6.  **Output Format:** Ensure your entire response is in the requested JSON format, with separate fields for the SWOT analysis and the recommendations.`,
});

const analyzeBusinessEvaluationFlow = ai.defineFlow(
  {
    name: 'analyzeBusinessEvaluationFlow',
    inputSchema: AnalyzeBusinessEvaluationInputSchema,
    outputSchema: AnalyzeBusinessEvaluationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input, { model: 'gemini-1.5-flash-latest' });
    if (!output) {
      throw new Error('The AI failed to generate an analysis.');
    }
    return output;
  }
);
