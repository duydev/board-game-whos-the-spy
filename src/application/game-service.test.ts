import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameService } from './game-service';
import type { GameConfig } from '@/domain/entities/GameConfig';
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import type { IGameStorageRepository } from '@/domain/repositories/IGameStorageRepository';
import type { WordPair } from '@/domain/value-objects/WordPair';
import type { GameState } from '@/domain/entities/GameState';

describe('GameService', () => {
  let gameService: GameService;
  let mockCategoryRepository: ICategoryRepository;
  let mockStorageRepository: IGameStorageRepository;

  beforeEach(() => {
    mockCategoryRepository = {
      getAvailableCategories: vi.fn().mockResolvedValue(['Động vật', 'Đồ ăn']),
      selectRandomWordPair: vi.fn().mockResolvedValue(['Chó', 'Mèo'] as WordPair),
      getCategoryDisplayName: vi.fn((category: string) => category),
    };

    mockStorageRepository = {
      saveGameState: vi.fn().mockResolvedValue(undefined),
      loadGameState: vi.fn().mockResolvedValue(null),
      clearGameState: vi.fn().mockResolvedValue(undefined),
    };

    gameService = new GameService(mockCategoryRepository, mockStorageRepository);
  });

  describe('startGame', () => {
    it('should start game and save to storage', async () => {
      const config: GameConfig = {
        totalPlayers: 5,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      const playerNames = ['P1', 'P2', 'P3', 'P4', 'P5'];

      const gameState = await gameService.startGame(config, playerNames);

      expect(gameState.config).toEqual(config);
      expect(gameState.players).toHaveLength(5);
      expect(mockStorageRepository.saveGameState).toHaveBeenCalledWith(gameState);
    });
  });

  describe('submitVote', () => {
    it('should submit vote and save to storage', async () => {
      const gameState = await createMockGameState();
      const voterId = gameState.players[0].id;
      const votedPlayerId = gameState.players[3].id; // The spy
      const result = await gameService.submitVote(gameState, voterId, votedPlayerId);

      expect(result.votes[voterId]).toBe(votedPlayerId);
      expect(mockStorageRepository.saveGameState).toHaveBeenCalled();
    });

    it('should throw error when vote submission fails', async () => {
      const gameState = await createMockGameState();
      const voterId = gameState.players[0].id;
      const votedPlayerId = gameState.players[3].id;
      gameState.players[0].isEliminated = true; // Eliminate voter

      await expect(gameService.submitVote(gameState, voterId, votedPlayerId)).rejects.toThrow();
    });
  });

  describe('finishVoting', () => {
    it('should finish voting and save to storage', async () => {
      const gameState = await createMockGameState();
      const spyPlayer = gameState.players.find((p) => p.role === 'spy')!;
      const civilian1 = gameState.players.find((p) => p.role === 'civilian')!;
      const civilian2 = gameState.players.filter((p) => p.role === 'civilian')[1];
      const civilian3 = gameState.players.filter((p) => p.role === 'civilian')[2];

      gameState.votes = {
        [civilian1.id]: spyPlayer.id,
        [civilian2.id]: spyPlayer.id,
        [civilian3.id]: spyPlayer.id,
      };

      const result = await gameService.finishVoting(gameState);

      expect(result.players.find((p) => p.id === spyPlayer.id)?.isEliminated).toBe(true);
      expect(mockStorageRepository.saveGameState).toHaveBeenCalled();
    });
  });

  describe('nextDiscussionPlayer', () => {
    it('should move to next discussion player and save to storage', async () => {
      const gameState = await createMockGameState();
      const result = await gameService.nextDiscussionPlayer(gameState);

      expect(result.currentDiscussionPlayerIndex).toBe(1);
      expect(mockStorageRepository.saveGameState).toHaveBeenCalled();
    });
  });

  describe('resetDiscussion', () => {
    it('should reset discussion and save to storage', async () => {
      const gameState = await createMockGameState();
      gameState.currentDiscussionPlayerIndex = 3;
      gameState.votes = { '1': '4' };

      const result = await gameService.resetDiscussion(gameState);

      expect(result.currentDiscussionPlayerIndex).toBe(0);
      expect(result.votes).toEqual({});
      expect(mockStorageRepository.saveGameState).toHaveBeenCalled();
    });
  });

  describe('updateDiscussionTime', () => {
    it('should update discussion time and save to storage', async () => {
      const gameState = await createMockGameState();
      const result = await gameService.updateDiscussionTime(gameState, 60);

      expect(result.discussionTimeRemaining).toBe(60);
      expect(mockStorageRepository.saveGameState).toHaveBeenCalled();
    });
  });

  describe('loadGameState', () => {
    it('should load game state from storage', async () => {
      const savedState = await createMockGameState();
      mockStorageRepository.loadGameState = vi.fn().mockResolvedValue(savedState);

      const result = await gameService.loadGameState();

      expect(result).toEqual(savedState);
      expect(mockStorageRepository.loadGameState).toHaveBeenCalled();
    });

    it('should return null when no game state in storage', async () => {
      mockStorageRepository.loadGameState = vi.fn().mockResolvedValue(null);

      const result = await gameService.loadGameState();

      expect(result).toBe(null);
    });
  });

  describe('clearGameState', () => {
    it('should clear game state from storage', async () => {
      await gameService.clearGameState();

      expect(mockStorageRepository.clearGameState).toHaveBeenCalled();
    });
  });

  describe('getVoteResults', () => {
    it('should return vote results', () => {
      const gameState = {
        players: [
          { id: '1', name: 'P1', role: 'civilian', word: 'Chó', isEliminated: false },
          { id: '2', name: 'P2', role: 'civilian', word: 'Mèo', isEliminated: false },
          { id: '4', name: 'P4', role: 'spy', isEliminated: false },
        ],
        votes: {
          '1': '4',
          '2': '4',
        },
      } as unknown as GameState;

      const results = gameService.getVoteResults(gameState);

      expect(results).toHaveLength(3);
      const player4Result = results.find((r) => r.playerId === '4');
      expect(player4Result?.voteCount).toBe(2);
    });
  });

  describe('getPlayerWithMostVotes', () => {
    it('should return player with most votes', () => {
      const gameState = {
        players: [
          { id: '1', name: 'P1', role: 'civilian', word: 'Chó', isEliminated: false },
          { id: '4', name: 'P4', role: 'spy', isEliminated: false },
        ],
        votes: {
          '1': '4',
        },
      } as unknown as GameState;

      const result = gameService.getPlayerWithMostVotes(gameState);

      expect(result).toBe('4');
    });

    it('should return null when no votes', () => {
      const gameState = {
        players: [{ id: '1', name: 'P1', role: 'civilian', word: 'Chó', isEliminated: false }],
        votes: {},
      } as unknown as GameState;

      const result = gameService.getPlayerWithMostVotes(gameState);

      expect(result).toBe(null);
    });
  });

  // Helper function to create mock game state
  async function createMockGameState(): Promise<GameState> {
    const config: GameConfig = {
      totalPlayers: 5,
      numberOfSpies: 1,
      category: 'Động vật',
    };
    return await gameService.startGame(config, ['P1', 'P2', 'P3', 'P4', 'P5']);
  }
});
