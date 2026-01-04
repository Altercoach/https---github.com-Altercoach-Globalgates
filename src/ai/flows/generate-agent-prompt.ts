
'use server';

/**
 * @fileOverview Generates an AI Agent's persona and system prompt using Replicate.
 * 
 * - generateAgentPrompt - a function that creates the agent's profile.
 * - GenerateAgentPromptInput - The input type for the function.
 * - GenerateAgentPromptOutput - The return type for the function.
 */

import { z } from 'zod';
import { runReplicateText } from '@/ai/genkit';

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
  
  const systemPrompt = `You are an expert in organizational psychology and AI personality design. Your task is to analyze the client's questionnaire answers to create a complete profile and a detailed system prompt for their new AI Agent.

**Rules:**
1.  **Analyze and Create Profile:** Define the agent's role, tone, psychological archetype, and key personality traits based on the client's answers.
2.  **Build the System Prompt:** Construct a comprehensive system prompt that defines the AI's persona, main objective, process rules (leads, sales, support), knowledge base instructions, and escalation protocols. Use clear, actionable language.
3.  **Output Format:** Your entire response MUST be a valid JSON object matching the requested output schema. Do not add any text, explanations, or markdown formatting before or after the JSON object.
`;

    const userPrompt = `**Client's Questionnaire Answers (JSON format):**
${input.answersJson}

**IMPORTANT**: Your entire response MUST be a valid JSON object. Do not add any text, explanations, or markdown formatting before or after the JSON object.`;

    const constructedPrompt = `<s>[INST] <<SYS>>
${systemPrompt}
<</SYS>>

${userPrompt} [/INST]`;
    
    let responseText = '';
    try {
        responseText = await runReplicateText(constructedPrompt);

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON object found in the AI response.');
        }
        const jsonString = jsonMatch[0];
        const parsedOutput = JSON.parse(jsonString);
        
        const validatedOutput = GenerateAgentPromptOutputSchema.parse(parsedOutput);
        
        return validatedOutput;

    } catch (error) {
        console.error("==================== AI RESPONSE ERROR (generateAgentPrompt) ====================");
        console.error("Failed to parse or validate AI output. Error:", error);
        console.error("--------------------------------- Raw AI Response ---------------------------------");
        console.error(responseText);
        console.error("================================ END OF AI RESPONSE ERROR ================================");
        throw new Error('The AI returned an invalid response format.');
    }
}
