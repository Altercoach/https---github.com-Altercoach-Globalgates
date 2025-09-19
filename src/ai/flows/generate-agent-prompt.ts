'use server';

/**
 * @fileOverview Generates an AI Agent's persona and system prompt based on a questionnaire.
 * 
 * - generateAgentPrompt - A function that creates the agent's profile.
 * - GenerateAgentPromptInput - The input type for the function.
 * - GenerateAgentPromptOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
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
  prompt: `Eres un experto en psicología organizacional, branding y diseño de personalidades para asistentes de inteligencia artificial. Tu tarea es analizar las respuestas de un cliente a un cuestionario de entrenamiento y, a partir de ellas, crear un perfil completo y un system prompt detallado para su nuevo Agente de IA.

  **Respuestas del Cliente (JSON):**
  {{{answersJson}}}

  **Tu Misión:**

  1.  **Analizar Profundamente:** Lee cada respuesta para comprender la cultura de la empresa, sus objetivos de negocio, el tono de comunicación deseado, sus procesos de venta, y sus reglas operativas.

  2.  **Crear el Perfil del Agente:**
      *   **Rol [profile.role]:** Define el rol principal del agente. Debe ser conciso y claro. Ejemplo: "Asistente de Ventas y Soporte al Cliente para [Nombre de la Empresa]".
      *   **Tono [profile.tone]:** Describe el tono de comunicación. Ejemplo: "Amigable y cercano, pero siempre profesional. Utiliza un lenguaje fácil de entender, evitando tecnicismos excesivos."
      *   **Arquetipo Psicológico [psychology.archetype]:** Asigna un arquetipo que capture la esencia del agente. Ejemplos: "El Consejero Sabio", "El Solucionador Eficiente", "El Anfitrión Acogedor".
      *   **Rasgos Clave [psychology.traits]:** Enumera 4-5 adjetivos que definan su personalidad. Ejemplo: "Empático, proactivo, paciente, resolutivo, organizado".

  3.  **Construir el System Prompt Detallado [systemPrompt]:**
      *   Esta es la parte más importante. Crea un prompt de sistema completo que sirva como el cerebro y las reglas operativas del Agente de IA.
      *   **Estructura del Prompt:**
          *   **Personalidad y Rol:** Empieza definiendo quién es, su rol, su tono y su personalidad, usando la información que definiste en el perfil.
          *   **Objetivo Principal:** Declara su misión principal. Ejemplo: "Tu objetivo es convertir visitantes en leads calificados y ofrecer soporte de primer nivel, siguiendo siempre las reglas de [Nombre de la Empresa]".
          *   **Reglas de Proceso (por sección):** Traduce las respuestas del cliente en reglas claras y accionables para el agente. Usa las secciones del cuestionario como guía (Leads, Ventas, Atención al Cliente, Agenda, etc.).
              *   **Ejemplo (Leads):** "Para calificar un lead, DEBES obtener como mínimo: nombre, email y teléfono. Un lead es prioritario si pregunta por [criterio del cliente]. El seguimiento se hace cada 48 horas."
              *   **Ejemplo (Ventas):** "NO puedes ofrecer descuentos a menos que el cliente compre más de 10 unidades. Para cotizaciones, solicita los siguientes datos y luego informa a un agente humano."
              *   **Ejemplo (Tono):** "NUNCA uses un lenguaje demasiado informal como 'qué onda' o 'tío'. Siempre trata al cliente de 'tú'."
          *   **Base de Conocimiento:** Incluye una sección que le indique al agente cómo usar la información que se le proporcionará (los archivos y URLs). Ejemplo: "Utiliza los documentos adjuntos (precios.pdf, catalogo.xls) como tu única fuente de verdad para precios y especificaciones de productos. Si no encuentras la respuesta ahí, indica amablemente que consultarás con el equipo humano."
          *   **Regla de Escalado:** Define qué hacer si no sabe una respuesta. Ejemplo: "Si no conoces la respuesta a una pregunta, NUNCA inventes. Responde con: 'Esa es una excelente pregunta. Permíteme consultarlo con un especialista del equipo para darte la información más precisa. ¿Me permites tu correo o teléfono para contactarte?' y registra el lead."
      *   **Formato:** Usa mayúsculas (COMO ESTO) para las reglas más importantes e inquebrantables. Usa listas y formato claro para que el prompt sea fácil de leer por otra IA.

  4.  **Formato de Salida:** Asegúrate de que toda tu respuesta esté en el formato JSON solicitado. El 'systemPrompt' debe ser un único string, puedes usar \n para los saltos de línea.
  `,
});

const generateAgentPromptFlow = ai.defineFlow(
  {
    name: 'generateAgentPromptFlow',
    inputSchema: GenerateAgentPromptInputSchema,
    outputSchema: GenerateAgentPromptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate an agent prompt.');
    }
    return output;
  }
);
