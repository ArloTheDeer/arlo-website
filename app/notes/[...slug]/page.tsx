import { generateAllNoteRoutes, routeParamsToFilePath } from '@/lib/notes';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Security: whitelist of allowed base directories
const ALLOWED_BASE_DIRS = ['public/notes-src', '__tests__/fixtures/notes'];

/**
 * Validate and resolve base directory path
 */
function validateBaseDir(baseDir: string): string {
  const normalizedPath = resolve(baseDir);
  const isAllowed = ALLOWED_BASE_DIRS.some(allowed => 
    normalizedPath === resolve(allowed) ||
    normalizedPath.startsWith(resolve(allowed) + '/')
  );
  
  if (!isAllowed) {
    throw new Error(`Invalid base directory. Allowed directories: ${ALLOWED_BASE_DIRS.join(', ')}`);
  }
  
  return normalizedPath;
}

/**
 * Generate static params for all note routes with configurable base directory
 * Used primarily for testing
 */
export async function generateStaticParamsWithBaseDir(baseDir: string): Promise<{ slug: string[] }[]> {
  const validatedBaseDir = validateBaseDir(baseDir);
  return generateAllNoteRoutes(validatedBaseDir);
}

/**
 * Generate static params for all note routes
 * Used by Next.js for static generation
 */
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  try {
    // In production, always use the default notes directory
    const baseDir = 'public/notes-src';
    return generateStaticParamsWithBaseDir(baseDir);
  } catch (error) {
    // Return empty array if scanning fails to prevent build errors
    console.warn('Failed to generate static params:', error);
    return [];
  }
}

/**
 * Read note content from file system
 */
export function readNoteContent(filePath: string, baseDir: string = 'public/notes-src'): string {
  const validatedBaseDir = validateBaseDir(baseDir);
  const fullPath = resolve(validatedBaseDir, filePath);
  
  // Additional security: ensure the resolved path is still within the base directory
  if (!fullPath.startsWith(validatedBaseDir)) {
    throw new Error('Path traversal attempt detected');
  }
  
  try {
    return readFileSync(fullPath, 'utf-8');
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error('Note file not found');
    }
    throw error;
  }
}

/**
 * Note page component
 */
interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

/**
 * Note page component with configurable base directory
 */
export default async function NotesPage({ 
  params,
  baseDir = 'public/notes-src'
}: NotesPageProps & { baseDir?: string }) {
  const { slug } = await params;
  
  try {
    // Convert route parameters to file path
    const filePath = routeParamsToFilePath(slug);
    
    // Read note content with validated base directory
    const content = readNoteContent(filePath, baseDir);
    
    // Extract title from content (first # line)
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : slug[slug.length - 1];
    
    // Split content into lines and process
    const lines = content.split('\n');
    const bodyLines = lines.slice(1).filter(line => line.trim() !== '');
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        <div className="prose max-w-none">
          {bodyLines.map((line, index) => {
            if (line.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-semibold mt-8 mb-4">{line.replace(/^## /, '')}</h2>;
            } else if (line.startsWith('- ')) {
              return <li key={index} className="ml-4">{line.replace(/^- /, '')}</li>;
            } else {
              return <p key={index} className="mb-4">{line}</p>;
            }
          })}
        </div>
      </div>
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Note file not found') {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Note not found</h1>
          <p className="text-gray-600">The requested note could not be found.</p>
        </div>
      );
    }
    throw error;
  }
}