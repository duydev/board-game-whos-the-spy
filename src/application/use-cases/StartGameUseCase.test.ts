import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StartGameUseCase } from './StartGameUseCase';
import type { GameConfig } from '@/domain/entities/GameConfig';
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import type { WordPair } from '@/domain/value-objects/WordPair';

describe('StartGameUseCase', () => {
  let useCase: StartGameUseCase;
  let mockCategoryRepository: ICategoryRepository;

  beforeEach(() => {
    mockCategoryRepository = {
      getAvailableCategories: vi.fn().mockResolvedValue(['Động vật', 'Đồ ăn']),
      selectRandomWordPair: vi.fn().mockResolvedValue(['Chó', 'Mèo'] as WordPair),
      getCategoryDisplayName: vi.fn((category: string) => category),
    };
    useCase = new StartGameUseCase(mockCategoryRepository);
  });

  describe('execute', () => {
    it('should start game successfully with valid config and player names', async () => {
      const config: GameConfig = {
        totalPlayers: 5,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];

      const gameState = await useCase.execute(config, playerNames);

      expect(gameState.config).toEqual(config);
      expect(gameState.players).toHaveLength(5);
      expect(gameState.players.every((p) => playerNames.includes(p.name))).toBe(true);
      expect(gameState.currentRound).toBe(1);
      expect(gameState.wordPair).toEqual(['Chó', 'Mèo']);
    });

    it('should assign correct number of spies', async () => {
      const config: GameConfig = {
        totalPlayers: 5,
        numberOfSpies: 2,
        category: 'Động vật',
      };
      const playerNames = ['P1', 'P2', 'P3', 'P4', 'P5'];

      const gameState = await useCase.execute(config, playerNames);

      const spies = gameState.players.filter((p) => p.role === 'spy');
      expect(spies).toHaveLength(2);
    });

    it('should throw error when player names count does not match totalPlayers', async () => {
      const config: GameConfig = {
        totalPlayers: 5,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      const playerNames = ['P1', 'P2', 'P3']; // Only 3 names

      await expect(useCase.execute(config, playerNames)).rejects.toThrow(
        'Expected 5 players, but got 3'
      );
    });

    it('should throw error when player names count is less than 3', async () => {
      const config: GameConfig = {
        totalPlayers: 3,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      const playerNames = ['P1', 'P2']; // Only 2 names

      await expect(useCase.execute(config, playerNames)).rejects.toThrow(
        'Expected 3 players, but got 2'
      );
    });

    it('should throw error when less than 3 players provided', async () => {
      const config: GameConfig = {
        totalPlayers: 2,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      const playerNames = ['P1', 'P2'];

      await expect(useCase.execute(config, playerNames)).rejects.toThrow(
        'Game requires at least 3 players'
      );
    });

    it('should call categoryRepository with correct category', async () => {
      const config: GameConfig = {
        totalPlayers: 3,
        numberOfSpies: 1,
        category: 'Đồ ăn',
      };
      const playerNames = ['P1', 'P2', 'P3'];

      await useCase.execute(config, playerNames);

      expect(mockCategoryRepository.selectRandomWordPair).toHaveBeenCalledWith('Đồ ăn');
    });

    it('should call categoryRepository with random when category is random', async () => {
      const config: GameConfig = {
        totalPlayers: 3,
        numberOfSpies: 1,
        category: 'random',
      };
      const playerNames = ['P1', 'P2', 'P3'];

      await useCase.execute(config, playerNames);

      expect(mockCategoryRepository.selectRandomWordPair).toHaveBeenCalledWith('random');
    });

    it('should initialize game state with correct default values', async () => {
      const config: GameConfig = {
        totalPlayers: 4,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      const playerNames = ['P1', 'P2', 'P3', 'P4'];

      const gameState = await useCase.execute(config, playerNames);

      expect(gameState.currentRound).toBe(1);
      expect(gameState.currentDiscussionPlayerIndex).toBe(0);
      expect(gameState.currentVotingPlayerIndex).toBe(0);
      expect(gameState.votes).toEqual({});
      expect(gameState.winner).toBe(null);
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.discussionTimeRemaining).toBe(120);
    });
  });
});
