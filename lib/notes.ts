/**
 * Notes file scanning and route generation utilities for Next.js static generation
 */
import { readdirSync, statSync } from 'fs';
import { join, relative, sep, posix } from 'path';

/**
 * Scans all notes files in the specified directory
 * @param baseDir - Optional base directory to scan (defaults to 'public/notes-src')
 * @returns Array of file paths relative to the base directory
 */
export function scanNotesFiles(baseDir: string = 'public/notes-src'): string[] {
  const results: string[] = [];
  
  function scanDirectory(dir: string): void {
    try {
      const entries = readdirSync(dir);
      
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.endsWith('.md')) {
          const relativePath = relative(baseDir, fullPath);
          // Normalize path separators to forward slashes
          const normalizedPath = relativePath.replace(/\\/g, '/');
          results.push(normalizedPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or is inaccessible
      // Return empty array as expected by tests
    }
  }
  
  scanDirectory(baseDir);
  return results.sort();
}

/**
 * Converts a file path to route parameters for Next.js dynamic routing
 * @param filePath - File path relative to the base directory (e.g., "00-journal/2025-08.md")
 * @param baseDir - Optional base directory (defaults to 'public/notes-src')
 * @returns Array of route segments (e.g., ["00-journal", "2025-08"])
 */
export function filePathToRouteParams(filePath: string, baseDir?: string): string[] {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path');
  }
  
  // Check if file has .md extension
  if (!filePath.endsWith('.md')) {
    throw new Error('File path must end with .md extension');
  }
  
  // Check if it's just '.md' with no filename
  if (filePath === '.md') {
    throw new Error('Invalid file path: filename cannot be empty');
  }
  
  // Remove .md extension
  const pathWithoutExtension = filePath.replace(/\.md$/, '');
  
  // Normalize path separators to forward slashes
  const normalizedPath = pathWithoutExtension.replace(/\\/g, '/');
  
  // Split by forward slash and filter out empty segments
  const segments = normalizedPath.split('/').filter(segment => segment.length > 0);
  
  // Check if we have valid segments after processing
  if (segments.length === 0) {
    throw new Error('Invalid file path: no valid segments found');
  }
  
  return segments;
}

/**
 * Generates all note routes for Next.js generateStaticParams
 * @param baseDir - Optional base directory to scan (defaults to 'public/notes-src')
 * @returns Array of objects with slug property containing route segments
 */
export function generateAllNoteRoutes(baseDir: string = 'public/notes-src'): { slug: string[] }[] {
  const noteFiles = scanNotesFiles(baseDir);
  
  return noteFiles.map(filePath => ({
    slug: filePathToRouteParams(filePath, baseDir)
  }));
}

/**
 * Converts route parameters back to file path
 * @param params - Array of route segments (e.g., ["00-journal", "2025-08"])
 * @param baseDir - Optional base directory (defaults to 'public/notes-src')
 * @returns File path relative to the base directory (e.g., "00-journal/2025-08.md")
 */
export function routeParamsToFilePath(params: string[], baseDir: string = 'public/notes-src'): string {
  if (!params || !Array.isArray(params) || params.length === 0) {
    throw new Error('Invalid route parameters');
  }
  
  // Check for empty segments
  if (params.some(param => !param || typeof param !== 'string' || param.trim() === '')) {
    throw new Error('Invalid route parameters: empty segments not allowed');
  }
  
  // Join parameters with forward slashes and add .md extension
  const filePath = params.join('/') + '.md';
  
  return filePath;
}