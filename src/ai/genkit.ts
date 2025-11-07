
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// ============================================
// CONFIGURACIÓN DE GENKIT 
// ============================================

export const ai = genkit({
  plugins: [googleAI()], // Usamos el plugin oficial de Google AI
});

// ============================================
// MAPEO DE MODELOS (Lógica Simplificada)
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
  imageGeneration: 'imagen-2', // Modelo de generación de imágenes
  videoGeneration: 'gemini-1.5-flash-latest', // Placeholder para futura implementación

  // Analytics
  analytics: 'gemini-1.5-flash-latest', // Placeholder
};

/**
 * Obtiene el ID del modelo de Google AI recomendado para una tarea específica.
 * Genkit antepone automáticamente 'googleai/' al nombre del modelo.
 */
export function getAbacusModelForTask(task: keyof typeof MODEL_BY_TASK): string {
  return MODEL_BY_TASK[task];
}

// ============================================
// LOGS PARA DEBUGGING
// ============================================

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🤖 Genkit configured with simplified Google AI model mapping.');
  console.log(`   Default Text Model: ${MODEL_BY_TASK.chat}`);
  console.log(`   Image Model: ${MODEL_BY_TASK.imageGeneration}`);
}
