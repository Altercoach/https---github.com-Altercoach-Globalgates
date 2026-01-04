
'use server';

/**
 * @fileOverview Centralized AI configuration for the application.
 * This file configures the AI provider (Replicate) and exports utility
 * functions to run text and image generation models.
 */

import Replicate from 'replicate';

// Initialize the Replicate client with the API token from environment variables.
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Define the models to be used for different tasks.
const REPLICATE_MODELS = {
    text: 'meta/meta-llama-3-70b-instruct',
    image: 'stability-ai/sdxl' // A reliable model for image generation
};

/**
 * Runs a text generation model on Replicate.
 * @param prompt The complete prompt to send to the model.
 * @returns The generated text as a string.
 */
export async function runReplicateText(prompt: string): Promise<string> {
    console.log(`Running Replicate with model: ${REPLICATE_MODELS.text}`);
    
    const output = await replicate.run(REPLICATE_MODELS.text, {
        input: { 
            prompt,
            max_new_tokens: 4096, // Increased to ensure space for JSON
        }
    });

    // The output is an array of strings; we join them to get the full response.
    return Array.isArray(output) ? output.join('') : String(output);
}

/**
 * Runs an image generation model on Replicate.
 * @param prompt The prompt for the image generation.
 * @param aspectRatio The desired aspect ratio for the image.
 * @returns The URL of the generated image.
 */
export async function runReplicateImage(prompt: string, aspectRatio: string): Promise<string> {
    console.log(`Running Replicate image generation with model: ${REPLICATE_MODELS.image}`);
    
    // Note: Aspect ratio handling might need to be adjusted based on the specific model's input format.
    // For sdxl, it's width/height. We'll derive it from the aspect ratio.
    const [width, height] = aspectRatio === '1:1' ? [1024, 1024] :
                           aspectRatio === '16:9' ? [1344, 768] :
                           [768, 1344]; // 9:16 or other vertical

    const output = await replicate.run(REPLICATE_MODELS.image, {
        input: { 
            prompt,
            width,
            height
        }
    });

    if (Array.isArray(output) && output.length > 0) {
        return output[0];
    }
    
    throw new Error('Image generation failed to return a valid URL.');
}
