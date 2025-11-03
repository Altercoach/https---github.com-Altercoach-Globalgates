
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { SiteData } from './types';

/**
 * Saves the provided site data to the `site-content.ts` file.
 * This is a Server Action and will only run on the server.
 * @param content The SiteData object to save.
 * @returns An object indicating success or failure.
 */
export async function saveSiteContent(content: SiteData): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate the content structure at a high level.
    if (!content || !content.brand || !content.services || !content.products) {
      throw new Error("Invalid site data structure provided.");
    }

    // Convert the live JavaScript object into a TypeScript-formatted string.
    // We use JSON.stringify with an indent of 2 for nice formatting.
    const fileContent = `
import type { SiteData } from '@/lib/types';

export const DEFAULT_SITE_CONTENT: SiteData = ${JSON.stringify(content, null, 2)};
`;

    // Determine the absolute path to the file.
    // process.cwd() gives us the root directory of the Next.js project.
    const filePath = path.join(process.cwd(), 'src', 'lib', 'site-content.ts');
    
    // Write the new content to the file, overwriting it.
    await fs.writeFile(filePath, fileContent, 'utf8');

    return { success: true };
  } catch (error) {
    console.error("Error saving site content:", error);
    // Return a user-friendly error message.
    return { success: false, error: (error as Error).message || 'An unknown error occurred while saving.' };
  }
}
