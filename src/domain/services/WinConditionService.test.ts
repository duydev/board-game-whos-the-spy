import { describe, it, expect } from 'vitest';
import { WinConditionService } from './WinConditionService';
import type { Player } from '../entities/Player';

describe('WinConditionService', () => {
  const createMockPlayers = (
    spyCount: number,
    civilianCount: number,
    eliminatedSpies: number = 0,
    eliminatedCivilians: number = 0
  ): Player[] => {
    const players: Player[] = [];
    let playerId = 1;

    // Add spies
    for (let i = 0; i < spyCount; i++) {
      players.push({
        id: String(playerId++),
        name: `Spy ${i + 1}`,
        role: 'spy',
        isEliminated: i < eliminatedSpies,
      });
    }

    // Add civilians
    for (let i = 0; i < civilianCount; i++) {
      players.push({
        id: String(playerId++),
        name: `Civilian ${i + 1}`,
        role: 'civilian',
        word: 'Chó',
        isEliminated: i < eliminatedCivilians,
      });
    }

    return players;
  };

  describe('checkWinCondition', () => {
    it('should return civilians when all spies are eliminated', () => {
      const players = createMockPlayers(2, 3, 2, 0); // 2 spies eliminated, 3 civilians active
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe('civilians');
    });

    it('should return spies when spies equal civilians', () => {
      const players = createMockPlayers(2, 2, 0, 0); // 2 spies, 2 civilians (all active)
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe('spies');
    });

    it('should return spies when spies exceed civilians', () => {
      const players = createMockPlayers(3, 2, 0, 0); // 3 spies, 2 civilians (all active)
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe('spies');
    });

    it('should return null when game continues (spies < civilians)', () => {
      const players = createMockPlayers(1, 3, 0, 0); // 1 spy, 3 civilians (all active)
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe(null);
    });

    it('should return null when spies exist but are less than civilians', () => {
      const players = createMockPlayers(2, 4, 0, 1); // 2 spies active, 3 civilians active
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe(null);
    });

    it('should return civilians when last spy is eliminated', () => {
      const players = createMockPlayers(1, 4, 1, 0); // 1 spy eliminated, 4 civilians active
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe('civilians');
    });

    it('should return spies when spies reach equal to civilians after elimination', () => {
      const players = createMockPlayers(2, 3, 0, 1); // 2 spies active, 2 civilians active
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe('spies');
    });

    it('should handle minimum game (3 players, 1 spy)', () => {
      const players = createMockPlayers(1, 2, 0, 0); // 1 spy, 2 civilians
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe(null); // Game continues
    });

    it('should return civilians when all spies eliminated in minimum game', () => {
      const players = createMockPlayers(1, 2, 1, 0); // 1 spy eliminated, 2 civilians active
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe('civilians');
    });

    it('should return spies when spy remains with one civilian', () => {
      const players = createMockPlayers(1, 2, 0, 1); // 1 spy active, 1 civilian active
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe('spies');
    });

    it('should handle large game scenario', () => {
      const players = createMockPlayers(3, 7, 1, 2); // 2 spies active, 5 civilians active
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe(null); // Game continues
    });

    it('should return spies when multiple spies equal civilians', () => {
      const players = createMockPlayers(3, 3, 0, 0); // 3 spies, 3 civilians
      const winner = WinConditionService.checkWinCondition(players);

      expect(winner).toBe('spies');
    });
  });
});
