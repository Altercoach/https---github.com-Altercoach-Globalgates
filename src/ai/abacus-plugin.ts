
'use client';

import { GenkitError, GenkitPlugin, Model, definePlugin } from '@genkit-ai/core';
import { Abacus } from 'abacus';

// This defines a custom plugin for Genkit to interface with Abacus AI.

interface AbacusAIPluginOptions {
  apiKey?: string;
}

export const abacusAI = definePlugin(
  {
    name: 'abacusAI',
  },
  async (options: AbacusAIPluginOptions): Promise<GenkitPlugin> => {
    const apiKey = options.apiKey || process.env.ABACUS_API_KEY;
    if (!apiKey) {
      throw new GenkitError({
        source: 'abacusAI',
        status: 'INVALID_ARGUMENT',
        message:
          'Abacus AI API key is required. Please provide it in the plugin options or set ABACUS_API_KEY environment variable.',
      });
    }

    const abacus = new Abacus({ apiKey });

    // Define models based on the executive order
    const models: Record<string, Model> = {
      'qwen-3': Model.fromSDK(
        {
          name: 'abacus/qwen-3',
          label: 'Abacus AI - Qwen 3',
          supports: {
            generate: true,
          },
        },
        async (request) => {
          const response = await abacus.generate({
            model: 'qwen-3',
            prompt: request.prompt,
            maxTokens: request.config?.maxTokens,
          });
          // Assuming the response structure has a `text` property
          return {
            text: response.text || '',
          };
        }
      ),
      'deepseek-r1': Model.fromSDK(
        {
          name: 'abacus/deepseek-r1',
          label: 'Abacus AI - DeepSeek R1',
          supports: {
            generate: true,
          },
        },
         async (request) => {
          const response = await abacus.generate({
            model: 'deepseek-r1',
            prompt: request.prompt,
          });
          return {
            text: response.text || '',
          };
        }
      ),
       'flux-1.1-pro': Model.fromSDK(
        {
          name: 'abacus/flux-1.1-pro',
          label: 'Abacus AI - Flux 1.1 Pro',
           supports: {
            media: true,
            generate: true
          },
        },
         async (request) => {
          // This is a placeholder. The actual implementation for image generation
          // might require different parameters and handling.
           const response = await abacus.generate({
            model: 'flux-1.1-pro',
            prompt: request.prompt,
          });
           return {
            media: [
              {
                url: response.imageUrl || '',
                contentType: 'image/png'
              }
            ],
          };
        }
      )
      // Add other models like Claude, Wan, etc. here as needed
    };

    return {
      models: Object.values(models),
    };
  }
);
