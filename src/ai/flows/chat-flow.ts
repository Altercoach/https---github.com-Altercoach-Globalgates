
'use server';
/**
 * @fileOverview A simple chat flow for the AI Agent, using Abacus AI.
 *
 * - chat - A function that handles the chat interaction.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai, getAbacusModelForTask } from '@/ai/genkit';
import { z } from 'genkit';

const ChatHistorySchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(ChatHistorySchema).describe("The conversation history."),
  systemPrompt: z.string().describe("The master prompt that defines the AI agent's persona and rules."),
  knowledgeBase: z.string().describe("Additional information the agent can use as a source of truth."),
  language: z.string().describe("The language for the response (e.g., 'es', 'en', 'fr')."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI agent's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const abacusModel = getAbacusModelForTask('chat');
    
    // Create a simplified prompt history without complex helpers
    const simpleHistory = input.history
      .map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
      .join('\n');

    // Manually construct the prompt string
    const constructedPrompt = `You MUST respond in the following language: ${input.language}

${input.systemPrompt}

Here is some additional information to use as your knowledge base. Use it as the primary source of truth for your answers. If the information is not here, say you don't know.
--- KNOWLEDGE BASE ---
${input.knowledgeBase}
--- END KNOWLEDGE BASE ---

Here is the conversation history (the last message is the user's current message):
${simpleHistory}

Assistant:`;

    const { output } = await ai.generate({
      model: abacusModel,
      prompt: constructedPrompt,
      output: { schema: ChatOutputSchema },
    });
    
    if (!output) {
      throw new Error('The AI failed to generate a response.');
    }

    return output;
  }
);
