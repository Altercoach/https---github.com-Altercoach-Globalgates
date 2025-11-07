
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// ============================================
// CONFIGURACIÓN DE MODELOS DISPONIBLES
// ============================================

/**
 * OPCIÓN 1: Gemini 1.5 Flash (Experimental) - MÁS RÁPIDO Y RECIENTE
 * - Mejor para: Generación de contenido, análisis rápido, tareas creativas
 * - Velocidad: ⚡⚡⚡⚡⚡ (Muy rápido)
 * - Costo: 💰 (Económico)
 * - Estabilidad: 🟡 (Experimental pero funcional)
 */
export const GEMINI_15_FLASH = 'gemini-1.5-flash';

/**
 * OPCIÓN 2: Gemini 1.5 Pro - MÁS ESTABLE Y POTENTE
 * - Mejor para: Análisis complejos, razonamiento profundo, tareas críticas
 * - Velocidad: ⚡⚡⚡ (Moderado)
 * - Costo: 💰💰💰 (Más costoso)
 * - Estabilidad: 🟢 (Producción ready)
 */
export const GEMINI_15_PRO = 'gemini-1.5-pro';


/**
 * OPCIÓN 3: Imagen 2 - PARA GENERACIÓN DE IMÁGENES
 */
export const IMAGEN_2 = 'imagen-2';


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
 * Obtener modelo específico para tareas pesadas
 */
export function getHeavyModel() {
  return googleAI.model(GEMINI_15_PRO);
}

/**
 * Obtener modelo específico para tareas rápidas
 */
export function getFastModel() {
  return googleAI.model(GEMINI_15_FLASH);
}

// ============================================
// CONFIGURACIÓN DE MODELOS POR TAREA (Simulando Abacus AI)
// ============================================

/**
 * Configuración recomendada de modelos por tipo de tarea,
 * simulando la arquitectura de agentes especializados.
 */
export const MODEL_BY_TASK = {
  // Tareas creativas y de contenido
  imageGeneration: IMAGEN_2, 
  copywriting: getFastModel(),
  socialMedia: getFastModel(),
  
  // Tareas analíticas (Agente Estratégico, de Investigación)
  businessAnalysis: getHeavyModel(),
  dataAnalysis: getHeavyModel(),
  strategicPlanning: getHeavyModel(),
  
  // Tareas conversacionales y de recomendación
  chat: getFastModel(),
  customerService: getFastModel(),
  
  // Tareas de traducción
  translation: getFastModel(),
  
  // Tareas de generación de prompts (meta-programación)
  promptGeneration: getHeavyModel(),
};

/**
 * Obtener modelo recomendado para una tarea específica
 */
export function getModelForTask(task: keyof typeof MODEL_BY_TASK) {
  const modelOrId = MODEL_BY_TASK[task];
  
  if (modelOrId === IMAGEN_2) {
    // El flujo `generate-image-flow` se encargará de llamar a este servicio.
    // Retornamos un modelo de texto rápido como placeholder si se llama desde otro lugar.
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
  console.log('🤖 Genkit AI Configuration (Task-Oriented):');
  console.log(`   Fast Model (Chat, Social): ${GEMINI_15_FLASH}`);
  console.log(`   Heavy Model (Analysis): ${GEMINI_15_PRO}`);
  console.log(`   Image Model: ${IMAGEN_2}`);
}
