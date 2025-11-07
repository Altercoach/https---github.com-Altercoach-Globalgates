
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// ============================================
// CONFIGURACIÓN DE GENKIT 
// ============================================

export const ai = genkit({
  plugins: [googleAI()], // Usamos el plugin oficial de Google AI
});

// ============================================
// HELPER PARA OBTENER EL MODELO SEGÚN LA TAREA (Simulando la lógica de Abacus)
// ============================================

/**
 * Mapea los nombres de modelo de la "Orden Ejecutiva" a modelos reales de Google AI.
 * Esto centraliza la lógica de selección de IA.
 */
export const MODEL_BY_TASK = {
  // Text & Logic
  onboarding: 'gemini-1.5-flash-latest',
  evaluation: 'gemini-1.5-pro-latest', // Tarea más compleja
  copywriting: 'gemini-1.5-flash-latest',
  chat: 'gemini-1.5-flash-latest',

  // Research & Strategy
  research: 'gemini-1.5-pro-latest',
  strategic: 'gemini-1.5-pro-latest',

  // Visuals
  imageGeneration: 'imagen-2', // Modelo de generación de imágenes
  videoGeneration: 'gemini-1.5-pro-latest', // Placeholder para futura implementación

  // Analytics
  analytics: 'gemini-1.5-pro-latest', // Placeholder
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
  console.log('🤖 Genkit configured with Google AI Plugin (simulating Abacus architecture).');
  console.log(`   Text Model (Flash): ${MODEL_BY_TASK.copywriting}`);
  console.log(`   Strategic Model (Pro): ${MODEL_BY_TASK.strategic}`);
  console.log(`   Image Model (Imagen): ${MODEL_BY_TASK.imageGeneration}`);
}
