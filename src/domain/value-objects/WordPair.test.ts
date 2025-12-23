import { describe, it, expect } from 'vitest';
import { WordPair } from './WordPair';
import type { WordPair as WordPairType } from './WordPair';

describe('WordPair', () => {
  describe('isValid', () => {
    it('should return true for valid word pair', () => {
      const pair: WordPairType = ['Chó', 'Mèo'];
      expect(WordPair.isValid(pair)).toBe(true);
    });

    it('should return true for valid word pair with different words', () => {
      const pair: WordPairType = ['Phở', 'Bún'];
      expect(WordPair.isValid(pair)).toBe(true);
    });

    it('should return false for empty array', () => {
      const pair = [] as unknown as WordPairType;
      expect(WordPair.isValid(pair)).toBe(false);
    });

    it('should return false for array with only one element', () => {
      const pair = ['Chó'] as unknown as WordPairType;
      expect(WordPair.isValid(pair)).toBe(false);
    });

    it('should return false for array with more than two elements', () => {
      const pair = ['Chó', 'Mèo', 'Voi'] as unknown as WordPairType;
      expect(WordPair.isValid(pair)).toBe(false);
    });

    it('should return false when first word is empty string', () => {
      const pair: WordPairType = ['', 'Mèo'];
      expect(WordPair.isValid(pair)).toBe(false);
    });

    it('should return false when second word is empty string', () => {
      const pair: WordPairType = ['Chó', ''];
      expect(WordPair.isValid(pair)).toBe(false);
    });

    it('should return false when both words are empty strings', () => {
      const pair: WordPairType = ['', ''];
      expect(WordPair.isValid(pair)).toBe(false);
    });

    it('should return true for word pair with single character words', () => {
      const pair: WordPairType = ['A', 'B'];
      expect(WordPair.isValid(pair)).toBe(true);
    });
  });
});
