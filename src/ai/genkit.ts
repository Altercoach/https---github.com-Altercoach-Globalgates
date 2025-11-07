import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// ============================================
// CONFIGURACIÓN DE MODELOS DISPONIBLES
// ============================================

/**
 * OPCIÓN 1: Gemini 2.0 Flash (Experimental) - MÁS RÁPIDO Y RECIENTE
 * - Mejor para: Generación de contenido, análisis rápido, tareas creativas
 * - Velocidad: ⚡⚡⚡⚡⚡ (Muy rápido)
 * - Costo: 💰 (Económico)
 * - Estabilidad: 🟡 (Experimental pero funcional)
 */
export const GEMINI_2_FLASH = 'gemini-1.5-flash';

/**
 * OPCIÓN 2: Gemini 1.5 Pro - MÁS ESTABLE Y POTENTE
 * - Mejor para: Análisis complejos, razonamiento profundo, tareas críticas
 * - Velocidad: ⚡⚡⚡ (Moderado)
 * - Costo: 💰💰💰 (Más costoso)
 * - Estabilidad: 🟢 (Producción ready)
 */
export const GEMINI_15_PRO = 'gemini-1.5-pro';


/**
 * OPCIÓN 3: Replicate - PARA GENERACIÓN DE IMÁGENES
 * - Se configura en src/lib/image-generation/replicate-service.ts
 */
export const REPLICATE_IMAGE_MODEL = 'replicate';


// ============================================
// MODELO ACTIVO - CAMBIA AQUÍ PARA ALTERNAR
// ============================================

/**
 * 🎯 CONFIGURA AQUÍ EL MODELO QUE QUIERES USAR
 * 
 * Cambia entre:
 * - GEMINI_2_FLASH (recomendado para desarrollo y producción ligera)
 * - GEMINI_15_PRO (recomendado para análisis complejos y producción crítica)
 */
export const ACTIVE_TEXT_MODEL_ID = GEMINI_15_PRO; // 👈 YA ESTÁ CORRECTO

// ============================================
// CONFIGURACIÓN DE GENKIT
// ============================================

export const ai = genkit({
  plugins: [googleAI()],
});

// ============================================
// HELPER PARA OBTENER EL MODELO EN FLUJOS
// ============================================

/**
 * Obtener modelo activo
 */
export function getActiveModel() {
  return googleAI.model(ACTIVE_TEXT_MODEL_ID);
}

/**
 * Obtener modelo específico para tareas pesadas
 */
export function getHeavyModel() {
  return googleAI.model(GEMINI_15_PRO);
}

/**
 * Obtener modelo específico para tareas rápidas
 */
export function getFastModel() {
  return googleAI.model(GEMINI_2_FLASH);
}

// ============================================
// CONFIGURACIÓN DE MODELOS POR TAREA
// ============================================

/**
 * Configuración recomendada de modelos por tipo de tarea
 */
export const MODEL_BY_TASK = {
  // Tareas creativas y de contenido
  imageGeneration: REPLICATE_IMAGE_MODEL, 
  copywriting: getFastModel(),
  socialMedia: getFastModel(),
  
  // Tareas analíticas
  businessAnalysis: getHeavyModel(),
  dataAnalysis: getHeavyModel(),
  strategicPlanning: getHeavyModel(),
  
  // Tareas conversacionales
  chat: getFastModel(),
  customerService: getFastModel(),
  
  // Tareas de traducción
  translation: getFastModel(),
  
  // Tareas de generación de prompts
  promptGeneration: getHeavyModel(),
};

/**
 * Obtener modelo recomendado para una tarea específica
 */
export function getModelForTask(task: keyof typeof MODEL_BY_TASK) {
  const modelOrId = MODEL_BY_TASK[task];
  
  if (modelOrId === REPLICATE_IMAGE_MODEL) {
    // Replicate es un servicio externo, no un modelo de googleAI.
    // El flujo `generate-image-flow` se encargará de llamar a este servicio.
    // Retornamos un modelo de texto rápido como placeholder.
    return getFastModel(); 
  }

  // Si ya es un objeto de modelo, lo retornamos directamente.
  // Si es un ID, creamos la instancia del modelo.
  if (typeof modelOrId === 'object') {
    return modelOrId;
  }
  
  return googleAI.model(modelOrId);
}

// ============================================
// LOGS PARA DEBUGGING
// ============================================

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🤖 Genkit AI Configuration:');
  console.log(`   Active Text Model: ${ACTIVE_TEXT_MODEL_ID}`);
  console.log(`   Active Image Model: ${REPLICATE_IMAGE_MODEL}`);
  console.log(`   Fast Model: ${GEMINI_2_FLASH}`);
  console.log(`   Heavy Model: ${GEMINI_15_PRO}`);
}