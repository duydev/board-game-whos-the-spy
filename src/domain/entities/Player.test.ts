import { describe, it, expect } from 'vitest';
import { Player } from './Player';
import type { Player as PlayerType } from './Player';

describe('Player', () => {
  describe('isSpy', () => {
    it('should return true for spy player', () => {
      const player: PlayerType = {
        id: '1',
        name: 'Player 1',
        role: 'spy',
        isEliminated: false,
      };
      expect(Player.isSpy(player)).toBe(true);
    });

    it('should return false for civilian player', () => {
      const player: PlayerType = {
        id: '1',
        name: 'Player 1',
        role: 'civilian',
        word: 'Chó',
        isEliminated: false,
      };
      expect(Player.isSpy(player)).toBe(false);
    });
  });

  describe('isCivilian', () => {
    it('should return true for civilian player', () => {
      const player: PlayerType = {
        id: '1',
        name: 'Player 1',
        role: 'civilian',
        word: 'Chó',
        isEliminated: false,
      };
      expect(Player.isCivilian(player)).toBe(true);
    });

    it('should return false for spy player', () => {
      const player: PlayerType = {
        id: '1',
        name: 'Player 1',
        role: 'spy',
        isEliminated: false,
      };
      expect(Player.isCivilian(player)).toBe(false);
    });
  });

  describe('isActive', () => {
    it('should return true when player is not eliminated', () => {
      const player: PlayerType = {
        id: '1',
        name: 'Player 1',
        role: 'civilian',
        word: 'Chó',
        isEliminated: false,
      };
      expect(Player.isActive(player)).toBe(true);
    });

    it('should return false when player is eliminated', () => {
      const player: PlayerType = {
        id: '1',
        name: 'Player 1',
        role: 'civilian',
        word: 'Chó',
        isEliminated: true,
      };
      expect(Player.isActive(player)).toBe(false);
    });

    it('should return true for active spy', () => {
      const player: PlayerType = {
        id: '1',
        name: 'Player 1',
        role: 'spy',
        isEliminated: false,
      };
      expect(Player.isActive(player)).toBe(true);
    });

    it('should return false for eliminated spy', () => {
      const player: PlayerType = {
        id: '1',
        name: 'Player 1',
        role: 'spy',
        isEliminated: true,
      };
      expect(Player.isActive(player)).toBe(false);
    });
  });

  describe('hasWord', () => {
    it('should return true when player has a word', () => {
      const player: PlayerType = {
        id: '1',
        name: 'Player 1',
        role: 'civilian',
        word: 'Chó',
        isEliminated: false,
      };
      expect(Player.hasWord(player)).toBe(true);
    });

    it('should return false when player word is undefined', () => {
      const player: PlayerType = {
        id: '1',
        name: 'Player 1',
        role: 'spy',
        isEliminated: false,
      };
      expect(Player.hasWord(player)).toBe(false);
    });

    it('should return true for civilian with empty string word (edge case)', () => {
      const player: PlayerType = {
        id: '1',
        name: 'Player 1',
        role: 'civilian',
        word: '',
        isEliminated: false,
      };
      expect(Player.hasWord(player)).toBe(true);
    });
  });
});
