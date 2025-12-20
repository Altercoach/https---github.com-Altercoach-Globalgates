
import { genkit, Model } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// ============================================
// CONFIGURACIÓN DE GENKIT 
// ============================================

export const ai = genkit({
  plugins: [googleAI()], // Usamos el plugin de Google AI
});

// ============================================
// MAPEO DE MODELOS "ABACUS AI" (Lógica Abstraída)
// ============================================

/**
 * Mapea tareas a modelos reales y estables de Google AI.
 * Esta es la fuente de verdad para la selección de modelos en la app.
 */
export const MODEL_BY_TASK = {
  // Text & Logic
  onboarding: 'gemini-1.5-pro-latest',
  evaluation: 'gemini-1.5-pro-latest', 
  copywriting: 'gemini-1.5-pro-latest',
  chat: 'gemini-1.5-pro-latest',
  strategic: 'gemini-1.5-pro-latest',

  // Visuals
  imageGeneration: 'imagen-3.0-fast-generate-001', 

  // Analytics
  analytics: 'gemini-1.5-pro-latest',
};

/**
 * Obtiene el objeto de modelo de Genkit configurado para una tarea específica.
 * Esta función ahora devuelve un objeto Model en lugar de solo un string.
 * Esta es la implementación de "Abacus AI" que abstrae la selección del modelo.
 */
export function getAbacusModelForTask(task: keyof typeof MODEL_BY_TASK): Model {
  const modelId = MODEL_BY_TASK[task];
  return googleAI.model(modelId);
}

// ============================================
// LOGS PARA DEBUGGING
// ============================================

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🤖 Genkit configured with Abacus AI model abstraction (using Google AI).');
  console.log(`   Default Text Model (Abacus): ${MODEL_BY_TASK.chat}`);
  console.log(`   Image Model (Abacus): ${MODEL_BY_TASK.imageGeneration}`);
}
