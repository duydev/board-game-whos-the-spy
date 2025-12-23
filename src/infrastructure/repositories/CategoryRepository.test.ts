import { describe, it, expect, beforeEach } from 'vitest';
import { CategoryRepository } from './CategoryRepository';
import categoriesData from '@/data/categories.json';

describe('CategoryRepository', () => {
  let repository: CategoryRepository;

  beforeEach(() => {
    repository = new CategoryRepository();
  });

  describe('getAvailableCategories', () => {
    it('should return all available categories', async () => {
      const categories = await repository.getAvailableCategories();

      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('Động vật');
      expect(categories).toContain('Đồ ăn');
    });

    it('should return categories from categories.json', async () => {
      const categories = await repository.getAvailableCategories();
      const expectedCategories = Object.keys(categoriesData);

      expect(categories.sort()).toEqual(expectedCategories.sort());
    });
  });

  describe('selectRandomWordPair', () => {
    it('should return a valid word pair for specific category', async () => {
      const wordPair = await repository.selectRandomWordPair('Động vật');

      expect(wordPair).toHaveLength(2);
      expect(wordPair[0]).toBeTruthy();
      expect(wordPair[1]).toBeTruthy();
      expect(typeof wordPair[0]).toBe('string');
      expect(typeof wordPair[1]).toBe('string');
    });

    it('should return word pair from the specified category', async () => {
      const wordPair = await repository.selectRandomWordPair('Động vật');
      const categoryData = (categoriesData as Record<string, [string, string][]>)['Động vật'];

      expect(categoryData.some((pair) => pair[0] === wordPair[0] && pair[1] === wordPair[1])).toBe(
        true
      );
    });

    it('should return word pair from random category when category is random', async () => {
      const wordPair = await repository.selectRandomWordPair('random');

      expect(wordPair).toHaveLength(2);
      expect(wordPair[0]).toBeTruthy();
      expect(wordPair[1]).toBeTruthy();
    });

    it('should return different word pairs on multiple calls (randomness)', async () => {
      const pairs: Array<[string, string]> = [];
      for (let i = 0; i < 10; i++) {
        const pair = await repository.selectRandomWordPair('Động vật');
        pairs.push(pair);
      }

      // At least one pair should be different (high probability)
      const uniquePairs = new Set(pairs.map((p) => `${p[0]}-${p[1]}`));
      expect(uniquePairs.size).toBeGreaterThan(1);
    });

    it('should throw error for non-existent category', async () => {
      await expect(
        repository.selectRandomWordPair('NonExistentCategory' as 'Động vật')
      ).rejects.toThrow();
    });

    it('should return valid word pair for all available categories', async () => {
      const categories = await repository.getAvailableCategories();

      for (const category of categories) {
        const wordPair = await repository.selectRandomWordPair(category);
        expect(wordPair).toHaveLength(2);
        expect(wordPair[0].length).toBeGreaterThan(0);
        expect(wordPair[1].length).toBeGreaterThan(0);
      }
    });
  });

  describe('getCategoryDisplayName', () => {
    it('should return the category name as display name', () => {
      const displayName = repository.getCategoryDisplayName('Động vật');

      expect(displayName).toBe('Động vật');
    });

    it('should return display name for any category', () => {
      const categories = ['Động vật', 'Đồ ăn', 'Địa danh'];

      categories.forEach((category) => {
        expect(repository.getCategoryDisplayName(category)).toBe(category);
      });
    });
  });
});
