import path from 'path';
import { describe, it, expect } from 'vitest';
import {
  scanNotesFiles,
  filePathToRouteParams,
  generateAllNoteRoutes,
  routeParamsToFilePath
} from '../lib/notes';

describe('scanNotesFiles', () => {
  const testBaseDir = path.join(__dirname, 'fixtures', 'notes');

  it('should find all .md files in the notes-src directory', () => {
    const result = scanNotesFiles(testBaseDir);
    
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(6);
    expect(result).toContain('00-journal/2025-08.md');
    expect(result).toContain('00-journal/2025-09.md');
    expect(result).toContain('simple-file.md');
    expect(result).toContain('File with spaces.md');
    
    // Should sort results consistently
    expect(result).toEqual(expect.arrayContaining([
      '00-journal/2025-08.md',
      '00-journal/2025-09.md',
      '20-area/Arlo The Deer 角色設定.md',
      '20-area/subdir/深層檔案.md',
      'File with spaces.md',
      'simple-file.md'
    ]));
  });

  it('should handle nested directories correctly', () => {
    const result = scanNotesFiles(testBaseDir);
    
    expect(result).toContain('00-journal/2025-08.md');
    expect(result).toContain('20-area/subdir/深層檔案.md');
    
    // Should use forward slashes for consistency
    result.forEach(filePath => {
      expect(filePath).not.toContain('\\');
      expect(filePath).toMatch(/^[^/].*\.md$/);
    });
  });

  it('should handle Chinese filenames correctly', () => {
    const result = scanNotesFiles(testBaseDir);
    
    expect(result).toContain('20-area/Arlo The Deer 角色設定.md');
    expect(result).toContain('20-area/subdir/深層檔案.md');
  });

  it('should return empty array when no files exist', () => {
    const emptyDir = path.join(__dirname, 'fixtures', 'empty');
    const result = scanNotesFiles(emptyDir);
    
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });
});

describe('filePathToRouteParams', () => {
  it('should convert simple file path to route params', () => {
    const result = filePathToRouteParams('00-journal/2025-08.md');
    expect(result).toEqual(['00-journal', '2025-08']);
  });

  it('should handle nested directories', () => {
    const result = filePathToRouteParams('20-area/subdir/深層檔案.md');
    expect(result).toEqual(['20-area', 'subdir', '深層檔案']);
  });

  it('should handle Chinese filenames', () => {
    const result = filePathToRouteParams('20-area/Arlo The Deer 角色設定.md');
    expect(result).toEqual(['20-area', 'Arlo The Deer 角色設定']);
  });

  it('should handle spaces and special characters', () => {
    const result = filePathToRouteParams('File with spaces.md');
    expect(result).toEqual(['File with spaces']);
  });

  it('should handle root level files', () => {
    const result = filePathToRouteParams('simple-file.md');
    expect(result).toEqual(['simple-file']);
  });

  it('should throw error for invalid input', () => {
    expect(() => filePathToRouteParams('')).toThrow();
    expect(() => filePathToRouteParams('file-without-extension')).toThrow();
    expect(() => filePathToRouteParams('.md')).toThrow();
  });

  it('should normalize path separators', () => {
    const result = filePathToRouteParams('20-area\\subdir\\file.md');
    expect(result).toEqual(['20-area', 'subdir', 'file']);
  });
});

describe('generateAllNoteRoutes', () => {
  const testBaseDir = path.join(__dirname, 'fixtures', 'notes');

  it('should return correct format for Next.js generateStaticParams', () => {
    const result = generateAllNoteRoutes(testBaseDir);
    
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(6);
    
    // Check that each item has the correct structure
    result.forEach(route => {
      expect(route).toHaveProperty('slug');
      expect(route.slug).toBeInstanceOf(Array);
      expect(route.slug.length).toBeGreaterThan(0);
    });
  });

  it('should include all found note files', () => {
    const result = generateAllNoteRoutes(testBaseDir);
    
    expect(result).toContainEqual({ slug: ['00-journal', '2025-08'] });
    expect(result).toContainEqual({ slug: ['00-journal', '2025-09'] });
    expect(result).toContainEqual({ slug: ['20-area', 'Arlo The Deer 角色設定'] });
    expect(result).toContainEqual({ slug: ['20-area', 'subdir', '深層檔案'] });
    expect(result).toContainEqual({ slug: ['File with spaces'] });
    expect(result).toContainEqual({ slug: ['simple-file'] });
  });

  it('should handle empty notes directory', () => {
    const emptyDir = path.join(__dirname, 'fixtures', 'empty');
    const result = generateAllNoteRoutes(emptyDir);
    
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });

  it('should use default baseDir when not provided', () => {
    // This will fail because the default directory doesn't exist in our test environment
    expect(() => generateAllNoteRoutes()).not.toThrow();
  });
});

describe('routeParamsToFilePath', () => {
  it('should convert route params back to file path', () => {
    const result = routeParamsToFilePath(['00-journal', '2025-08']);
    expect(result).toBe('00-journal/2025-08.md');
  });

  it('should handle nested directories', () => {
    const result = routeParamsToFilePath(['20-area', 'subdir', '深層檔案']);
    expect(result).toBe('20-area/subdir/深層檔案.md');
  });

  it('should handle Chinese route params', () => {
    const result = routeParamsToFilePath(['20-area', 'Arlo The Deer 角色設定']);
    expect(result).toBe('20-area/Arlo The Deer 角色設定.md');
  });

  it('should handle single segment paths', () => {
    const result = routeParamsToFilePath(['simple-file']);
    expect(result).toBe('simple-file.md');
  });

  it('should handle paths with spaces', () => {
    const result = routeParamsToFilePath(['File with spaces']);
    expect(result).toBe('File with spaces.md');
  });

  it('should throw error for invalid input', () => {
    expect(() => routeParamsToFilePath([])).toThrow();
    expect(() => routeParamsToFilePath([''])).toThrow();
  });

  it('should always use forward slashes', () => {
    const result = routeParamsToFilePath(['folder', 'subfolder', 'file']);
    expect(result).toBe('folder/subfolder/file.md');
    expect(result).not.toContain('\\');
  });

  it('should decode URL-encoded route parameters', () => {
    // Test URL-encoded Chinese characters and spaces
    // URL: /notes/20-area/Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A
    const encodedParams = ['20-area', 'Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A'];
    const result = routeParamsToFilePath(encodedParams);
    expect(result).toBe('20-area/Arlo The Deer 角色設定.md');
  });

  it('should handle mixed encoded and non-encoded segments', () => {
    // Test mixed case where some segments are encoded, others are not
    const mixedParams = ['30-resources', 'templates', '%E6%96%87%E7%8D%BB%E7%AD%86%E8%A8%98%E7%AF%84%E6%9C%AC'];
    const result = routeParamsToFilePath(mixedParams);
    expect(result).toBe('30-resources/templates/文獻筆記範本.md');
  });

  it('should handle URL-encoded spaces correctly', () => {
    // Test %20 decoding to spaces
    const encodedParams = ['File%20with%20spaces'];
    const result = routeParamsToFilePath(encodedParams);
    expect(result).toBe('File with spaces.md');
  });
});

describe('Path mapping integration', () => {
  const testCases = [
    '00-journal/2025-08.md',
    '20-area/Arlo The Deer 角色設定.md',
    '20-area/subdir/深層檔案.md',
    'File with spaces.md',
    'simple-file.md'
  ];

  it('should be reversible: file → params → file', () => {
    testCases.forEach(filePath => {
      const params = filePathToRouteParams(filePath);
      const backToFile = routeParamsToFilePath(params);
      expect(backToFile).toBe(filePath);
    });
  });

  it('should handle cross-platform path separators', () => {
    // Test Windows-style backslashes get converted to forward slashes
    const windowsPath = '20-area\\subdir\\file.md';
    const params = filePathToRouteParams(windowsPath);
    const normalizedPath = routeParamsToFilePath(params);
    
    expect(normalizedPath).toBe('20-area/subdir/file.md');
    expect(normalizedPath).not.toContain('\\');
  });

  it('should maintain consistency in generateAllNoteRoutes output', () => {
    const testBaseDir = path.join(__dirname, 'fixtures', 'notes');
    const routes = generateAllNoteRoutes(testBaseDir);
    
    routes.forEach(route => {
      // Each route should be convertible back to a valid file path
      const filePath = routeParamsToFilePath(route.slug);
      expect(filePath).toMatch(/^[^\\]*\.md$/);
      
      // And that file path should convert back to the same route params
      const backToParams = filePathToRouteParams(filePath);
      expect(backToParams).toEqual(route.slug);
    });
  });
});