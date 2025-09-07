/**
 * Tests for dynamic notes page component
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { generateStaticParams, readNoteContent } from '@/app/notes/[...slug]/page';
import NotesPage from '@/app/notes/[...slug]/page';
import { join } from 'path';

// Use fixtures directory for testing
const FIXTURES_DIR = '__tests__/fixtures/notes';

describe('generateStaticParams', () => {
  it('returns all available note paths as static params', async () => {
    // Mock the notes library to use fixtures directory
    vi.doMock('@/lib/notes', () => ({
      generateAllNoteRoutes: vi.fn().mockImplementation((baseDir = FIXTURES_DIR) => {
        // This should return actual fixture files
        const { generateAllNoteRoutes } = vi.importActual('@/lib/notes');
        return generateAllNoteRoutes(baseDir);
      })
    }));

    const result = await generateStaticParams();
    
    // Should include our fixture files
    expect(result).toContainEqual({ slug: ['00-journal', '2025-08'] });
    expect(result).toContainEqual({ slug: ['00-journal', '2025-09'] });
    expect(result).toContainEqual({ slug: ['20-area', 'Arlo The Deer 角色設定'] });
    expect(result).toContainEqual({ slug: ['simple-file'] });
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns empty array when directory does not exist', async () => {
    // Mock the notes library to use non-existent directory
    vi.doMock('@/lib/notes', () => ({
      generateAllNoteRoutes: vi.fn().mockImplementation(() => {
        const { generateAllNoteRoutes } = vi.importActual('@/lib/notes');
        return generateAllNoteRoutes('__tests__/fixtures/nonexistent');
      })
    }));

    const result = await generateStaticParams();
    
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});

describe('readNoteContent', () => {
  it('reads and returns note content from file system', () => {
    const filePath = join(FIXTURES_DIR, 'simple-file.md');
    
    const result = readNoteContent(filePath);
    
    expect(result).toContain('# Simple Test File');
    expect(result).toContain('This is a simple test file at the root level');
    expect(result).toContain('Basic markdown content for testing purposes.');
  });

  it('throws error when file does not exist', () => {
    const nonexistentPath = join(FIXTURES_DIR, 'nonexistent.md');

    expect(() => readNoteContent(nonexistentPath))
      .toThrow('Note file not found');
  });

  it('handles Chinese filenames correctly', () => {
    const filePath = join(FIXTURES_DIR, '20-area', 'Arlo The Deer 角色設定.md');
    
    const result = readNoteContent(filePath);
    
    expect(result).toContain('# Arlo The Deer 角色設定');
    expect(result).toContain('這是一個包含中文字符的測試檔案');
    expect(result).toContain('中文：你好世界');
  });

  it('handles files with spaces in names', () => {
    const filePath = join(FIXTURES_DIR, 'File with spaces.md');
    
    const result = readNoteContent(filePath);
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('handles nested directory files', () => {
    const filePath = join(FIXTURES_DIR, '20-area', 'subdir', '深層檔案.md');
    
    const result = readNoteContent(filePath);
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});

describe('NotesPage component', () => {
  it('renders note content correctly', async () => {
    // Mock readNoteContent to use actual fixture file
    vi.doMock('@/app/notes/[...slug]/page', async () => {
      const actual = await vi.importActual('@/app/notes/[...slug]/page');
      const { readFileSync } = await import('fs');
      return {
        ...actual,
        readNoteContent: vi.fn().mockImplementation(() => {
          return readFileSync(join(FIXTURES_DIR, 'simple-file.md'), 'utf-8');
        })
      };
    });

    const params = Promise.resolve({ slug: ['simple-file'] });
    render(await NotesPage({ params }));
    
    expect(screen.getByText('Simple Test File')).toBeInTheDocument();
    expect(screen.getByText(/This is a simple test file/)).toBeInTheDocument();
  });

  it('handles file not found gracefully', async () => {
    // Mock readNoteContent to throw file not found error
    vi.doMock('@/app/notes/[...slug]/page', async () => {
      const actual = await vi.importActual('@/app/notes/[...slug]/page');
      return {
        ...actual,
        readNoteContent: vi.fn().mockImplementation(() => {
          throw new Error('Note file not found');
        })
      };
    });

    const params = Promise.resolve({ slug: ['nonexistent'] });
    render(await NotesPage({ params }));
    
    expect(screen.getByText('Note not found')).toBeInTheDocument();
    expect(screen.getByText('The requested note could not be found.')).toBeInTheDocument();
  });

  it('displays Chinese content correctly', async () => {
    // Mock readNoteContent to use Chinese fixture file
    vi.doMock('@/app/notes/[...slug]/page', async () => {
      const actual = await vi.importActual('@/app/notes/[...slug]/page');
      const { readFileSync } = await import('fs');
      return {
        ...actual,
        readNoteContent: vi.fn().mockImplementation(() => {
          return readFileSync(join(FIXTURES_DIR, '20-area', 'Arlo The Deer 角色設定.md'), 'utf-8');
        })
      };
    });

    const params = Promise.resolve({ slug: ['20-area', 'Arlo The Deer 角色設定'] });
    render(await NotesPage({ params }));
    
    expect(screen.getByText('Arlo The Deer 角色設定')).toBeInTheDocument();
    expect(screen.getByText(/這是一個包含中文字符的測試檔案/)).toBeInTheDocument();
  });
});