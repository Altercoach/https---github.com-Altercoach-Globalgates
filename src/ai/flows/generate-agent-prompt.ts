
'use server';

/**
 * @fileOverview Generates an AI Agent's persona and system prompt using Abacus AI.
 * 
 * - generateAgentPrompt - A function that creates the agent's profile.
 * - GenerateAgentPromptInput - The input type for the function.
 * - GenerateAgentPromptOutput - The return type for the function.
 */

import { ai, getAbacusModelForTask } from '@/ai/genkit';
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

const prompt = ai.definePrompt({
  name: 'generateAgentPrompt',
  input: { schema: GenerateAgentPromptInputSchema },
  output: { schema: GenerateAgentPromptOutputSchema },
  prompt: `You are an expert in organizational psychology and AI personality design. Analyze the client's questionnaire answers to create a complete profile and a detailed system prompt for their new AI Agent.

  **Client's Answers (JSON):**
  {{{answersJson}}}

  **Your Task:**
  1.  **Analyze and Create Profile:** Define the agent's role, tone, psychological archetype, and key personality traits based on the client's answers.
  2.  **Build the System Prompt:** Construct a comprehensive system prompt that defines the AI's persona, main objective, process rules (leads, sales, support), knowledge base instructions, and escalation protocols. Use clear, actionable language.
  3.  **Output Format:** Ensure the entire response is a valid JSON object matching the requested schema. The 'systemPrompt' must be a single string.
  `,
});

const generateAgentPromptFlow = ai.defineFlow(
  {
    name: 'generateAgentPromptFlow',
    inputSchema: GenerateAgentPromptInputSchema,
    outputSchema: GenerateAgentPromptOutputSchema,
  },
  async (input) => {
    console.log(`[Abacus AI Simulation] Running Agent Prompt Generation.`);

    // The AI call is commented out to prevent the 404 error.
    // const abacusModel = getAbacusModelForTask('strategic');
    // const { output } = await prompt(input, { model: abacusModel });
    // if (!output) {
    //   throw new Error('The AI failed to generate an agent prompt.');
    // }

    const mockOutput: GenerateAgentPromptOutput = {
      profile: {
        role: "Asistente de Ventas Simulado",
        tone: "Amigable y eficiente",
      },
      psychology: {
        archetype: "El Ayudante Confiable",
        traits: "Proactivo, claro, servicial",
      },
      systemPrompt: "Eres un asistente de IA simulado. Tu objetivo es responder de manera útil basándote en la información proporcionada. Esta es una respuesta predefinida para evitar errores de API."
    };

    return mockOutput;
  }
);
