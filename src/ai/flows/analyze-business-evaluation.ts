
'use server';

/**
 * @fileOverview Analyzes a business evaluation questionnaire using Abacus AI (Replicate).
 *
 * - analyzeBusinessEvaluation - A function that analyzes the questionnaire answers.
 * - AnalyzeBusinessEvaluationInput - The input type for the function.
 * - AnalyzeBusinessEvaluationOutput - The return type for the function.
 */

import { ai, runReplicateText } from '@/ai/genkit';
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


const analyzeBusinessEvaluationFlow = ai.defineFlow(
  {
    name: 'analyzeBusinessEvaluationFlow',
    inputSchema: AnalyzeBusinessEvaluationInputSchema,
    outputSchema: AnalyzeBusinessEvaluationOutputSchema,
  },
  async (input) => {
    const outputSchemaAsJson = `{
      "swot": {
        "strengths": "The business's strengths.",
        "weaknesses": "The business's weaknesses. If info is missing, ask for it.",
        "opportunities": "The business's opportunities.",
        "threats": "The business's threats. If info is missing, ask for it."
      },
      "recommendations": "Detailed strategic recommendations, including suggested plans based on the analysis. Use markdown for formatting."
    }`;

    const constructedPrompt = `<s>[INST] <<SYS>>
You are an expert business consultant named "Business Doctor RX". Your task is to analyze a client's questionnaire answers and provide a comprehensive SWOT analysis and strategic recommendations.

**Rules:**
1.  **Analyze the Answers:** Review all responses to understand the business, goals, and challenges.
2.  **Language**: The entire output MUST be in the target language: **${input.targetLanguage}**.
3.  **Output Format:** Your entire response MUST be a valid JSON object matching the structure provided below. Do not add any text, explanations, or markdown formatting before or after the JSON object.

**JSON Output Structure:**
${outputSchemaAsJson}
<</SYS>>

**Client's Questionnaire Answers (JSON format):**
${input.answersJson}
[/INST]`;

    const responseText = await runReplicateText(constructedPrompt, 'evaluation');

    try {
        // Find the start and end of the JSON object
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        
        if (jsonStart === -1 || jsonEnd === -1 || jsonStart > jsonEnd) {
            throw new Error("No valid JSON object found in the AI response.");
        }

        const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
        const parsedOutput = JSON.parse(jsonString);

        // Validate the parsed output against the schema
        const validatedOutput = AnalyzeBusinessEvaluationOutputSchema.parse(parsedOutput);
        return validatedOutput;
    } catch (error) {
        console.error("Failed to parse or validate AI output:", error, "Raw response:", responseText);
        throw new Error('The AI returned an invalid response format.');
    }
  }
);
