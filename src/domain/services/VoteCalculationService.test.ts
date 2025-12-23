import { describe, it, expect, vi } from 'vitest';
import { VoteCalculationService } from './VoteCalculationService';
import type { GameState } from '../entities/GameState';
import type { Player } from '../entities/Player';
import type { GameConfig } from '../entities/GameConfig';

describe('VoteCalculationService', () => {
  const createMockConfig = (): GameConfig => ({
    totalPlayers: 5,
    numberOfSpies: 1,
    category: 'Động vật',
  });

  const createMockPlayers = (): Player[] => [
    { id: '1', name: 'Player 1', role: 'civilian', word: 'Chó', isEliminated: false },
    { id: '2', name: 'Player 2', role: 'civilian', word: 'Mèo', isEliminated: false },
    { id: '3', name: 'Player 3', role: 'civilian', word: 'Chó', isEliminated: false },
    { id: '4', name: 'Player 4', role: 'spy', isEliminated: false },
    { id: '5', name: 'Player 5', role: 'civilian', word: 'Mèo', isEliminated: false },
  ];

  const createMockGameState = (votes: Record<string, string> = {}): GameState => ({
    config: createMockConfig(),
    players: createMockPlayers(),
    currentRound: 1,
    currentDiscussionPlayerIndex: 0,
    currentVotingPlayerIndex: 0,
    votes,
    wordPair: ['Chó', 'Mèo'],
    winner: null,
    isGameOver: false,
    discussionTimeRemaining: 120,
  });

  describe('getVoteResults', () => {
    it('should return empty results when no votes cast', () => {
      const gameState = createMockGameState();
      const results = VoteCalculationService.getVoteResults(gameState);

      expect(results).toHaveLength(5);
      expect(results.every((r) => r.voteCount === 0)).toBe(true);
    });

    it('should calculate vote counts correctly', () => {
      const votes = {
        '1': '4', // Player 1 votes for Player 4
        '2': '4', // Player 2 votes for Player 4
        '3': '4', // Player 3 votes for Player 4
        '4': '1', // Player 4 votes for Player 1
        '5': '1', // Player 5 votes for Player 1
      };
      const gameState = createMockGameState(votes);
      const results = VoteCalculationService.getVoteResults(gameState);

      const player4Result = results.find((r) => r.playerId === '4');
      const player1Result = results.find((r) => r.playerId === '1');

      expect(player4Result?.voteCount).toBe(3);
      expect(player1Result?.voteCount).toBe(2);
    });

    it('should sort results by vote count descending', () => {
      const votes = {
        '1': '4',
        '2': '4',
        '3': '1',
        '4': '1',
        '5': '1',
      };
      const gameState = createMockGameState(votes);
      const results = VoteCalculationService.getVoteResults(gameState);

      expect(results[0].voteCount).toBeGreaterThanOrEqual(results[1].voteCount);
      expect(results[1].voteCount).toBeGreaterThanOrEqual(results[2].voteCount);
    });

    it('should exclude eliminated players from results', () => {
      const votes = {
        '1': '4',
        '2': '4',
        '3': '4',
      };
      const gameState = createMockGameState(votes);
      gameState.players[3].isEliminated = true; // Eliminate Player 4

      const results = VoteCalculationService.getVoteResults(gameState);

      expect(results.find((r) => r.playerId === '4')).toBeUndefined();
      expect(results).toHaveLength(4);
    });

    it('should include player names in results', () => {
      const votes = {
        '1': '4',
        '2': '4',
      };
      const gameState = createMockGameState(votes);
      const results = VoteCalculationService.getVoteResults(gameState);

      const player4Result = results.find((r) => r.playerId === '4');
      expect(player4Result?.playerName).toBe('Player 4');
    });

    it('should handle all players voting for different people', () => {
      const votes = {
        '1': '2',
        '2': '3',
        '3': '4',
        '4': '5',
        '5': '1',
      };
      const gameState = createMockGameState(votes);
      const results = VoteCalculationService.getVoteResults(gameState);

      expect(results.every((r) => r.voteCount === 1)).toBe(true);
    });
  });

  describe('getPlayerWithMostVotes', () => {
    it('should return null when no votes cast', () => {
      const gameState = createMockGameState();
      const result = VoteCalculationService.getPlayerWithMostVotes(gameState);

      expect(result).toBe(null);
    });

    it('should return player with most votes', () => {
      const votes = {
        '1': '4',
        '2': '4',
        '3': '4',
        '4': '1',
        '5': '1',
      };
      const gameState = createMockGameState(votes);
      const result = VoteCalculationService.getPlayerWithMostVotes(gameState);

      expect(result).toBe('4');
    });

    it('should return null when all votes are 0', () => {
      const votes = {};
      const gameState = createMockGameState(votes);
      const result = VoteCalculationService.getPlayerWithMostVotes(gameState);

      expect(result).toBe(null);
    });

    it('should handle tie by randomly selecting one', () => {
      const votes = {
        '1': '4',
        '2': '4',
        '3': '1',
        '4': '1',
      };
      const gameState = createMockGameState(votes);

      // Mock Math.random to test tie handling
      const originalRandom = Math.random;
      const results: string[] = [];
      for (let i = 0; i < 10; i++) {
        Math.random = vi.fn(() => i / 10);
        const result = VoteCalculationService.getPlayerWithMostVotes(gameState);
        if (result) results.push(result);
      }
      Math.random = originalRandom;

      // Should return either '1' or '4' (the tied players)
      expect(results.every((r) => r === '1' || r === '4')).toBe(true);
    });

    it('should exclude eliminated players from consideration', () => {
      const votes = {
        '1': '4',
        '2': '4',
        '3': '4',
      };
      const gameState = createMockGameState(votes);
      gameState.players[3].isEliminated = true; // Eliminate Player 4

      const result = VoteCalculationService.getPlayerWithMostVotes(gameState);

      expect(result).toBe(null); // No votes for active players
    });

    it('should return player with single vote when only one vote cast', () => {
      const votes = {
        '1': '4',
      };
      const gameState = createMockGameState(votes);
      const result = VoteCalculationService.getPlayerWithMostVotes(gameState);

      expect(result).toBe('4');
    });
  });
});
