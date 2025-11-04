
'use server';
/**
 * @fileOverview A simple chat flow for the AI Agent.
 *
 * - chat - A function that handles the chat interaction.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
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

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You MUST respond in the following language: {{{language}}}

  {{{systemPrompt}}}

  Here is some additional information to use as your knowledge base. Use it as the primary source of truth for your answers. If the information is not here, say you don't know.
  --- KNOWLEDGE BASE ---
  {{{knowledgeBase}}}
  --- END KNOWLEDGE BASE ---

  Here is the conversation history (the last message is the user's current message):
  {{#each history}}
    {{#if isUser}}
      User: {{{content}}}
    {{else}}
      Assistant: {{{content}}}
    {{/if}}
  {{/each}}
  
  Assistant:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    // Augment history with isUser boolean for easier templating
    const augmentedHistory = input.history.map(message => ({
      ...message,
      isUser: message.role === 'user',
    }));

    const { output } = await prompt({ ...input, history: augmentedHistory }, { model: 'gemini-pro' });
    
    if (!output) {
      throw new Error('The AI failed to generate a response.');
    }
    return { response: output.response };
  }
);
