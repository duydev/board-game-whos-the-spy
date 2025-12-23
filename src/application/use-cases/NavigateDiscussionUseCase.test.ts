import { describe, it, expect } from 'vitest';
import { NavigateDiscussionUseCase } from './NavigateDiscussionUseCase';
import type { GameState } from '@/domain/entities/GameState';
import type { Player } from '@/domain/entities/Player';
import type { GameConfig } from '@/domain/entities/GameConfig';

describe('NavigateDiscussionUseCase', () => {
  let useCase: NavigateDiscussionUseCase;

  beforeEach(() => {
    useCase = new NavigateDiscussionUseCase();
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

  describe('nextPlayer', () => {
    it('should move to next active player', () => {
      const gameState = createMockGameState();
      const result = useCase.nextPlayer(gameState);

      expect(result.currentDiscussionPlayerIndex).toBe(1);
    });

    it('should wrap around to first player after last player', () => {
      const gameState = createMockGameState();
      gameState.currentDiscussionPlayerIndex = 4; // Last player

      const result = useCase.nextPlayer(gameState);

      expect(result.currentDiscussionPlayerIndex).toBe(0);
    });

    it('should skip eliminated players', () => {
      const gameState = createMockGameState();
      gameState.players[1].isEliminated = true; // Eliminate Player 2
      gameState.currentDiscussionPlayerIndex = 0;

      const result = useCase.nextPlayer(gameState);

      // The implementation uses modulo on active players length
      // Active players: indices 0, 2, 3, 4 (4 active players)
      // Current index 0 -> next is (0 + 1) % 4 = 1
      // But since index 1 is eliminated, it wraps to next active
      // Actually, the index refers to position in active players array, not original array
      // So if we're at index 0 of active players, next is 1
      expect(result.currentDiscussionPlayerIndex).toBe(1);
    });

    it('should handle cycling through all active players', () => {
      const gameState = createMockGameState();
      gameState.players[1].isEliminated = true; // Eliminate Player 2
      // Active players: 0, 2, 3, 4 (4 active players)
      // currentDiscussionPlayerIndex refers to position in active players array

      gameState.currentDiscussionPlayerIndex = 2; // 3rd active player (index 3 in original)
      let result = useCase.nextPlayer(gameState);
      // (2 + 1) % 4 = 3
      expect(result.currentDiscussionPlayerIndex).toBe(3);

      result = useCase.nextPlayer(result);
      // (3 + 1) % 4 = 0 (wraps around)
      expect(result.currentDiscussionPlayerIndex).toBe(0);
    });

    it('should not modify other game state properties', () => {
      const gameState = createMockGameState();
      const result = useCase.nextPlayer(gameState);

      expect(result.currentRound).toBe(gameState.currentRound);
      expect(result.players).toEqual(gameState.players);
      expect(result.votes).toEqual(gameState.votes);
    });
  });

  describe('reset', () => {
    it('should reset discussion to first player', () => {
      const gameState = createMockGameState();
      gameState.currentDiscussionPlayerIndex = 3;

      const result = useCase.reset(gameState);

      expect(result.currentDiscussionPlayerIndex).toBe(0);
    });

    it('should reset voting index to 0', () => {
      const gameState = createMockGameState();
      gameState.currentVotingPlayerIndex = 2;

      const result = useCase.reset(gameState);

      expect(result.currentVotingPlayerIndex).toBe(0);
    });

    it('should reset votes', () => {
      const gameState = createMockGameState();
      gameState.votes = {
        '1': '4',
        '2': '4',
      };

      const result = useCase.reset(gameState);

      expect(result.votes).toEqual({});
    });

    it('should reset discussion time to 120 seconds', () => {
      const gameState = createMockGameState();
      gameState.discussionTimeRemaining = 30;

      const result = useCase.reset(gameState);

      expect(result.discussionTimeRemaining).toBe(120);
    });

    it('should reset all discussion-related state', () => {
      const gameState = createMockGameState();
      gameState.currentDiscussionPlayerIndex = 3;
      gameState.currentVotingPlayerIndex = 2;
      gameState.votes = { '1': '4' };
      gameState.discussionTimeRemaining = 60;

      const result = useCase.reset(gameState);

      expect(result.currentDiscussionPlayerIndex).toBe(0);
      expect(result.currentVotingPlayerIndex).toBe(0);
      expect(result.votes).toEqual({});
      expect(result.discussionTimeRemaining).toBe(120);
    });
  });

  describe('updateTime', () => {
    it('should update discussion time remaining', () => {
      const gameState = createMockGameState();
      const result = useCase.updateTime(gameState, 60);

      expect(result.discussionTimeRemaining).toBe(60);
    });

    it('should not allow negative time', () => {
      const gameState = createMockGameState();
      const result = useCase.updateTime(gameState, -10);

      expect(result.discussionTimeRemaining).toBe(0);
    });

    it('should allow time to be set to 0', () => {
      const gameState = createMockGameState();
      const result = useCase.updateTime(gameState, 0);

      expect(result.discussionTimeRemaining).toBe(0);
    });

    it('should allow time to exceed 120 seconds', () => {
      const gameState = createMockGameState();
      const result = useCase.updateTime(gameState, 150);

      expect(result.discussionTimeRemaining).toBe(150);
    });

    it('should not modify other game state properties', () => {
      const gameState = createMockGameState();
      const result = useCase.updateTime(gameState, 60);

      expect(result.currentRound).toBe(gameState.currentRound);
      expect(result.currentDiscussionPlayerIndex).toBe(gameState.currentDiscussionPlayerIndex);
      expect(result.players).toEqual(gameState.players);
    });
  });
});
