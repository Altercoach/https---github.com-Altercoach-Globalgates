import { genkit, Model } from 'genkit';
import { replicate } from '@genkit-ai/replicate';

// ============================================
// CONFIGURACIÓN DE GENKIT 
// ============================================

export const ai = genkit({
  plugins: [replicate()], // Usamos el plugin de Replicate
});

// ============================================
// MAPEO DE MODELOS "ABACUS AI" (Lógica Abstraída)
// ============================================

/**
 * Mapea tareas a modelos reales y estables de Replicate.
 * Esta es la fuente de verdad para la selección de modelos en la app.
 */
export const MODEL_BY_TASK = {
  // Text & Logic
  onboarding: 'meta/llama-2-70b-chat',
  evaluation: 'meta/llama-2-70b-chat', 
  copywriting: 'meta/llama-2-70b-chat',
  chat: 'meta/llama-2-70b-chat',

  // Research & Strategy
  research: 'meta/llama-2-70b-chat',
  strategic: 'meta/llama-2-70b-chat',

  // Visuals
  imageGeneration: 'stability-ai/sdxl', 

  // Analytics
  analytics: 'meta/llama-2-70b-chat',
};

/**
 * Obtiene el objeto de modelo de Genkit configurado para una tarea específica.
 * Esta función ahora devuelve un objeto Model en lugar de solo un string.
 * Esta es la implementación de "Abacus AI" que abstrae la selección del modelo.
 */
export function getAbacusModelForTask(task: keyof typeof MODEL_BY_TASK): Model {
  const modelId = MODEL_BY_TASK[task];
  return replicate.model(modelId);
}

// ============================================
// LOGS PARA DEBUGGING
// ============================================

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🤖 Genkit configured with Abacus AI model abstraction (using Replicate).');
  console.log(`   Default Text Model (Abacus): ${MODEL_BY_TASK.chat}`);
  console.log(`   Image Model (Abacus): ${MODEL_BY_TASK.imageGeneration}`);
}
