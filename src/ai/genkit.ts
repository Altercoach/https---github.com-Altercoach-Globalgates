
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
export const GEMINI_2_FLASH = 'gemini-2.0-flash-exp';

/**
 * OPCIÓN 2: Gemini 1.5 Pro - MÁS ESTABLE Y POTENTE
 * - Mejor para: Análisis complejos, razonamiento profundo, tareas críticas
 * - Velocidad: ⚡⚡⚡ (Moderado)
 * - Costo: 💰💰💰 (Más costoso)
 * - Estabilidad: 🟢 (Producción ready)
 */
export const GEMINI_15_PRO = 'gemini-1.5-pro';


/**
 * OPCIÓN 3: Imagen 4 - PARA GENERACIÓN DE IMÁGENES
 * - Mejor para: Creación de recursos visuales a partir de texto.
 */
export const IMAGEN_4 = 'imagen-4.0-fast-generate-001';


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
export const ACTIVE_MODEL_ID = GEMINI_15_PRO; // 👈 CAMBIA AQUÍ

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
  return googleAI.model(ACTIVE_MODEL_ID);
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
  contentGeneration: googleAI.model(IMAGEN_4), // Corrected to use the image model
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
  return MODEL_BY_TASK[task];
}

// ============================================
// LOGS PARA DEBUGGING
// ============================================

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🤖 Genkit AI Configuration:');
  console.log(`   Active Model: ${ACTIVE_MODEL_ID}`);
  console.log(`   Fast Model: ${GEMINI_2_FLASH}`);
  console.log(`   Heavy Model: ${GEMINI_15_PRO}`);
}
