
import { GenkitError, GenkitPlugin, Model, definePlugin } from '@genkit-ai/core';
import { Abacus } from 'abacus';

interface AbacusAIPluginOptions {
  apiKey?: string;
}

export const abacusAI = (options: AbacusAIPluginOptions = {}) => {
  return definePlugin(
    {
      name: 'abacusAI',
    },
    async (): Promise<GenkitPlugin> => {
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
              prompt: request.prompt as string, // Cast prompt to string
              maxTokens: request.config?.maxTokens,
            });
            return {
              candidates: [
                {
                  message: {
                    content: [{ text: response.text || '' }],
                    role: 'model',
                  },
                  finishReason: 'stop',
                  index: 0,
                },
              ],
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
              prompt: request.prompt as string,
            });
             return {
              candidates: [
                {
                  message: {
                    content: [{ text: response.text || '' }],
                    role: 'model',
                  },
                  finishReason: 'stop',
                  index: 0,
                },
              ],
            };
          }
        ),
        'flux-1.1-pro': Model.fromSDK(
          {
            name: 'abacus/flux-1.1-pro',
            label: 'Abacus AI - Flux 1.1 Pro',
            supports: {
              media: true,
              generate: true,
            },
          },
          async (request) => {
            const response = await abacus.generate({
              model: 'flux-1.1-pro',
              prompt: request.prompt as string,
            });
            return {
              candidates: [
                {
                  message: {
                    content: [
                      {
                        media: {
                          url: response.imageUrl || '',
                          contentType: 'image/png',
                        },
                      },
                    ],
                    role: 'model',
                  },
                  finishReason: 'stop',
                  index: 0,
                },
              ],
            };
          }
        ),
      };

      return {
        models: Object.values(models),
      };
    }
  );
};
