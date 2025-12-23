import type { Category, WordPair } from '../value-objects/WordPair';

export interface ICategoryRepository {
  getAvailableCategories(): Promise<string[]>;
  selectRandomWordPair(category: Category | 'random'): Promise<WordPair>;
  getCategoryDisplayName(category: Category): string;
}
