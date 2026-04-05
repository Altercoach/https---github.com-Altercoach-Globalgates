
'use server';
/**
 * @fileOverview A simple chat flow for the AI Agent, using Gemini 1.5 Pro.
 *
 * - chat - A function that handles the chat interaction.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { z } from 'zod';
import { ai, googleAI } from '@/ai/genkit';

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


const chatPrompt = ai.definePrompt(
  {
    name: 'chatPrompt',
    input: { schema: ChatInputSchema },
    output: { schema: ChatOutputSchema },
    prompt: `{{#if systemPrompt}}
<<SYS>>
{{{systemPrompt}}}

You MUST respond in the following language: {{{language}}}.

Here is some additional information to use as your knowledge base. Use it as the primary source of truth for your answers. If the information is not here, say you don't know.
--- KNOWLEDGE BASE ---
{{{knowledgeBase}}}
--- END KNOWLEDGE BASE ---
<</SYS>>
{{/if}}

{{#each history}}
  {{#ifEquals role 'user'}}
    [INST] {{{content}}} [/INST]
  {{/ifEquals}}
  {{#ifEquals role 'model'}}
    {{{content}}}
  {{/ifEquals}}
{{/each}}
`,
  }
);


export async function chat(input: ChatInput): Promise<ChatOutput> {
    console.log("🤖 Calling Gemini 1.5 Pro for Chat");
    try {
        const { output } = await chatPrompt(input, { 
            model: googleAI.model('gemini-1.5-pro') 
        });

        if (!output) {
          throw new Error('AI returned no output.');
        }
        return output;

    } catch (error) {
        console.error("Error in chat flow:", error);
        const fallbackByLanguage: Record<string, string> = {
          es: 'En este momento nuestro asistente IA esta temporalmente no disponible por configuracion del servidor. Si gustas, te puedo ayudar con informacion de planes y te contactamos por WhatsApp o correo.',
          en: 'Our AI assistant is temporarily unavailable due to a server configuration issue. I can still help with plan information and arrange follow-up by WhatsApp or email.',
          fr: 'Notre assistant IA est temporairement indisponible en raison d\'une configuration serveur. Je peux quand meme vous aider avec les informations sur les offres et organiser un suivi par WhatsApp ou e-mail.',
        };

        return {
          response: fallbackByLanguage[input.language] || fallbackByLanguage.en,
        };
    }
}
