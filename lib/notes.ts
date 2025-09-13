/**
 * Notes file scanning and route generation utilities for Next.js static generation
 */
import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { decodePathSegment } from './path-utils';

/**
 * Represents a node in the notes tree structure
 */
export interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  path: string;
  children?: TreeNode[];
}

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

/**
 * Builds a tree structure from file paths
 * @param filePaths - Array of file paths relative to base directory
 * @returns Root nodes of the tree structure
 */
export function buildNotesTree(filePaths: string[]): TreeNode[] {
  if (filePaths.length === 0) {
    return [];
  }

  const nodeMap = new Map<string, TreeNode>();
  const rootNodes: TreeNode[] = [];

  // Sort filePaths to ensure consistent ordering
  const sortedPaths = [...filePaths].sort();

  for (const filePath of sortedPaths) {
    // Normalize path separators
    const normalizedPath = filePath.replace(/\\/g, '/');
    const pathSegments = normalizedPath.split('/').filter(segment => segment.length > 0);

    let currentPath = '';
    let parentNode: TreeNode | null = null;

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const isLastSegment = i === pathSegments.length - 1;

      // Build current path
      if (currentPath) {
        currentPath += '/' + segment;
      } else {
        currentPath = segment;
      }

      // Check if node already exists
      let currentNode = nodeMap.get(currentPath);

      if (!currentNode) {
        // Create new node
        currentNode = {
          name: segment,
          type: isLastSegment && segment.endsWith('.md') ? 'file' : 'folder',
          path: currentPath,
        };

        // Add children property for folders
        if (currentNode.type === 'folder') {
          currentNode.children = [];
        }

        nodeMap.set(currentPath, currentNode);

        // Add to parent or root
        if (parentNode) {
          parentNode.children!.push(currentNode);
        } else {
          rootNodes.push(currentNode);
        }
      }

      parentNode = currentNode;
    }
  }

  // Sort function: folders first, then files, both alphabetically
  const sortNodes = (nodes: TreeNode[]): void => {
    nodes.sort((a, b) => {
      // Folders before files
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      // Alphabetical within same type
      return a.name.localeCompare(b.name);
    });

    // Recursively sort children
    for (const node of nodes) {
      if (node.children) {
        sortNodes(node.children);
      }
    }
  };

  sortNodes(rootNodes);
  return rootNodes;
}