
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
    image: 'stability-ai/sdxl'
};

/**
 * Runs a text generation model on Replicate using a robust prediction workflow.
 * @param prompt The complete prompt to send to the model.
 * @returns The generated text as a string.
 */
export async function runReplicateText(prompt: string): Promise<string> {
    console.log(`Creating Replicate prediction with model: ${REPLICATE_MODELS.text}`);
    
    try {
        // Step 1: Create the prediction
        const prediction = await replicate.predictions.create({
            version: "0902621f11b3333cfb75143a968c92a2a09540b936d538676233519129598911", // Specific version for meta-llama-3-70b-instruct
            input: {
                prompt: prompt,
                max_new_tokens: 4096,
            },
            // stream: true, // Streaming is an option for real-time output, but complicates JSON parsing.
        });

        console.log(`Prediction started: ${prediction.id}. URL: ${prediction.urls.get}`);

        // Step 2: Wait for the prediction to complete
        const completedPrediction = await replicate.wait(prediction);

        console.log(`Prediction ${completedPrediction.id} finished with status: ${completedPrediction.status}`);

        if (completedPrediction.status === 'succeeded') {
            // The output is an array of strings; we join them to get the full response.
            return (completedPrediction.output as string[]).join('');
        } else if (completedPrediction.status === 'failed' || completedPrediction.status === 'canceled') {
            console.error('Replicate prediction failed or was canceled.', completedPrediction.error);
            throw new Error(`Replicate prediction failed: ${completedPrediction.error}`);
        }
        
        throw new Error(`Unexpected prediction status: ${completedPrediction.status}`);

    } catch (error) {
        console.error("Error running Replicate prediction:", error);
        throw new Error("Failed to execute Replicate text generation.");
    }
}


/**
 * Runs an image generation model on Replicate.
 * @param prompt The prompt for the image generation.
 * @param aspectRatio The desired aspect ratio for the image.
 * @returns The URL of the generated image.
 */
export async function runReplicateImage(prompt: string, aspectRatio: string): Promise<string> {
    console.log(`Running Replicate image generation with model: ${REPLICATE_MODELS.image}`);
    
    const [width, height] = aspectRatio === '1:1' ? [1024, 1024] :
                           aspectRatio === '16:9' ? [1344, 768] :
                           [768, 1344];

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
