
import { genkit, Model } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// ============================================
// CONFIGURACIÓN DE GENKIT 
// ============================================

export const ai = genkit({
  plugins: [googleAI()], // Usamos el plugin oficial de Google AI
});

// ============================================
// MAPEO DE MODELOS (Lógica Abstraída)
// ============================================

/**
 * Mapea tareas a modelos reales y estables de Google AI.
 * Esta es la fuente de verdad para la selección de modelos en la app.
 */
export const MODEL_BY_TASK = {
  // Text & Logic
  onboarding: 'gemini-1.5-flash-latest',
  evaluation: 'gemini-1.5-flash-latest', 
  copywriting: 'gemini-1.5-flash-latest',
  chat: 'gemini-1.5-flash-latest',

  // Research & Strategy
  research: 'gemini-1.5-flash-latest',
  strategic: 'gemini-1.5-flash-latest',

  // Visuals
  imageGeneration: 'imagen-2', 
  videoGeneration: 'gemini-1.5-flash-latest', // Placeholder

  // Analytics
  analytics: 'gemini-1.5-flash-latest', // Placeholder
};

/**
 * Obtiene el objeto de modelo de Genkit configurado para una tarea específica.
 * Esta función ahora devuelve un objeto Model en lugar de solo un string.
 */
export function getAbacusModelForTask(task: keyof typeof MODEL_BY_TASK): Model {
  const modelId = MODEL_BY_TASK[task];
  return googleAI.model(modelId);
}

// ============================================
// LOGS PARA DEBUGGING
// ============================================

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🤖 Genkit configured with Abacus model abstraction.');
  console.log(`   Default Text Model: ${MODEL_BY_TASK.chat}`);
  console.log(`   Image Model: ${MODEL_BY_TASK.imageGeneration}`);
}
