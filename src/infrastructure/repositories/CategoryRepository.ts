import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import type { Category, WordPair } from '@/domain/value-objects/WordPair';
import categoriesData from '@/data/categories.json';

type CategoriesData = Record<string, [string, string][]>;

const categories = categoriesData as unknown as CategoriesData;

export class CategoryRepository implements ICategoryRepository {
  async getAvailableCategories(): Promise<string[]> {
    return Promise.resolve(Object.keys(categories));
  }

  async selectRandomWordPair(category: Category | 'random'): Promise<WordPair> {
    let selectedCategory: Category;

    if (category === 'random') {
      const categoryKeys = Object.keys(categories);
      if (categoryKeys.length === 0) {
        throw new Error('No categories available');
      }
      const randomIndex = Math.floor(Math.random() * categoryKeys.length);
      selectedCategory = categoryKeys[randomIndex];
    } else {
      selectedCategory = category;
    }

    const wordPairs = categories[selectedCategory];
    if (!wordPairs || wordPairs.length === 0) {
      throw new Error(`No word pairs found for category: ${selectedCategory}`);
    }

    const randomIndex = Math.floor(Math.random() * wordPairs.length);
    return wordPairs[randomIndex] as WordPair;
  }

  getCategoryDisplayName(category: Category): string {
    return category;
  }
}
