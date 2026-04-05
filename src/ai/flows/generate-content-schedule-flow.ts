'use server';

import { z } from 'zod';
import { ai, googleAI } from '@/ai/genkit';

const GenerateContentScheduleInputSchema = z.object({
  clientBusiness: z.string().describe("Description of the client's business and instructions."),
});
export type GenerateContentScheduleInput = z.infer<typeof GenerateContentScheduleInputSchema>;

const ContentPostSchema = z.object({
    postNumber: z.string().describe("Post number, e.g., '1', '2-3'."),
    format: z.string().describe("Format: 'Post fijo', 'Historia', 'Carrusel', 'Video'."),
    topic: z.string().describe("Topic: 'Venta', 'Branding', 'Dato curioso'."),
    copyIn: z.string().describe("Internal creative brief with Title, Subtitle, ideas."),
    copyOut: z.string().describe("Final public caption with hashtags."),
});
export type ContentPost = z.infer<typeof ContentPostSchema>;

const GenerateContentScheduleOutputSchema = z.object({
  posts: z.array(ContentPostSchema).describe("Array of 10-12 content posts."),
});
export type GenerateContentScheduleOutput = z.infer<typeof GenerateContentScheduleOutputSchema>;

const generateContentSchedulePrompt = ai.definePrompt(
  {
    name: 'generateContentSchedulePrompt',
    input: { schema: GenerateContentScheduleInputSchema },
    output: { schema: GenerateContentScheduleOutputSchema },
  },
  `Eres un estratega de contenido de redes sociales de clase mundial. Crea una parrilla de contenido mensual (10-12 posts) para Instagram basada en la información del cliente.

**Tu tarea:**
Crea un calendario diverso de 10-12 publicaciones. Para cada post define:
1. **postNumber**: Número secuencial
2. **format**: Elige entre 'Post fijo', 'Historia', 'Carrusel', 'Video'
3. **topic**: Tema estratégico como 'Venta', 'Branding', 'Interacción', 'Educativo'
4. **copyIn**: Brief creativo interno (Título, Subtítulo, ideas para slides)
5. **copyOut**: Caption final público con 3-4 hashtags relevantes

**CRÍTICO:** Tu respuesta COMPLETA debe ser UN SOLO objeto JSON válido. No agregues texto antes ni después del JSON.

**Información del Cliente:**
{{clientBusiness}}
`
);

export async function generateContentSchedule(input: GenerateContentScheduleInput): Promise<GenerateContentScheduleOutput> {
  console.log("🤖 Llamando a Gemini 1.5 Pro para generar parrilla de contenido");
    try {
        const { output } = await generateContentSchedulePrompt(input, { 
            model: googleAI.model('gemini-1.5-pro') 
        });

        if (!output) {
          throw new Error('La IA no devolvió ninguna respuesta.');
        }
        
        console.log("✅ Parrilla de contenido generada exitosamente");
        return output;
    } catch (error: unknown) {
        console.error("❌ ERROR generando parrilla de contenido:", error instanceof Error ? error.message : String(error));
        throw new Error('La IA devolvió una respuesta en formato inválido.');
    }
}