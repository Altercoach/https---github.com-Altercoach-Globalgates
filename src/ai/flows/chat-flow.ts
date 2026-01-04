
'use server';
/**
 * @fileOverview A simple chat flow for the AI Agent, using Replicate.
 *
 * - chat - A function that handles the chat interaction.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { z } from 'zod';
import { runReplicateText } from '@/ai/genkit';

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
    const lastUserMessage = input.history.slice(-1)[0]?.content || '';
    
    // LLaMA3 prompt format
    const constructedPrompt = `<s>[INST] <<SYS>>
${input.systemPrompt}

You MUST respond in the following language: ${input.language}.

Here is some additional information to use as your knowledge base. Use it as the primary source of truth for your answers. If the information is not here, say you don't know.
--- KNOWLEDGE BASE ---
${input.knowledgeBase}
--- END KNOWLEDGE BASE ---
<</SYS>>

${lastUserMessage} [/INST]`;

    try {
        const text = await runReplicateText(constructedPrompt);
        
        if (!text) {
            throw new Error('The AI (Replicate) failed to generate a response.');
        }

        return { response: text };

    } catch (error) {
        console.error("Error in chat flow:", error);
        throw new Error('Failed to get a response from the AI.');
    }
}
