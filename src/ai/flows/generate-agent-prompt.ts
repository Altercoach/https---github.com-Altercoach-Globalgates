
'use server';

/**
 * @fileOverview Generates an AI Agent's persona and system prompt using Abacus AI.
 * 
 * - generateAgentPrompt - A function that creates the agent's profile.
 * - GenerateAgentPromptInput - The input type for the function.
 * - GenerateAgentPromptOutput - The return type for the function.
 */

import { ai, runReplicateText } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAgentPromptInputSchema = z.object({
  answersJson: z.string().describe('The JSON string representing the agent training questionnaire answers.'),
});
export type GenerateAgentPromptInput = z.infer<typeof GenerateAgentPromptInputSchema>;

const GenerateAgentPromptOutputSchema = z.object({
  profile: z.object({
    role: z.string().describe("The primary role of the agent (e.g., 'Asistente de Ventas y Soporte al Cliente')."),
    tone: z.string().describe("The agent's communication tone (e.g., 'Amigable, servicial y ligeramente informal')."),
  }),
  psychology: z.object({
      archetype: z.string().describe("The agent's archetype (e.g., 'El Guía Experto', 'El Solucionador Eficiente')."),
      traits: z.string().describe("Key personality traits of the agent, separated by commas (e.g., 'Empático, proactivo, paciente, resolutivo')."),
  }),
  systemPrompt: z.string().describe("The detailed system prompt to be used to configure the AI agent, incorporating all the client's rules and data."),
});
export type GenerateAgentPromptOutput = z.infer<typeof GenerateAgentPromptOutputSchema>;


export async function generateAgentPrompt(input: GenerateAgentPromptInput): Promise<GenerateAgentPromptOutput> {
  return generateAgentPromptFlow(input);
}

const generateAgentPromptFlow = ai.defineFlow(
  {
    name: 'generateAgentPromptFlow',
    inputSchema: GenerateAgentPromptInputSchema,
    outputSchema: GenerateAgentPromptOutputSchema,
  },
  async (input) => {
      const outputSchemaAsJson = `{
        "profile": {
          "role": "The primary role of the agent (e.g., 'Asistente de Ventas y Soporte al Cliente').",
          "tone": "The agent's communication tone (e.g., 'Amigable, servicial y ligeramente informal')."
        },
        "psychology": {
          "archetype": "The agent's archetype (e.g., 'El Guía Experto', 'El Solucionador Eficiente').",
          "traits": "Key personality traits of the agent, separated by commas (e.g., 'Empático, proactivo, paciente, resolutivo')."
        },
        "systemPrompt": "The detailed system prompt to be used to configure the AI agent, incorporating all the client's rules and data."
      }`;

      const constructedPrompt = `<s>[INST] <<SYS>>
You are an expert in organizational psychology and AI personality design. Your task is to analyze the client's questionnaire answers to create a complete profile and a detailed system prompt for their new AI Agent.

**Rules:**
1.  **Analyze and Create Profile:** Define the agent's role, tone, psychological archetype, and key personality traits based on the client's answers.
2.  **Build the System Prompt:** Construct a comprehensive system prompt that defines the AI's persona, main objective, process rules (leads, sales, support), knowledge base instructions, and escalation protocols. Use clear, actionable language.
3.  **Output Format:** Your entire response MUST be a valid JSON object matching the structure provided below. Do not add any text, explanations, or markdown formatting before or after the JSON object.

**JSON Output Structure:**
${outputSchemaAsJson}
<</SYS>>

**Client's Questionnaire Answers (JSON format):**
${input.answersJson}
[/INST]`;

      const responseText = await runReplicateText(constructedPrompt, 'strategic');

      try {
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        
        if (jsonStart === -1 || jsonEnd === -1 || jsonStart > jsonEnd) {
            throw new Error("No valid JSON object found in the AI response.");
        }

        const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
        const parsedOutput = JSON.parse(jsonString);

        return GenerateAgentPromptOutputSchema.parse(parsedOutput);
      } catch (error) {
        console.error("Failed to parse or validate AI output for agent prompt:", error, "Raw response:", responseText);
        throw new Error('The AI returned an invalid response format for agent prompt generation.');
      }
  }
);
