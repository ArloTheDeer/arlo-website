import { generateAllNoteRoutes, routeParamsToFilePath } from '@/lib/notes';
import { readFileSync } from 'fs';
import { join } from 'path';
import { notFound } from 'next/navigation';

/**
 * Generate static params for all note routes
 */
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  return generateAllNoteRoutes();
}

/**
 * Read note content from file system
 */
export function readNoteContent(filePath: string): string {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
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

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  
  try {
    // Convert route parameters to file path
    const filePath = routeParamsToFilePath(slug);
    const fullPath = join('public/notes-src', filePath);
    
    // Read note content
    const content = readNoteContent(fullPath);
    
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
  } catch (error: any) {
    if (error.message === 'Note file not found') {
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