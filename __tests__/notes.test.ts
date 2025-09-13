import path from 'path';
import { describe, it, expect } from 'vitest';
import {
  scanNotesFiles,
  filePathToRouteParams,
  generateAllNoteRoutes,
  routeParamsToFilePath,
  buildNotesTree,
  TreeNode
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

describe('buildNotesTree', () => {
  const testBaseDir = path.join(__dirname, 'fixtures', 'notes');

  it('should build a tree structure from simple file paths', () => {
    const filePaths = ['simple-file.md', 'File with spaces.md'];

    const result = buildNotesTree(filePaths);

    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      name: 'File with spaces.md',
      type: 'file',
      path: 'File with spaces.md'
    });
    expect(result).toContainEqual({
      name: 'simple-file.md',
      type: 'file',
      path: 'simple-file.md'
    });
  });

  it('should handle nested directory structures correctly', () => {
    const filePaths = scanNotesFiles(testBaseDir);

    const result = buildNotesTree(filePaths);

    // Should have root level folders and files
    const folderNames = result.filter(node => node.type === 'folder').map(node => node.name);
    const fileNames = result.filter(node => node.type === 'file').map(node => node.name);

    expect(folderNames).toContain('00-journal');
    expect(folderNames).toContain('20-area');
    expect(fileNames).toContain('simple-file.md');
    expect(fileNames).toContain('File with spaces.md');

    // Test 00-journal folder structure
    const journalFolder = result.find(node => node.name === '00-journal');
    expect(journalFolder?.type).toBe('folder');
    expect(journalFolder?.children).toHaveLength(2);
    expect(journalFolder?.children?.map(child => child.name)).toContain('2025-08.md');
    expect(journalFolder?.children?.map(child => child.name)).toContain('2025-09.md');

    // Test 20-area nested structure
    const areaFolder = result.find(node => node.name === '20-area');
    expect(areaFolder?.children).toHaveLength(2); // 'Arlo The Deer 角色設定.md' + 'subdir'

    const subdirFolder = areaFolder?.children?.find(child => child.name === 'subdir');
    expect(subdirFolder?.type).toBe('folder');
    expect(subdirFolder?.children).toHaveLength(1);
    expect(subdirFolder?.children?.[0].name).toBe('深層檔案.md');
  });

  it('should support Chinese filenames and folder names', () => {
    const filePaths = [
      '20-area/Arlo The Deer 角色設定.md',
      '20-area/subdir/深層檔案.md'
    ];

    const result = buildNotesTree(filePaths);

    const areaFolder = result.find(node => node.name === '20-area');
    expect(areaFolder).toBeDefined();

    const chineseFile = areaFolder?.children?.find(child => child.name === 'Arlo The Deer 角色設定.md');
    expect(chineseFile?.type).toBe('file');
    expect(chineseFile?.path).toBe('20-area/Arlo The Deer 角色設定.md');

    const subdirFolder = areaFolder?.children?.find(child => child.name === 'subdir');
    const deepChineseFile = subdirFolder?.children?.find(child => child.name === '深層檔案.md');
    expect(deepChineseFile?.name).toBe('深層檔案.md');
  });

  it('should correctly differentiate between folders and files', () => {
    const filePaths = [
      'folder/file.md',
      'another-folder/subfolder/deep-file.md',
      'root-file.md'
    ];

    const result = buildNotesTree(filePaths);

    // Root level should have 2 folders and 1 file
    const folders = result.filter(node => node.type === 'folder');
    const files = result.filter(node => node.type === 'file');

    expect(folders).toHaveLength(2);
    expect(files).toHaveLength(1);

    expect(files[0].name).toBe('root-file.md');
    expect(folders.map(f => f.name)).toContain('folder');
    expect(folders.map(f => f.name)).toContain('another-folder');

    // All files should have no children property or empty children
    files.forEach(file => {
      expect(file.children).toBeUndefined();
    });

    // All folders should have children property
    folders.forEach(folder => {
      expect(folder.children).toBeDefined();
      expect(Array.isArray(folder.children)).toBe(true);
    });
  });

  it('should build proper tree hierarchy with multiple levels', () => {
    const filePaths = scanNotesFiles(testBaseDir);

    const result = buildNotesTree(filePaths);

    // Test deep nesting: 20-area/subdir/深層檔案.md
    const areaFolder = result.find(node => node.name === '20-area');
    const subdirFolder = areaFolder?.children?.find(child => child.name === 'subdir');
    const deepFile = subdirFolder?.children?.find(child => child.name === '深層檔案.md');

    expect(deepFile).toMatchObject({
      name: '深層檔案.md',
      type: 'file',
      path: '20-area/subdir/深層檔案.md'
    });

    // Verify parent-child relationships
    expect(areaFolder?.path).toBe('20-area');
    expect(subdirFolder?.path).toBe('20-area/subdir');
    expect(deepFile?.path).toBe('20-area/subdir/深層檔案.md');
  });

  it('should handle empty input gracefully', () => {
    const result = buildNotesTree([]);

    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle files in root directory', () => {
    const filePaths = ['simple-file.md', 'File with spaces.md'];

    const result = buildNotesTree(filePaths);

    expect(result).toHaveLength(2);
    result.forEach(node => {
      expect(node.type).toBe('file');
      expect(node.children).toBeUndefined();
      expect(node.path).not.toContain('/');
    });
  });

  it('should sort children nodes consistently', () => {
    const filePaths = [
      'folder/zebra.md',
      'folder/alpha.md',
      'folder/subfolder-z/file.md',
      'folder/subfolder-a/file.md'
    ];

    const result = buildNotesTree(filePaths);

    const folder = result.find(node => node.name === 'folder');
    const childNames = folder?.children?.map(child => child.name);

    // Should be sorted alphabetically: folders first, then files
    expect(childNames).toEqual([
      'subfolder-a',
      'subfolder-z',
      'alpha.md',
      'zebra.md'
    ]);
  });
});