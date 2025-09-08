/**
 * Notes file scanning and route generation utilities for Next.js static generation
 */
import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { decodePathSegment } from './path-utils';

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
    } catch {
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
 * @returns Array of route segments (e.g., ["00-journal", "2025-08"])
 */
export function filePathToRouteParams(filePath: string): string[] {
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
    slug: filePathToRouteParams(filePath)
  }));
}

/**
 * Converts route parameters back to file path with URL decoding support
 * @param params - Array of route segments (e.g., ["00-journal", "2025-08"] or ["20-area", "Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A"])
 * @returns File path relative to the base directory (e.g., "00-journal/2025-08.md" or "20-area/Arlo The Deer 角色設定.md")
 */
export function routeParamsToFilePath(params: string[]): string {
  if (!params || !Array.isArray(params) || params.length === 0) {
    throw new Error('Invalid route parameters');
  }
  
  // Decode each URL-encoded parameter segment
  const decodedParams = params.map(param => {
    if (!param || typeof param !== 'string' || param.trim() === '') {
      throw new Error('Invalid route parameters: empty segments not allowed');
    }
    
    try {
      // Decode URL-encoded characters (e.g., %20 -> space, Chinese characters)
      return decodePathSegment(param);
    } catch {
      // If decoding fails, use original parameter
      return param;
    }
  });
  
  // Join parameters with forward slashes and add .md extension
  const filePath = decodedParams.join('/') + '.md';
  
  return filePath;
}