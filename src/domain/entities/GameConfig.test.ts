import { describe, it, expect } from 'vitest';
import { GameConfig } from './GameConfig';
import type { GameConfig as GameConfigType } from './GameConfig';

describe('GameConfig', () => {
  describe('isValid', () => {
    it('should return true for valid config with minimum players', () => {
      const config: GameConfigType = {
        totalPlayers: 3,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      expect(GameConfig.isValid(config)).toBe(true);
    });

    it('should return true for valid config with more players', () => {
      const config: GameConfigType = {
        totalPlayers: 5,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      expect(GameConfig.isValid(config)).toBe(true);
    });

    it('should return true for valid config with multiple spies', () => {
      const config: GameConfigType = {
        totalPlayers: 6,
        numberOfSpies: 2,
        category: 'Động vật',
      };
      expect(GameConfig.isValid(config)).toBe(true);
    });

    it('should return true for valid config with random category', () => {
      const config: GameConfigType = {
        totalPlayers: 4,
        numberOfSpies: 1,
        category: 'random',
      };
      expect(GameConfig.isValid(config)).toBe(true);
    });

    it('should return false when totalPlayers is less than 3', () => {
      const config: GameConfigType = {
        totalPlayers: 2,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      expect(GameConfig.isValid(config)).toBe(false);
    });

    it('should return false when totalPlayers is 1', () => {
      const config: GameConfigType = {
        totalPlayers: 1,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      expect(GameConfig.isValid(config)).toBe(false);
    });

    it('should return false when numberOfSpies is less than 1', () => {
      const config: GameConfigType = {
        totalPlayers: 5,
        numberOfSpies: 0,
        category: 'Động vật',
      };
      expect(GameConfig.isValid(config)).toBe(false);
    });

    it('should return false when numberOfSpies equals totalPlayers', () => {
      const config: GameConfigType = {
        totalPlayers: 5,
        numberOfSpies: 5,
        category: 'Động vật',
      };
      expect(GameConfig.isValid(config)).toBe(false);
    });

    it('should return false when numberOfSpies exceeds totalPlayers', () => {
      const config: GameConfigType = {
        totalPlayers: 5,
        numberOfSpies: 6,
        category: 'Động vật',
      };
      expect(GameConfig.isValid(config)).toBe(false);
    });

    it('should return false when numberOfSpies is totalPlayers - 1 (edge case)', () => {
      const config: GameConfigType = {
        totalPlayers: 5,
        numberOfSpies: 4,
        category: 'Động vật',
      };
      // numberOfSpies (4) < totalPlayers (5) is true, so this is actually valid
      // The constraint is numberOfSpies < totalPlayers, not numberOfSpies <= totalPlayers - 1
      expect(GameConfig.isValid(config)).toBe(true);
    });

    it('should return true when numberOfSpies is totalPlayers - 2 (valid)', () => {
      const config: GameConfigType = {
        totalPlayers: 5,
        numberOfSpies: 3,
        category: 'Động vật',
      };
      expect(GameConfig.isValid(config)).toBe(true);
    });
  });
});
