import type { Category } from '../value-objects/WordPair';

export interface GameConfig {
  totalPlayers: number;
  numberOfSpies: number;
  category: Category | 'random';
}

export const GameConfig = {
  isValid: (config: GameConfig): boolean => {
    if (config.totalPlayers < 3) return false;
    if (config.numberOfSpies < 1) return false;
    if (config.numberOfSpies >= config.totalPlayers) return false;
    return true;
  },
};
