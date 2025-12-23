import { describe, it, expect } from 'vitest';
import { RoleAssignmentService } from './RoleAssignmentService';
import type { WordPair } from '../value-objects/WordPair';

describe('RoleAssignmentService', () => {
  describe('assignRoles', () => {
    it('should assign correct number of spies', () => {
      const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];
      const numberOfSpies = 2;
      const wordPair: WordPair = ['Chó', 'Mèo'];

      const players = RoleAssignmentService.assignRoles(playerNames, numberOfSpies, wordPair);

      const spies = players.filter((p) => p.role === 'spy');
      expect(spies).toHaveLength(2);
    });

    it('should assign all other players as civilians', () => {
      const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];
      const numberOfSpies = 1;
      const wordPair: WordPair = ['Chó', 'Mèo'];

      const players = RoleAssignmentService.assignRoles(playerNames, numberOfSpies, wordPair);

      const civilians = players.filter((p) => p.role === 'civilian');
      expect(civilians).toHaveLength(4);
    });

    it('should not assign words to spies', () => {
      const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];
      const numberOfSpies = 1;
      const wordPair: WordPair = ['Chó', 'Mèo'];

      const players = RoleAssignmentService.assignRoles(playerNames, numberOfSpies, wordPair);

      const spies = players.filter((p) => p.role === 'spy');
      expect(spies.every((p) => p.word === undefined)).toBe(true);
    });

    it('should assign words to all civilians', () => {
      const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];
      const numberOfSpies = 1;
      const wordPair: WordPair = ['Chó', 'Mèo'];

      const players = RoleAssignmentService.assignRoles(playerNames, numberOfSpies, wordPair);

      const civilians = players.filter((p) => p.role === 'civilian');
      expect(civilians.every((p) => p.word !== undefined)).toBe(true);
      expect(civilians.every((p) => p.word === 'Chó' || p.word === 'Mèo')).toBe(true);
    });

    it('should distribute words evenly between word1 and word2', () => {
      const playerNames = ['P1', 'P2', 'P3', 'P4', 'P5'];
      const numberOfSpies = 1;
      const wordPair: WordPair = ['Chó', 'Mèo'];

      const players = RoleAssignmentService.assignRoles(playerNames, numberOfSpies, wordPair);

      const civilians = players.filter((p) => p.role === 'civilian');
      const word1Count = civilians.filter((p) => p.word === 'Chó').length;
      const word2Count = civilians.filter((p) => p.word === 'Mèo').length;

      // With 4 civilians, should be 2-2 distribution
      expect(word1Count).toBe(2);
      expect(word2Count).toBe(2);
    });

    it('should handle odd number of civilians with balanced distribution', () => {
      const playerNames = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
      const numberOfSpies = 1;
      const wordPair: WordPair = ['Chó', 'Mèo'];

      const players = RoleAssignmentService.assignRoles(playerNames, numberOfSpies, wordPair);

      const civilians = players.filter((p) => p.role === 'civilian');
      const word1Count = civilians.filter((p) => p.word === 'Chó').length;
      const word2Count = civilians.filter((p) => p.word === 'Mèo').length;

      // With 5 civilians, difference should be at most 1
      expect(Math.abs(word1Count - word2Count)).toBeLessThanOrEqual(1);
      expect(word1Count + word2Count).toBe(5);
    });

    it('should assign unique IDs to all players', () => {
      const playerNames = ['P1', 'P2', 'P3'];
      const numberOfSpies = 1;
      const wordPair: WordPair = ['Chó', 'Mèo'];

      const players = RoleAssignmentService.assignRoles(playerNames, numberOfSpies, wordPair);

      const ids = players.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(players.length);
    });

    it('should set all players as not eliminated initially', () => {
      const playerNames = ['P1', 'P2', 'P3', 'P4'];
      const numberOfSpies = 1;
      const wordPair: WordPair = ['Chó', 'Mèo'];

      const players = RoleAssignmentService.assignRoles(playerNames, numberOfSpies, wordPair);

      expect(players.every((p) => !p.isEliminated)).toBe(true);
    });

    it('should handle minimum players (3 players, 1 spy)', () => {
      const playerNames = ['P1', 'P2', 'P3'];
      const numberOfSpies = 1;
      const wordPair: WordPair = ['Chó', 'Mèo'];

      const players = RoleAssignmentService.assignRoles(playerNames, numberOfSpies, wordPair);

      expect(players).toHaveLength(3);
      expect(players.filter((p) => p.role === 'spy')).toHaveLength(1);
      expect(players.filter((p) => p.role === 'civilian')).toHaveLength(2);
    });

    it('should assign correct names to players', () => {
      const playerNames = ['Alice', 'Bob', 'Charlie'];
      const numberOfSpies = 1;
      const wordPair: WordPair = ['Chó', 'Mèo'];

      const players = RoleAssignmentService.assignRoles(playerNames, numberOfSpies, wordPair);

      const names = players.map((p) => p.name);
      expect(names.sort()).toEqual(playerNames.sort());
    });
  });
});
