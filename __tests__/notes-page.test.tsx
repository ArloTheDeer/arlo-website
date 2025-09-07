/**
 * Tests for dynamic notes page component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { generateStaticParamsWithBaseDir, readNoteContent } from '@/app/notes/[...slug]/page';
import NotesPage from '@/app/notes/[...slug]/page';

// Use fixtures directory for testing
const FIXTURES_DIR = '__tests__/fixtures/notes';

describe('generateStaticParams', () => {
  it('returns all available note paths as static params', async () => {
    const result = await generateStaticParamsWithBaseDir(FIXTURES_DIR);
    
    // Should include our fixture files
    expect(result).toContainEqual({ slug: ['00-journal', '2025-08'] });
    expect(result).toContainEqual({ slug: ['00-journal', '2025-09'] });
    expect(result).toContainEqual({ slug: ['20-area', 'Arlo The Deer 角色設定'] });
    expect(result).toContainEqual({ slug: ['simple-file'] });
    expect(result.length).toBeGreaterThan(0);
  });

  it('throws error for invalid base directory', async () => {
    await expect(generateStaticParamsWithBaseDir('/etc/passwd'))
      .rejects.toThrow('Invalid base directory');
  });

  it('throws error for path traversal attempt', async () => {
    await expect(generateStaticParamsWithBaseDir('../../../etc'))
      .rejects.toThrow('Invalid base directory');
  });
});

describe('readNoteContent', () => {
  it('reads and returns note content from file system', () => {
    const result = readNoteContent('simple-file.md', FIXTURES_DIR);
    
    expect(result).toContain('# Simple Test File');
    expect(result).toContain('This is a simple test file at the root level');
    expect(result).toContain('Basic markdown content for testing purposes.');
  });

  it('throws error when file does not exist', () => {
    expect(() => readNoteContent('nonexistent.md', FIXTURES_DIR))
      .toThrow('Note file not found');
  });

  it('handles Chinese filenames correctly', () => {
    const result = readNoteContent('20-area/Arlo The Deer 角色設定.md', FIXTURES_DIR);
    
    expect(result).toContain('# Arlo The Deer 角色設定');
    expect(result).toContain('這是一個包含中文字符的測試檔案');
    expect(result).toContain('中文：你好世界');
  });

  it('handles files with spaces in names', () => {
    const result = readNoteContent('File with spaces.md', FIXTURES_DIR);
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('handles nested directory files', () => {
    const result = readNoteContent('20-area/subdir/深層檔案.md', FIXTURES_DIR);
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('throws error for invalid base directory', () => {
    expect(() => readNoteContent('test.md', '/etc/passwd'))
      .toThrow('Invalid base directory');
  });

  it('throws error for path traversal attempt', () => {
    expect(() => readNoteContent('../../../etc/passwd', FIXTURES_DIR))
      .toThrow('Path traversal attempt detected');
  });
});

describe('NotesPage component', () => {
  it('renders note content correctly', async () => {
    const params = Promise.resolve({ slug: ['simple-file'] });
    render(await NotesPage({ params, baseDir: FIXTURES_DIR }));
    
    expect(screen.getByText('Simple Test File')).toBeInTheDocument();
    expect(screen.getByText(/This is a simple test file/)).toBeInTheDocument();
  });

  it('handles file not found gracefully', async () => {
    const params = Promise.resolve({ slug: ['nonexistent'] });
    render(await NotesPage({ params, baseDir: FIXTURES_DIR }));
    
    expect(screen.getByText('Note not found')).toBeInTheDocument();
    expect(screen.getByText('The requested note could not be found.')).toBeInTheDocument();
  });

  it('displays Chinese content correctly', async () => {
    const params = Promise.resolve({ slug: ['20-area', 'Arlo The Deer 角色設定'] });
    render(await NotesPage({ params, baseDir: FIXTURES_DIR }));
    
    expect(screen.getByText('Arlo The Deer 角色設定')).toBeInTheDocument();
    expect(screen.getByText(/這是一個包含中文字符的測試檔案/)).toBeInTheDocument();
  });

  it('throws error for invalid base directory', async () => {
    const params = Promise.resolve({ slug: ['test'] });
    await expect(NotesPage({ params, baseDir: '/etc/passwd' }))
      .rejects.toThrow('Invalid base directory');
  });
});