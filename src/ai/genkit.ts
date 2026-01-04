
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// ============================================
// CONFIGURACIÓN DE GENKIT Y CLIENTES
// ============================================

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: "v1beta",
    }),
  ],
});

// ============================================
// MAPEO DE MODELOS (Lógica Abstraída)
// ============================================

/**
 * Mapea tareas a modelos de Google.
 * Esta es la fuente de verdad para la selección de modelos en la app.
 */
export const MODEL_BY_TASK = {
  // Text & Logic (usando Google)
  onboarding: 'gemini-1.5-pro-latest',
  evaluation: 'gemini-1.5-pro-latest',
  copywriting: 'gemini-1.5-pro-latest',
  chat: 'gemini-1.5-pro-latest',
  strategic: 'gemini-1.5-pro-latest',

  // Visuals (usando Google)
  imageGeneration: 'imagen-3.0-fast-generate-001', 

  // Analytics (usando Google)
  analytics: 'gemini-1.5-pro-latest',
};


// ============================================
// LOGS PARA DEBUGGING
// ============================================

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🤖 Genkit configured with Google AI model abstraction.');
  console.log(`   Default Text Model: ${MODEL_BY_TASK.chat}`);
  console.log(`   Image Model: ${MODEL_BY_TASK.imageGeneration}`);
}
