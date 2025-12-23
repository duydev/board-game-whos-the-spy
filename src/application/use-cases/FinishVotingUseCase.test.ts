import { describe, it, expect, vi } from 'vitest';
import { FinishVotingUseCase } from './FinishVotingUseCase';
import type { GameState } from '@/domain/entities/GameState';
import type { Player } from '@/domain/entities/Player';
import type { GameConfig } from '@/domain/entities/GameConfig';

describe('FinishVotingUseCase', () => {
  let useCase: FinishVotingUseCase;

  beforeEach(() => {
    useCase = new FinishVotingUseCase();
  });

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

  describe('execute', () => {
    it('should eliminate player with most votes', () => {
      const votes = {
        '1': '4',
        '2': '4',
        '3': '4',
        '4': '1',
        '5': '1',
      };
      const gameState = createMockGameState(votes);
      const result = useCase.execute(gameState);

      expect(result.eliminatedPlayerId).toBe('4');
      expect(result.gameState.players.find((p) => p.id === '4')?.isEliminated).toBe(true);
    });

    it('should increment round when game continues', () => {
      const votes = {
        '1': '2',
        '2': '1',
        '3': '1',
      };
      const gameState = createMockGameState(votes);
      const result = useCase.execute(gameState);

      expect(result.gameState.currentRound).toBe(2);
    });

    it('should reset discussion state for next round', () => {
      const votes = {
        '1': '2',
        '2': '1',
        '3': '1',
      };
      const gameState = createMockGameState(votes);
      gameState.currentDiscussionPlayerIndex = 3;
      gameState.currentVotingPlayerIndex = 2;
      gameState.discussionTimeRemaining = 60;

      const result = useCase.execute(gameState);

      expect(result.gameState.currentDiscussionPlayerIndex).toBe(0);
      expect(result.gameState.currentVotingPlayerIndex).toBe(0);
      expect(result.gameState.votes).toEqual({});
      expect(result.gameState.discussionTimeRemaining).toBe(120);
    });

    it('should not increment round when game is over', () => {
      const votes = {
        '1': '4',
        '2': '4',
        '3': '4',
        '4': '1',
        '5': '1',
      };
      const gameState = createMockGameState(votes);
      const result = useCase.execute(gameState);

      // Game should be over (last spy eliminated)
      expect(result.gameState.isGameOver).toBe(true);
      expect(result.gameState.currentRound).toBe(1); // Round should not increment when game ends
    });

    it('should return null eliminatedPlayerId when no votes cast', () => {
      const gameState = createMockGameState();
      const result = useCase.execute(gameState);

      expect(result.eliminatedPlayerId).toBe(null);
      expect(result.gameState).toEqual(gameState);
    });

    it('should handle tie votes by randomly selecting one', () => {
      const votes = {
        '1': '2',
        '2': '1',
        '3': '1',
        '4': '2',
        '5': '2',
      };
      const gameState = createMockGameState(votes);

      // Mock Math.random to test tie handling
      const originalRandom = Math.random;
      const eliminatedIds: (string | null)[] = [];
      for (let i = 0; i < 10; i++) {
        Math.random = vi.fn(() => i / 10);
        const result = useCase.execute({ ...gameState });
        eliminatedIds.push(result.eliminatedPlayerId);
      }
      Math.random = originalRandom;

      // Should eliminate either '1' or '2' (the tied players)
      expect(eliminatedIds.every((id) => id === '1' || id === '2')).toBe(true);
    });

    it('should set game over when civilians win', () => {
      const votes = {
        '1': '4',
        '2': '4',
        '3': '4',
        '4': '1',
        '5': '1',
      };
      const gameState = createMockGameState(votes);
      const result = useCase.execute(gameState);

      expect(result.gameState.isGameOver).toBe(true);
      expect(result.gameState.winner).toBe('civilians');
    });

    it('should set game over when spies win', () => {
      const gameState = createMockGameState();
      // Eliminate 2 civilians first
      gameState.players[0].isEliminated = true;
      gameState.players[1].isEliminated = true;
      // Now: 1 spy, 2 civilians
      // Vote to eliminate 1 more civilian
      gameState.votes = {
        '3': '5',
        '4': '5',
        '5': '3',
      };

      const result = useCase.execute(gameState);

      expect(result.gameState.isGameOver).toBe(true);
      expect(result.gameState.winner).toBe('spies');
    });
  });
});
