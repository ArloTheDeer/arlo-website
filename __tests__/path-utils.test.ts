import { describe, it, expect } from 'vitest';
import {
  encodePathSegment,
  decodePathSegment,
  filePathToUrl,
  urlToFilePath
} from '../lib/path-utils';

describe('encodePathSegment', () => {
  it('should encode path segment with spaces and Chinese characters', () => {
    const input = "Arlo The Deer 角色設定";
    const result = encodePathSegment(input);
    expect(result).toBe("Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A");
  });
});

describe('decodePathSegment', () => {
  it('should decode URL-encoded path segment', () => {
    const input = "Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A";
    const result = decodePathSegment(input);
    expect(result).toBe("Arlo The Deer 角色設定");
  });
});

describe('filePathToUrl', () => {
  it('should convert file path to URL-encoded path without route prefix', () => {
    const input = "20-area/Arlo The Deer 角色設定.md";
    const result = filePathToUrl(input);
    expect(result).toBe("20-area/Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A");
  });
});

describe('urlToFilePath', () => {
  it('should convert URL-encoded path to file path', () => {
    const input = "20-area/Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A";
    const result = urlToFilePath(input);
    expect(result).toBe("20-area/Arlo The Deer 角色設定.md");
  });
});