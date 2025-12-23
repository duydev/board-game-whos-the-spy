import { describe, it, expect } from 'vitest';
import { EliminatePlayerUseCase } from './EliminatePlayerUseCase';
import type { GameState } from '@/domain/entities/GameState';
import type { Player } from '@/domain/entities/Player';
import type { GameConfig } from '@/domain/entities/GameConfig';

describe('EliminatePlayerUseCase', () => {
  let useCase: EliminatePlayerUseCase;

  beforeEach(() => {
    useCase = new EliminatePlayerUseCase();
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

  const createMockGameState = (): GameState => ({
    config: createMockConfig(),
    players: createMockPlayers(),
    currentRound: 1,
    currentDiscussionPlayerIndex: 0,
    currentVotingPlayerIndex: 0,
    votes: {},
    wordPair: ['Chó', 'Mèo'],
    winner: null,
    isGameOver: false,
    discussionTimeRemaining: 120,
  });

  describe('execute', () => {
    it('should eliminate player successfully', () => {
      const gameState = createMockGameState();
      const result = useCase.execute(gameState, '4');

      expect(result.eliminatedPlayerId).toBe('4');
      expect(result.gameState.players.find((p) => p.id === '4')?.isEliminated).toBe(true);
    });

    it('should set game over and winner to civilians when last spy is eliminated', () => {
      const gameState = createMockGameState();
      const result = useCase.execute(gameState, '4'); // Eliminate the only spy

      expect(result.gameState.isGameOver).toBe(true);
      expect(result.gameState.winner).toBe('civilians');
    });

    it('should set game over and winner to spies when spies equal civilians', () => {
      const gameState = createMockGameState();
      // Eliminate 2 civilians first
      gameState.players[0].isEliminated = true;
      gameState.players[1].isEliminated = true;
      // Now: 1 spy, 2 civilians
      // Eliminate 1 more civilian
      const result = useCase.execute(gameState, '3');

      expect(result.gameState.isGameOver).toBe(true);
      expect(result.gameState.winner).toBe('spies');
    });

    it('should not set game over when game continues', () => {
      const gameState = createMockGameState();
      const result = useCase.execute(gameState, '1'); // Eliminate a civilian

      expect(result.gameState.isGameOver).toBe(false);
      expect(result.gameState.winner).toBe(null);
    });

    it('should reset votes after elimination', () => {
      const gameState = createMockGameState();
      gameState.votes = {
        '1': '4',
        '2': '4',
        '3': '4',
      };

      const result = useCase.execute(gameState, '4');

      expect(result.gameState.votes).toEqual({});
    });

    it('should preserve other players state', () => {
      const gameState = createMockGameState();
      const result = useCase.execute(gameState, '4');

      const otherPlayers = result.gameState.players.filter((p) => p.id !== '4');
      expect(otherPlayers.every((p) => !p.isEliminated)).toBe(true);
    });

    it('should return eliminated player id', () => {
      const gameState = createMockGameState();
      const result = useCase.execute(gameState, '2');

      expect(result.eliminatedPlayerId).toBe('2');
    });

    it('should handle eliminating multiple players in sequence', () => {
      const gameState = createMockGameState();
      let result = useCase.execute(gameState, '1');
      expect(result.gameState.players.find((p) => p.id === '1')?.isEliminated).toBe(true);

      result = useCase.execute(result.gameState, '2');
      expect(result.gameState.players.find((p) => p.id === '2')?.isEliminated).toBe(true);
      expect(result.gameState.players.filter((p) => p.isEliminated)).toHaveLength(2);
    });
  });
});
