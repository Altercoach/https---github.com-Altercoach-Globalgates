/**
 * @fileOverview Centralized AI configuration for the application.
 * This file configures Genkit to use the Google AI provider (Gemini).
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize Genkit with the Google AI plugin
export const ai = genkit({
  plugins: [
    googleAI({
      // Specify the API version if necessary, otherwise it uses the default
    }),
  ],
  // Log level can be 'debug', 'info', 'warn', or 'error'
  logLevel: 'debug',
  // Enable OpenTelemetry for tracing if needed
  // openTelemetry: {
  //   instrumentation: {
  //     // Instrumentation options
  //   },
  // },
});

// Export googleAI plugin for direct model reference if needed
export { googleAI };
