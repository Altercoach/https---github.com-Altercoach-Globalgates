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
  // The 'logLevel' option is from a legacy version and causes initialization errors.
  // Removing it allows the Genkit flows to run correctly.
});

// Export googleAI plugin for direct model reference if needed
export { googleAI };
