
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import Replicate from 'replicate';

// ============================================
// CONFIGURACIÓN DE GENKIT Y CLIENTES
// ============================================

export const ai = genkit({
  plugins: [googleAI()], // Mantenemos Google AI para futuras herramientas, pero no como default para texto.
});

// Cliente de Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// ============================================
// MAPEO DE MODELOS "ABACUS AI" (Lógica Abstraída)
// ============================================

/**
 * Mapea tareas a modelos de Replicate y Google.
 * Esta es la fuente de verdad para la selección de modelos en la app.
 */
export const MODEL_BY_TASK = {
  // Text & Logic (usando Replicate)
  onboarding: 'meta/meta-llama-3-70b-instruct',
  evaluation: 'meta/meta-llama-3-70b-instruct',
  copywriting: 'meta/meta-llama-3-70b-instruct',
  chat: 'meta/meta-llama-3-70b-instruct',
  strategic: 'meta/meta-llama-3-70b-instruct',

  // Visuals (usando Replicate)
  imageGeneration: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b', 

  // Analytics (usando Google por si se necesita en un futuro)
  analytics: 'gemini-1.5-pro-latest',
};


/**
 * Ejecuta una predicción de texto usando Replicate.
 * @param prompt El prompt a enviar al modelo.
 * @param modelId El ID del modelo de Replicate a usar.
 * @returns El texto generado.
 */
export async function runReplicateText(prompt: string, modelId: keyof typeof MODEL_BY_TASK): Promise<string> {
    const model = MODEL_BY_TASK[modelId] as any;
    console.log(`Running Replicate with model: ${model}`);
    
    const output = await replicate.run(model, {
        input: { prompt }
    });

    if (typeof output === 'string') {
        return output;
    }
    if (Array.isArray(output)) {
        return output.join('');
    }
    return JSON.stringify(output);
}


// ============================================
// LOGS PARA DEBUGGING
// ============================================

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🤖 Genkit configured with Abacus AI model abstraction (using Replicate).');
  console.log(`   Default Text Model (Abacus): ${MODEL_BY_TASK.chat}`);
  console.log(`   Image Model (Abacus): ${MODEL_BY_TASK.imageGeneration}`);
}
