/**
 * Servicio de Generación de Imágenes con Replicate
 * 
 * VENTAJAS:
 * - Créditos gratis para empezar
 * - Pay-per-use (solo pagas lo que usas)
 * - ~$0.003 por imagen (muy económico)
 * - Múltiples modelos de calidad profesional
 * 
 * SETUP:
 * 1. Crear cuenta: https://replicate.com
 * 2. Obtener API token: https://replicate.com/account/api-tokens
 * 3. Agregar a .env.local: REPLICATE_API_TOKEN=r8_xxx
 */

import Replicate from 'replicate';

// ============================================
// CONFIGURACIÓN DE MODELOS DISPONIBLES
// ============================================

export const REPLICATE_MODELS = {
  // 🆓 GRATIS - Muy rápido, buena calidad
  FLUX_SCHNELL: {
    id: 'black-forest-labs/flux-schnell',
    cost: 0, // GRATIS
    speed: '⚡⚡⚡⚡⚡',
    quality: '⭐⭐⭐⭐',
    description: 'Modelo rápido y gratuito, ideal para desarrollo',
  },
  
  // 💰 ECONÓMICO - Mejor calidad
  SDXL: {
    id: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    cost: 0.003, // $0.003 por imagen
    speed: '⚡⚡⚡⚡',
    quality: '⭐⭐⭐⭐⭐',
    description: 'Excelente balance calidad/precio',
  },
  
  // 💎 PREMIUM - Máxima calidad
  FLUX_PRO: {
    id: 'black-forest-labs/flux-pro',
    cost: 0.055, // $0.055 por imagen
    speed: '⚡⚡⚡',
    quality: '⭐⭐⭐⭐⭐⭐',
    description: 'Calidad profesional máxima',
  },
};

// ============================================
// CONFIGURACIÓN ACTIVA
// ============================================

/**
 * 🎯 MODELO ACTIVO - Cambia aquí según tu necesidad
 * 
 * Para desarrollo: FLUX_SCHNELL (gratis)
 * Para producción: SDXL (económico y de calidad)
 * Para clientes premium: FLUX_PRO (máxima calidad)
 */
export const ACTIVE_IMAGE_MODEL = REPLICATE_MODELS.FLUX_SCHNELL; // 👈 CAMBIA AQUÍ

// ============================================
// INTERFAZ DEL SERVICIO
// ============================================

export interface ImageGenerationOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numOutputs?: number;
  model?: keyof typeof REPLICATE_MODELS;
}

export interface GeneratedImage {
  url: string;
  width: number;
  height: number;
  model: string;
  cost: number;
  timestamp: Date;
}

// ============================================
// SERVICIO PRINCIPAL
// ============================================

class ReplicateImageService {
  private client: Replicate | null = null;
  private isConfigured = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const apiToken = process.env.REPLICATE_API_TOKEN;
    
    if (!apiToken || apiToken === 'r8_tu_token_aqui') {
      console.warn('⚠️ REPLICATE_API_TOKEN no configurado. Usando modo placeholder.');
      this.isConfigured = false;
      return;
    }

    try {
      this.client = new Replicate({
        auth: apiToken,
      });
      this.isConfigured = true;
      console.log('✅ Replicate configurado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Replicate:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Genera una imagen usando Replicate
   */
  async generateImage(options: ImageGenerationOptions): Promise<GeneratedImage> {
    // Si no está configurado, retornar placeholder
    if (!this.isConfigured || !this.client) {
      return this.generatePlaceholder(options);
    }

    try {
      const model = options.model 
        ? REPLICATE_MODELS[options.model] 
        : ACTIVE_IMAGE_MODEL;

      console.log(`🎨 Generando imagen con ${model.id}`);

      const output = await this.client.run(
        model.id as `${string}/${string}`,
        {
          input: {
            prompt: options.prompt,
            negative_prompt: options.negativePrompt || 
              'low quality, blurry, distorted, watermark, text, logo',
            width: options.width || 1024,
            height: options.height || 1024,
            num_outputs: options.numOutputs || 1,
            guidance_scale: 7.5,
            num_inference_steps: 30,
          },
        }
      );

      // Replicate retorna un array de URLs
      const imageUrl = Array.isArray(output) ? output[0] : output;

      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error('La respuesta de Replicate no contiene una URL de imagen válida.');
      }

      return {
        url: imageUrl as string,
        width: options.width || 1024,
        height: options.height || 1024,
        model: model.id,
        cost: model.cost,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('❌ Error generando imagen con Replicate:', error);
      
      // Si falla, retornar placeholder
      return this.generatePlaceholder(options);
    }
  }

  /**
   * Genera un placeholder cuando no está configurado o falla
   */
  private generatePlaceholder(options: ImageGenerationOptions): GeneratedImage {
    const width = options.width || 1024;
    const height = options.height || 1024;
    const text = encodeURIComponent(
      options.prompt.substring(0, 100).replace(/\s+/g, '+')
    );
    
    const placeholderUrl = `https://placehold.co/${width}x${height}/4F46E5/white?text=${text}&font=montserrat`;

    console.log('📦 Usando placeholder (Replicate no configurado o falló).');

    return {
      url: placeholderUrl,
      width,
      height,
      model: 'placeholder',
      cost: 0,
      timestamp: new Date(),
    };
  }

  /**
   * Verifica si el servicio está configurado
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Obtiene información del modelo activo
   */
  getActiveModelInfo() {
    return ACTIVE_IMAGE_MODEL;
  }
}

// ============================================
// EXPORTAR INSTANCIA SINGLETON
// ============================================

export const replicateImageService = new ReplicateImageService();
