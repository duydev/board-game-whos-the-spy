import { describe, it, expect } from 'vitest';
import { SubmitVoteUseCase } from './SubmitVoteUseCase';
import type { GameState } from '@/domain/entities/GameState';
import type { Player } from '@/domain/entities/Player';
import type { GameConfig } from '@/domain/entities/GameConfig';

describe('SubmitVoteUseCase', () => {
  let useCase: SubmitVoteUseCase;

  beforeEach(() => {
    useCase = new SubmitVoteUseCase();
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
    it('should submit vote successfully', () => {
      const gameState = createMockGameState();
      const result = useCase.execute(gameState, '1', '4');

      expect(result.success).toBe(true);
      expect(result.gameState.votes['1']).toBe('4');
    });

    it('should allow multiple players to vote', () => {
      const gameState = createMockGameState();
      let result = useCase.execute(gameState, '1', '4');
      expect(result.success).toBe(true);

      result = useCase.execute(result.gameState, '2', '4');
      expect(result.success).toBe(true);
      expect(result.gameState.votes['1']).toBe('4');
      expect(result.gameState.votes['2']).toBe('4');
    });

    it('should allow changing vote', () => {
      const gameState = createMockGameState();
      let result = useCase.execute(gameState, '1', '4');
      expect(result.success).toBe(true);

      result = useCase.execute(result.gameState, '1', '3'); // Change vote
      expect(result.success).toBe(true);
      expect(result.gameState.votes['1']).toBe('3');
    });

    it('should return error when game state is null', () => {
      const result = useCase.execute(null as unknown as GameState, '1', '4');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Game state is required');
    });

    it('should return error when voter not found', () => {
      const gameState = createMockGameState();
      const result = useCase.execute(gameState, '999', '4');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Voter not found');
    });

    it('should return error when voted player not found', () => {
      const gameState = createMockGameState();
      const result = useCase.execute(gameState, '1', '999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Voted player not found');
    });

    it('should return error when eliminated player tries to vote', () => {
      const gameState = createMockGameState();
      gameState.players[0].isEliminated = true; // Eliminate Player 1

      const result = useCase.execute(gameState, '1', '4');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Eliminated players cannot vote');
    });

    it('should return error when trying to vote for eliminated player', () => {
      const gameState = createMockGameState();
      gameState.players[3].isEliminated = true; // Eliminate Player 4

      const result = useCase.execute(gameState, '1', '4');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cannot vote for eliminated player');
    });

    it('should return error when trying to vote for yourself', () => {
      const gameState = createMockGameState();
      const result = useCase.execute(gameState, '1', '1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cannot vote for yourself');
    });

    it('should preserve existing votes when adding new vote', () => {
      const gameState = createMockGameState();
      gameState.votes = {
        '2': '4',
        '3': '4',
      };

      const result = useCase.execute(gameState, '1', '4');

      expect(result.success).toBe(true);
      expect(result.gameState.votes['1']).toBe('4');
      expect(result.gameState.votes['2']).toBe('4');
      expect(result.gameState.votes['3']).toBe('4');
    });

    it('should not modify original game state', () => {
      const gameState = createMockGameState();
      const originalVotes = { ...gameState.votes };

      useCase.execute(gameState, '1', '4');

      expect(gameState.votes).toEqual(originalVotes);
    });
  });
});
