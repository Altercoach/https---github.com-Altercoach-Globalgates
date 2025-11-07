
import { genkit } from 'genkit';
import { abacusAI } from './abacus-plugin';

// ============================================
// CONFIGURACIÓN DE GENKIT CON ABACUS AI
// ============================================

export const ai = genkit({
  plugins: [abacusAI()], // Use the custom Abacus AI plugin
});

// ============================================
// HELPER PARA OBTENER EL MODELO EN FLUJOS (Simulando Abacus)
// ============================================

/**
 * Maps task types to specific Abacus AI model names.
 * This aligns with the "Executive Order" vision.
 */
export const MODEL_BY_TASK = {
  // Text & Logic
  onboarding: 'qwen-3',
  evaluation: 'qwen-3',
  copywriting: 'qwen-3',
  chat: 'qwen-3',

  // Research & Strategy
  research: 'deepseek-r1',
  strategic: 'deepseek-r1', // Or map to a future Claude model in Abacus

  // Visuals
  imageGeneration: 'flux-1.1-pro',
  videoGeneration: 'wan-2.1', // Placeholder for future implementation

  // Analytics
  analytics: 'deepseek-r1', // Placeholder

};

/**
 * Gets the recommended Abacus model for a specific task.
 * Note: Genkit automatically prefixes the model name with the plugin name,
 * so we just need to return the model ID.
 */
export function getAbacusModelForTask(task: keyof typeof MODEL_BY_TASK): string {
  return MODEL_BY_TASK[task];
}

// ============================================
// LOGS PARA DEBUGGING
// ============================================

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🤖 Genkit configured with Abacus AI Plugin.');
  console.log(`   Default Text Model (Qwen-3): ${MODEL_BY_TASK.copywriting}`);
  console.log(`   Research Model (DeepSeek): ${MODEL_BY_TASK.research}`);
  console.log(`   Image Model (Flux): ${MODEL_BY_TASK.imageGeneration}`);
}
