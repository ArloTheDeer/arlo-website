/**
 * URL encoding/decoding utilities for notes file path handling
 * Provides functions to safely encode/decode file paths for URL usage
 */

/**
 * Encodes a single path segment for URL-safe usage
 * @param segment - The path segment to encode (e.g., "Arlo The Deer 角色設定")
 * @returns The URL-encoded segment (e.g., "Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A")
 */
export function encodePathSegment(segment: string): string {
  return encodeURIComponent(segment);
}

/**
 * Decodes a URL-encoded path segment back to its original form
 * @param encodedSegment - The URL-encoded segment to decode
 * @returns The original path segment
 */
export function decodePathSegment(encodedSegment: string): string {
  return decodeURIComponent(encodedSegment);
}

/**
 * Converts a file path to URL-encoded path (without route prefix)
 * @param filePath - The file path relative to notes directory (e.g., "20-area/Arlo The Deer 角色設定.md")
 * @returns URL-encoded path (e.g., "20-area/Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A")
 */
export function filePathToUrl(filePath: string): string {
  // Remove .md extension if present
  const pathWithoutExtension = filePath.replace(/\.md$/, '');
  
  // Split path by slash and encode each segment
  const segments = pathWithoutExtension.split('/');
  const encodedSegments = segments.map(segment => encodePathSegment(segment));
  
  return encodedSegments.join('/');
}

/**
 * Converts URL-encoded path back to a file path
 * @param urlPath - The URL-encoded path (e.g., "20-area/Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A")
 * @returns File path relative to notes directory (e.g., "20-area/Arlo The Deer 角色設定.md")
 */
export function urlToFilePath(urlPath: string): string {
  // Split path by slash and decode each segment
  const segments = urlPath.split('/');
  const decodedSegments = segments.map(segment => decodePathSegment(segment));
  
  // Join segments and add .md extension
  return decodedSegments.join('/') + '.md';
}